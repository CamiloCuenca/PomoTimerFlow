import React, { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Svg, Circle, Line } from "react-native-svg";
import colors from '../constants/colors.json';
import { themeContext } from '../themesContext';

export default function Timer({ time, setTime, isPlaying }) {
  // Efecto para manejar el temporizador
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTime((prevTime) => Math.max(prevTime - 1, 0)); // Reducir tiempo cada segundo
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // Limpiar intervalo al desmontar
  }, [isPlaying]);

  // Formatear el tiempo como MM:SS
    const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const theme = React.useContext(themeContext);

  return (
    <View style={styles.container}>
      {/* Fondo circular con detalles */}
      <Svg height="350" width="350" style={styles.circle}>
        <Circle
          cx="175"
          cy="175"
          r="170" // Radio del círculo interno
          stroke={colors.tertiary}
          strokeWidth="10"
          fill={'black'}
        />
        {/* Marcas del reloj */}
        {Array.from({ length: 12 }).map((_, index) => {
          const angle = (index * 30) * (Math.PI / 180); // Ángulo para cada marca
          const x1 = 175 + Math.cos(angle) * 140;
          const y1 = 175 - Math.sin(angle) * 140;
          const x2 = 175 + Math.cos(angle) * 160;
          const y2 = 175 - Math.sin(angle) * 160;

          return (
            <Line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
      </Svg>

      {/* Texto del temporizador */}
      <Text style={[styles.timerText ,{color: theme.primary}]}>{formatTime(time)}</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 350,
    width: 350,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    position: "absolute",
  },
  timerText: {
    
    fontWeight: 'bold',
    fontSize: 50,
    textAlign: "center",
    position: "absolute",
  },
});
