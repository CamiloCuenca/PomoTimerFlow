import { View, AppState, Text, Platform } from "react-native";
import CustomButton from "../../components/CustomButton";
import ProgressBar from "./components/ProgressBar";
import { useState, useEffect, useRef } from "react";
import timer, { initAppStateListener, loadTimerState, clearTimerState } from "../../utils/timer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotificationsAsync, scheduleNotification, cancelScheduledNotification } from "../../services/notification";
import { useTheme } from "../../hooks/useTheme";
import { useTaskContext } from "../../context/TaskContext";
import { Provider as PaperProvider, FAB, Portal, Button } from "react-native-paper";
import { Menu } from "lucide-react-native";

import { Modal, Pressable, ScrollView } from "react-native";
import { useLocalization } from '../../context/LocalizationContext';

const storeSession = async (type) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const existingSessions = await AsyncStorage.getItem('sessions');
    const sessions = existingSessions ? JSON.parse(existingSessions) : [];

    sessions.push({
      type,
      date: today
    });

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
  // Ref para almacenar el id de la notificación programada (puede venir de móvil o web)
  const notificationIdRef = useRef(null);


  useEffect(() => {
    activeTaskIdRef.current = activeTaskId;
  }, [activeTaskId]);

  // Inicializar el estado del temporizador al cargar el componente
  useEffect(() => {
    const initTimer = async () => {
      const savedState = await loadTimerState();
      if (savedState) {
        setIsRunning(savedState.isRunning);
      }
      // Registrar permisos/ajustes de notificación al iniciar (no bloqueante)
      try {
        await registerForPushNotificationsAsync();
      } catch (e) {
        console.log('registerForPushNotificationsAsync error:', e);
      }
    };

    initTimer();
    initAppStateListener();

    // Suscribirse al evento de finalización del temporizador
    const onTimerComplete = async () => {
      const currentState = timer.getState();
      await storeSession(currentState.timerType);


      if (currentState.timerType === 'work' && activeTaskIdRef.current) {
        console.log(' Incrementando pomodoros para tarea:', activeTaskIdRef.current);
        await incrementPomodoros(activeTaskIdRef.current);
      } else {
        console.log('⚠️ No se incrementa - Tipo:', currentState.timerType, 'Tarea activa:', activeTaskIdRef.current);
      }

      // Si la app estaba en foreground cuando terminó, cancelar la notificación programada
      try {
        if (appState.current === 'active' && notificationIdRef.current) {
          await cancelScheduledNotification(notificationIdRef.current);
          notificationIdRef.current = null;
        }
      } catch (e) {
        console.log('Error cancelling notification on complete:', e);
      }

      setIsRunning(false);
    };

    timer.on('complete', onTimerComplete);


    return () => {
      timer.off('complete', onTimerComplete);
    };
  }, []);


  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && appState.current.match(/inactive|background/)) {
        const currentState = timer.getState();
        setIsRunning(currentState.isRunning);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Manejo de inicio/pausa: al iniciar programamos la notificación basada en remainingSeconds;
  // al pausar cancelamos la notificación programada.
  const handleStartPause = async () => {
    if (isRunning) {
      // Pausar: detener timer y cancelar notificación programada
      timer.pause();
      try {
        if (notificationIdRef.current) {
          await cancelScheduledNotification(notificationIdRef.current);
          notificationIdRef.current = null;
        }
      } catch (e) {
        console.log('Error cancelling notification on pause:', e);
      }
    } else {
      // Iniciar: obtener remainingSeconds y programar notificación
      const currentState = timer.getState();
      const remaining = Math.max(0, Number(currentState.remainingSeconds) || 0);

      try {
        const id = await scheduleNotification({
          title: t('home.notification_title') || 'Pomo terminado',
          body: t('home.notification_body') || 'Tu pomodoro ha finalizado',
          seconds: remaining
        });

        if (id) notificationIdRef.current = id;
      } catch (e) {
        console.log('Error scheduling notification on start:', e);
      }

      // Iniciamos el timer aunque la programación falle
      timer.start();
    }

    setIsRunning(!isRunning);
  };

  const handleReset = async () => {
    timer.reset();
    setIsRunning(false);
    await clearTimerState();
    // Cancelar cualquier notificación programada al resetear
    try {
      if (notificationIdRef.current) {
        await cancelScheduledNotification(notificationIdRef.current);
        notificationIdRef.current = null;
      }
    } catch (e) {
      console.log('Error cancelling notification on reset:', e);
    }
  };

  const handleCambiar = () => {
    const currentState = timer.getState();
    timer.setTimerType(currentState.timerType === 'work' ? 'shortBreak' : 'work');
    timer.reset();
    setIsRunning(false);
  };

  return (
    <PaperProvider>
      <View style={{ backgroundColor: theme.colors.bgMain }} className="flex-1 items-center justify-center gap-6">
        {/* SEO: h1 oculto solo en web */}
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
        {/* Selector de tarea activa (solo FAB como trigger) */}
        <Modal
          visible={selectorVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectorVisible(false)}
        >
          <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
            <View className="rounded-t-3xl p-6" style={{ backgroundColor: theme.colors.bgMain }}>
              <Text style={{ color: theme.colors.text }} className="text-lg font-semibold mb-4">{t('home.select_task')}</Text>
              <ScrollView style={{ maxHeight: 300 }}>
                <Pressable onPress={() => { setActiveTask(null); setSelectorVisible(false); }} className="px-4 py-3 rounded-xl mb-2" style={{ borderWidth: 1, borderColor: theme.colors.primary }}>
                  <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>{t('task.status_sin_tarea')}</Text>
                </Pressable>
                {tasks
                  .filter(t => t.status === 'New Task' || t.status === 'In Progress')
                  .sort((a, b) => {
                    const order = { 'In Progress': 0, 'New Task': 1 };
                    return (order[a.status] ?? 2) - (order[b.status] ?? 2);
                  })
                  .map(t => (
                    <Pressable key={t.id} onPress={() => { setActiveTask(t.id); setSelectorVisible(false); }} className="px-4 py-3 rounded-xl mb-2" style={{ borderWidth: 1, borderColor: theme.colors.textSecondary, backgroundColor: theme.colors.bgDarkGreen }}>
                      <Text style={{ color: theme.colors.text }}>{t.title} {t.status === 'In Progress' ? '⏳' : ''}</Text>
                    </Pressable>
                  ))}
                {tasks.filter(t => t.status === 'New Task' || t.status === 'In Progress').length === 0 && (
                  <Text style={{ color: theme.colors.textSecondary }}>{t('home.no_tasks_available')}</Text>
                )}
              </ScrollView>
              <View className="items-end mt-2">
                <Button onPress={() => setSelectorVisible(false)} textColor={theme.colors.primary}>{t('settings.close')}</Button>
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
