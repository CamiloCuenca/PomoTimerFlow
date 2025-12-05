import { View, AppState } from "react-native";
import CustomButton from "../../components/CustomButton";
import ProgressBar from "./components/ProgressBar";
import { useState, useEffect, useRef } from "react";
import timer, { initAppStateListener, loadTimerState, clearTimerState } from "../../utils/timer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { mostrarNotificacionLocal, registerForPushNotificationsAsync } from "../../services/notification";

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
    <View className="flex-1 items-center justify-center bg-bgMain gap-10">
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
  );
}