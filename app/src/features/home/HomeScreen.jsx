import { View } from "react-native";
import CustomButton from "../../components/CustomButton";
import ProgressBar from "./components/ProgressBar";
import { useState, useEffect } from "react";
import timer from "../../utils/timer";

export default function HomeScreen() {
  const [isRunning, setIsRunning] = useState(false);

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
    
    // Reiniciar el temporizador con el nuevo tipo
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