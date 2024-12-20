import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../constants/colors.json';

// Components
import PlayPauseButton from '../components/PlayPauseButton';
import IconButton from '../components/IconButton';
import Timer from '../components/Timer';

export default function MainTimerScreen() {
  const [isPlaying, setIsPlaying] = useState(false); // Estado para iniciar/pausar el temporizador
  const [time, setTime] = useState(25 * 60); // Tiempo inicial del temporizador (25 minutos en segundos)
  const [isWorkSession, setIsWorkSession] = useState(true); // Indica si es una sesión de trabajo
  const [completedCycles, setCompletedCycles] = useState([]); // Array para registrar ciclos completados

  useEffect(() => {
    if (time === 0) {
      if (isWorkSession) {
        // Cambiar a sesión de descanso
        setCompletedCycles((prevCycles) => [
          ...prevCycles,
          { type: "work", duration: 25 * 60 },
        ]); // Registrar la sesión de trabajo completada
        setTime(5 * 60); // Cambiar el tiempo al de descanso
        setIsWorkSession(false); // Cambiar a sesión de descanso
      } else {
        // Cambiar a sesión de trabajo
        setCompletedCycles((prevCycles) => [
          ...prevCycles,
          { type: "break", duration: 5 * 60 },
        ]); // Registrar la sesión de descanso completada
        setTime(25 * 60); // Cambiar el tiempo al de trabajo
        setIsWorkSession(true); // Cambiar a sesión de trabajo
      }
      setIsPlaying(false); // Pausar automáticamente entre cambios de sesión
    }
  }, [time, isWorkSession]);

  // Función para reiniciar el temporizador
  const resetTimer = () => {
    setIsPlaying(false); // Detener el temporizador
    setTime(25 * 60); // Reiniciar el tiempo a 25 minutos
    setIsWorkSession(true); // Reiniciar a sesión de trabajo
  };

  return (
    <View style={styles.container}>
      <View style={styles.timer}>
        {/* Pasar el estado y las funciones al Timer */}
        <Timer time={time} setTime={setTime} isPlaying={isPlaying} />
      </View>

      {/* Botones de control */}
      <View style={styles.controlsbuttons}>
        <PlayPauseButton
          isPlaying={isPlaying}
          onPress={() => setIsPlaying(!isPlaying)} // Alternar estado
        />
        <IconButton iconName={"refresh"} onPress={resetTimer} /> {/* Reiniciar */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },
  timer: {
    
    padding: '8%'

  },
  controlsbuttons: {
    
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: '10%'
  },
});
