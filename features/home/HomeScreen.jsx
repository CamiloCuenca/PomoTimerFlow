import { View, AppState, Text } from "react-native";
import CustomButton from "../../components/CustomButton";
import ProgressBar from "./components/ProgressBar";
import { useState, useEffect, useRef } from "react";
import timer, { initAppStateListener, loadTimerState, clearTimerState } from "../../utils/timer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { mostrarNotificacionLocal, registerForPushNotificationsAsync } from "../../services/notification";
import { useTheme } from "../../hooks/useTheme";
import { useTaskContext } from "../../context/TaskContext";
import { Provider as PaperProvider, FAB, Portal, Button } from "react-native-paper";

import { Modal, Pressable, ScrollView } from "react-native";

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

  // Inicializar el estado del temporizador al cargar el componente
  useEffect(() => {
    const initTimer = async () => {
      const savedState = await loadTimerState();
      if (savedState) {
        setIsRunning(savedState.isRunning);
      }
    };

    initTimer();
    initAppStateListener();
    registerForPushNotificationsAsync();

    // Configurar el listener para notificaciones
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notificación recibida:', response);
    });

    // Suscribirse al evento de finalización del temporizador
    const onTimerComplete = async () => {
      const currentState = timer.getState();
      await storeSession(currentState.timerType);
      // Si fue una sesión de trabajo y hay tarea activa, incrementa su contador
      if (currentState.timerType === 'work' && activeTaskId) {
        await incrementPomodoros(activeTaskId);
      }
      setIsRunning(false);
      await mostrarNotificacionLocal({
        title: '¡Sesión completada!',
        body: `Has terminado una sesión de ${currentState.timerType === 'work' ? 'trabajo' : 'descanso'}.`,
        seconds: 1,
      });
    };

    timer.on('complete', onTimerComplete);

    // Limpiar los listeners al desmontar
    return () => {
      subscription.remove();
      timer.off('complete', onTimerComplete);
    };
  }, []);

  // Manejar cambios en el estado de la aplicación
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

  const handleStartPause = () => {
    if (isRunning) {
      timer.pause();
    } else {
      timer.start();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = async () => {
    timer.reset();
    setIsRunning(false);
    await clearTimerState();
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
        {/* Selector de tarea activa (solo FAB como trigger) */}
        <Modal
          visible={selectorVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectorVisible(false)}
        >
          <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
            <View className="rounded-t-3xl p-6" style={{ backgroundColor: theme.colors.bgMain }}>
              <Text style={{ color: theme.colors.text }} className="text-lg font-semibold mb-4">Selecciona tarea</Text>
              <ScrollView style={{ maxHeight: 300 }}>
                <Pressable onPress={() => { setActiveTask(null); setSelectorVisible(false); }} className="px-4 py-3 rounded-xl mb-2" style={{ borderWidth: 1, borderColor: theme.colors.primary }}>
                  <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Sin tarea</Text>
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
                  <Text style={{ color: theme.colors.textSecondary }}>No hay tareas disponibles</Text>
                )}
              </ScrollView>
              <View className="items-end mt-2">
                <Button onPress={() => setSelectorVisible(false)} textColor={theme.colors.primary}>Cerrar</Button>
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
        <View className="flex-row gap-10">
          <CustomButton
            title={isRunning ? "Pausar" : "Iniciar"}
            onPress={handleStartPause}
            style="primary"
          />
          <CustomButton
            title="Reiniciar"
            onPress={handleReset}
            style="secondary"
          />
        </View>
        <CustomButton
          title="Cambiar"
          onPress={handleCambiar}
          style="secondary"
        />

      </View>
      <Portal>
        <FAB
          icon="menu"
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


