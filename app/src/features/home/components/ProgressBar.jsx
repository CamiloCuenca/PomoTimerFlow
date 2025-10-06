import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useEffect, useState } from "react";
import timer from "../../../utils/timer";

export default function ProgressBar() {
  const [time, setTime] = useState(timer.getCurrentTime());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      setTime(timer.getCurrentTime());
      setProgress(timer.getProgress());
    };

    // Actualizar cada segundo
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const size = 350;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        {/* Fondo del círculo */}
        <Circle
          stroke="#4B5563"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          opacity={0.2}
        />
        {/* Barra de progreso */}
        <Circle
          stroke="#17CF17"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-180"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View className="absolute items-center justify-center">
        <Text className="text-5xl font-bold text-white">
          {time}
        </Text>
        <Text className="text-white mt-2">
          {timer.getState().timerType === 'work' ? 'Trabajo' : 'Descanso'}
        </Text>
      </View>
    </View>
  );
}