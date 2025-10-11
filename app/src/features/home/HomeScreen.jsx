import { View } from "react-native";
import CustomButton from "../../components/CustomButton";
import ProgressBar from "./components/ProgressBar";
import { useState, useEffect } from "react";
import timer from "../../utils/timer";
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

  useEffect(() => {
    // Suscribirse al evento de finalización del temporizador
    const onTimerComplete = () => {
      const currentState = timer.getState();
      // Solo guardar cuando el temporizador se complete, no en cambios manuales
      storeSession(currentState.timerType);
      handleStartPause();
    };
    
    timer.on('complete', onTimerComplete);

    // Limpiar el listener al desmontar
    return () => {
      timer.off('complete', onTimerComplete);
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

  const handleReset = () => {
    timer.reset();
    setIsRunning(false);
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