import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useEffect, useState, useCallback } from "react";
import timer from "../../../utils/timer";

export default function ProgressBar() {
  const [time, setTime] = useState(timer.getCurrentTime());
  const [progress, setProgress] = useState(0);
  const [timerType, setTimerType] = useState(timer.getState().timerType);

  const updateTimer = useCallback(() => {
    setTime(timer.getCurrentTime());
    setProgress(timer.getProgress());
    setTimerType(timer.getState().timerType);
  }, []);

  useEffect(() => {
    // Actualizar cada segundo
    const interval = setInterval(updateTimer, 1000);
    
    // Suscribirse a cambios de estado del temporizador
    const onStateChange = () => {
      updateTimer();
    };
    
    timer.on('stateChange', onStateChange);
    timer.on('tick', updateTimer);

    return () => {
      clearInterval(interval);
      timer.off('stateChange', onStateChange);
      timer.off('tick', updateTimer);
    };
  }, [updateTimer]);

  const size = 350;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // Colores basados en el tipo de temporizador
  const getColors = () => {
    switch(timerType) {
      case 'work':
        return { background: '#125612', progress: '#17CF17' };
      case 'shortBreak':
        return { background: '#12565a', progress: '#17b7cf' };
      case 'longBreak':
        return { background: '#2a1256', progress: '#6b17cf' };
      default:
        return { background: '#125612', progress: '#17CF17' };
    }
  };

  const colors = getColors();

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        {/* Fondo del círculo */}
        <Circle
          stroke={colors.background}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          opacity={0.2}
        />
        {/* Barra de progreso */}
        <Circle
          stroke={colors.progress}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View className="absolute items-center justify-center">
        <Text className="text-6xl font-bold text-white">
          {time}
        </Text>
        <Text className="text-white text-sm mt-1">
          {timerType === 'work' ? 'Trabajo' : 
           timerType === 'shortBreak' ? 'Descanso Corto' : 'Descanso Largo'}
        </Text>
      </View>
    </View>
  );
}