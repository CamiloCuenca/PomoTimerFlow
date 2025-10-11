import { View, AppState } from "react-native";
import CustomButton from "../../components/CustomButton";
import ProgressBar from "./components/ProgressBar";
import { useState, useEffect, useRef } from "react";
import timer, { initAppStateListener, loadTimerState, clearTimerState } from "../../utils/timer";
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeSession = async (type) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const existingSessions = await AsyncStorage.getItem('sessions');
    const sessions = existingSessions ? JSON.parse(existingSessions) : [];
    
    // Agregar nueva sesión con fecha
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
    
    // Inicializar el listener de cambio de estado de la app
    initAppStateListener();
    
    // Suscribirse al evento de finalización del temporizador
    const onTimerComplete = () => {
      const currentState = timer.getState();
      storeSession(currentState.timerType);
      setIsRunning(false);
    };
    
    timer.on('complete', onTimerComplete);

    // Limpiar el listener al desmontar
    return () => {
      timer.off('complete', onTimerComplete);
    };
  }, []);
  
  // Manejar cambios en el estado de la aplicación
 useEffect(() => {
  const subscription = AppState.addEventListener('change', nextAppState => {
    if (nextAppState === 'active' && appState.current.match(/inactive|background/)) {
      // Actualizamos el estado local basado en el estado real del temporizador
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
    if (currentState.timerType === 'work') {
      timer.setTimerType('shortBreak');
    } else {
      timer.setTimerType('work');
    }
    // No guardamos la sesión aquí, solo en el evento de finalización
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