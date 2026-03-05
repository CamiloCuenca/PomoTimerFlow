import { View, AppState, Text, Platform } from "react-native";
import CustomButton from "../../components/CustomButton";
import ProgressBar from "./components/ProgressBar";
import { useState, useEffect, useRef } from "react";
import timer, { initAppStateListener, loadTimerState, clearTimerState } from "../../utils/timer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotificationsAsync, cancelScheduledNotification, mostrarNotificacionLocal, scheduleNotification } from "../../services/notification";
import { useTheme } from "../../hooks/useTheme";
import { useTaskContext } from "../../context/TaskContext";
import { Provider as PaperProvider, FAB, Portal, Button } from "react-native-paper";
import { Menu } from "lucide-react-native";
import { Modal, Pressable, ScrollView } from "react-native";
import { useLocalization } from '../../context/LocalizationContext';
import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';

const storeSession = async (type) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const existingSessions = await AsyncStorage.getItem('sessions');
    const sessions = existingSessions ? JSON.parse(existingSessions) : [];
    sessions.push({ type, date: today });
    await AsyncStorage.setItem('sessions', JSON.stringify(sessions));
  } catch (e) {
    console.error('Error al guardar sesión:', e);
  }
};

export default function HomeScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const appState = useRef(AppState.currentState);
  const { theme } = useTheme();
  const { tasks, activeTaskId, setActiveTask, incrementPomodoros } = useTaskContext();
  const [selectorVisible, setSelectorVisible] = useState(false);
  const { t } = useLocalization();

  const activeTaskIdRef = useRef(activeTaskId);
  const notificationIdRef = useRef(null);
  const bannerRef = useRef(null);

  // Helper para obtener textos de notificación según el tipo de timer
  const getNotificationTexts = (timerType) => {
    const title = timerType === 'work'
        ? (t('home.notification_work_complete') || '✅ Sesión completada')
        : (t('home.notification_break_complete') || '⏰ Descanso terminado');
    const body = timerType === 'work'
        ? (t('home.notification_work_body') || '¡Tiempo de descanso!')
        : (t('home.notification_break_body') || '¡De vuelta al trabajo!');
    return { title, body };
  };

  // Helper para programar notificación y guardar el id
  const programarNotificacion = async (timeLeft, timerType) => {
    const { title, body } = getNotificationTexts(timerType);
    const id = await scheduleNotification({ title, body, seconds: timeLeft, timerType });
    notificationIdRef.current = id;
    console.log('🔔 Notificación programada para', timeLeft, 'segundos. ID:', id);
  };

  // Helper para cancelar notificación programada
  const cancelarNotificacion = async () => {
    if (notificationIdRef.current) {
      await cancelScheduledNotification(notificationIdRef.current);
      notificationIdRef.current = null;
      console.log('🔕 Notificación programada cancelada');
    }
  };

  useEffect(() => {
    activeTaskIdRef.current = activeTaskId;
  }, [activeTaskId]);

  // Inicializar
  useEffect(() => {
    const initTimer = async () => {
      const savedState = await loadTimerState();
      if (savedState) {
        setIsRunning(savedState.isRunning);

        // Si el timer estaba corriendo cuando se cerró la app,
        // programar notificación para el tiempo restante restaurado
        if (savedState.isRunning && savedState.timeLeft > 0) {
          await programarNotificacion(savedState.timeLeft, savedState.timerType);
        }
      }

      try {
        await registerForPushNotificationsAsync();
      } catch (e) {
        console.log('registerForPushNotificationsAsync error:', e);
      }
    };

    initTimer();
    initAppStateListener();

    // Evento cuando el timer termina un segmento
    const onTimerComplete = async () => {
      const currentState = timer.getState();
      console.log('🔔 Timer completado:', currentState.timerType);

      // CANCELAR notificación programada (la app estaba abierta, no necesitamos la del OS)
      await cancelarNotificacion();

      await storeSession(currentState.timerType);

      if (currentState.timerType === 'work' && activeTaskIdRef.current) {
        console.log('🍅 Incrementando pomodoros para tarea:', activeTaskIdRef.current);
        await incrementPomodoros(activeTaskIdRef.current);
      }

      // MOSTRAR NOTIFICACIÓN LOCAL INMEDIATAMENTE (app abierta)
      const { title, body } = getNotificationTexts(currentState.timerType);
      try {
        await mostrarNotificacionLocal({ title, body, seconds: 0 });
        console.log('✅ Notificación local mostrada');
      } catch (e) {
        console.log('❌ Error mostrando notificación:', e);
      }

      setIsRunning(false);
      // Nota: NO programamos la siguiente notificación aquí.
      // El evento 'segmentStarted' de timer.js lo hará de forma limpia.
    };

    // ✅ Evento cuando timer.js auto-inicia el siguiente segmento
    // Reemplaza el setTimeout anterior — más limpio y confiable
    const onSegmentStarted = async ({ timerType, timeLeft }) => {
      console.log('▶️ Nuevo segmento auto-iniciado:', timerType, '- programando notificación para', timeLeft, 'segundos');
      await cancelarNotificacion(); // por si acaso queda alguna
      await programarNotificacion(timeLeft, timerType);
      setIsRunning(true);
    };

    timer.on('complete', onTimerComplete);
    timer.on('segmentStarted', onSegmentStarted);

    return () => {
      timer.off('complete', onTimerComplete);
      timer.off('segmentStarted', onSegmentStarted);
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async nextAppState => {
      if (nextAppState === 'active' && appState.current.match(/inactive|background/)) {
        // App volvió al frente: sincronizar estado del timer
        const currentState = timer.getState();
        setIsRunning(currentState.isRunning);
        console.log('📱 App activa - timer isRunning:', currentState.isRunning, 'timeLeft:', currentState.timeLeft);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleStartPause = async () => {
    if (isRunning) {
      // PAUSAR
      console.log('⏸️ Pausando');
      timer.pause();
      await cancelarNotificacion();
    } else {
      // INICIAR
      console.log('▶️ Iniciando');
      timer.start();

      // Programar notificación para cuando termine el segmento actual
      // (será disparada por el OS aunque la app esté cerrada)
      const { timeLeft, timerType } = timer.getState();
      await programarNotificacion(timeLeft, timerType);
    }

    setIsRunning(!isRunning);
  };

  const handleReset = async () => {
    console.log('🔄 Reseteando');
    timer.reset();
    setIsRunning(false);
    await clearTimerState();
    await cancelarNotificacion();
  };

  const handleCambiar = () => {
    console.log('🔄 Cambiando tipo');
    const currentState = timer.getState();
    timer.setTimerType(currentState.timerType === 'work' ? 'shortBreak' : 'work');
    timer.reset();
    setIsRunning(false);
    cancelarNotificacion();
  };

  const canShowAds = Platform.OS !== 'web' && !!BannerAd;
  const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-6679191668109166/4855665722';

  useForeground(() => {
    if (Platform.OS === 'ios') {
      bannerRef.current?.load?.();
    }
  });

  return (
      <PaperProvider>
        <View style={{ backgroundColor: theme.colors.bgMain }} className="flex-1 items-center justify-start gap-6">

          {Platform.OS === 'web' && (
              <h1 style={{
                position: 'absolute',
                left: '-9999px',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
                opacity: 0
              }}>
                PomoTimerFlow | Mejora tu productividad
              </h1>
          )}

          {canShowAds ? (
              <View style={{ alignItems: 'center', marginTop: 0, marginBottom: 8 }}>
                <BannerAd
                    ref={bannerRef}
                    unitId={adUnitId}
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{ requestNonPersonalizedAdsOnly: true }}
                />
              </View>
          ) : null}

          <Modal
              visible={selectorVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setSelectorVisible(false)}
          >
            <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
              <View className="rounded-t-3xl p-6" style={{ backgroundColor: theme.colors.bgMain }}>
                <Text style={{ color: theme.colors.text }} className="text-lg font-semibold mb-4">
                  {t('home.select_task')}
                </Text>
                <ScrollView style={{ maxHeight: 300 }}>
                  <Pressable
                      onPress={() => { setActiveTask(null); setSelectorVisible(false); }}
                      className="px-4 py-3 rounded-xl mb-2"
                      style={{ borderWidth: 1, borderColor: theme.colors.primary }}
                  >
                    <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
                      {t('task.status_sin_tarea')}
                    </Text>
                  </Pressable>
                  {tasks
                      .filter(t => t.status === 'New Task' || t.status === 'In Progress')
                      .sort((a, b) => {
                        const order = { 'In Progress': 0, 'New Task': 1 };
                        return (order[a.status] ?? 2) - (order[b.status] ?? 2);
                      })
                      .map(t => (
                          <Pressable
                              key={t.id}
                              onPress={() => { setActiveTask(t.id); setSelectorVisible(false); }}
                              className="px-4 py-3 rounded-xl mb-2"
                              style={{
                                borderWidth: 1,
                                borderColor: theme.colors.textSecondary,
                                backgroundColor: theme.colors.bgDarkGreen
                              }}
                          >
                            <Text style={{ color: theme.colors.text }}>
                              {t.title} {t.status === 'In Progress' ? '⏳' : ''}
                            </Text>
                          </Pressable>
                      ))}
                  {tasks.filter(t => t.status === 'New Task' || t.status === 'In Progress').length === 0 && (
                      <Text style={{ color: theme.colors.textSecondary }}>
                        {t('home.no_tasks_available')}
                      </Text>
                  )}
                </ScrollView>
                <View className="items-end mt-2">
                  <Button onPress={() => setSelectorVisible(false)} textColor={theme.colors.primary}>
                    {t('settings.close')}
                  </Button>
                </View>
              </View>
            </View>
          </Modal>

          {activeTaskId && tasks.find(t => t.id === activeTaskId) && (
              <Text style={{ color: theme.colors.textSecondary, fontSize: 12, opacity: 0.6, marginBottom: -10 }}>
                {tasks.find(t => t.id === activeTaskId)?.title}
              </Text>
          )}

          <ProgressBar />

          <CustomButton
              title={isRunning ? t('home.pause') : t('home.start')}
              onPress={handleStartPause}
              style="primary"
          />

          <View className="flex-row gap-5">
            <CustomButton
                title={t('home.reset')}
                onPress={handleReset}
                style="secondary"
            />

            <CustomButton
                title={t('home.change')}
                onPress={handleCambiar}
                style="secondary"
            />
          </View>

        </View>

        <Portal>
          <FAB
              icon={Platform.OS === "web" ? (props) => <Menu color={props.color} size={props.size ?? 24} /> : "menu"}
              onPress={() => setSelectorVisible(true)}
              style={{
                position: "absolute",
                right: 16,
                bottom: 16,
                backgroundColor: theme.colors.primary,
              }}
              color={theme.colors.bgMain}
          />
        </Portal>
      </PaperProvider>
  );
}