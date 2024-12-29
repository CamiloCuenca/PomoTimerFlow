import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { themeContext } from '../themesContext';

// Components
import PlayPauseButton from '../components/PlayPauseButton';
import IconButton from '../components/IconButton';
import Timer from '../components/Timer';

export default function MainTimerScreen({
  workTime,
  setWorkTime,
  restTime,
  setRestTime,
}) {
  const [isPlaying, setIsPlaying] = useState(false); // Estado para iniciar/pausar el temporizador

  const resetTimer = () => {
    setIsPlaying(false); // Detener el temporizador
    setWorkTime(25 * 60); // Reiniciar el tiempo de trabajo a 25 minutos
  };

  const [isWorkSession, setIsWorkSession] = useState(true); // Indica si es una sesión de trabajo
  const [completedCycles, setCompletedCycles] = useState([]); // Array para registrar ciclos completados
  const { theme } = React.useContext(themeContext);

  useEffect(() => {
    if (workTime === 0) {
      if (isWorkSession) {
        // Cambiar a sesión de descanso
        setCompletedCycles((prevCycles) => [
          ...prevCycles,
          { type: "work", duration: 25 * 60 },
        ]); // Registrar la sesión de trabajo completada
        setWorkTime(5 * 60); // Cambiar el tiempo al de descanso
        setIsWorkSession(false); // Cambiar a sesión de descanso
      } else {
        // Cambiar a sesión de trabajo
        setCompletedCycles((prevCycles) => [
          ...prevCycles,
          { type: "break", duration: 5 * 60 },
        ]); // Registrar la sesión de descanso completada
        setWorkTime(25 * 60); // Cambiar el tiempo al de trabajo
        setIsWorkSession(true); // Cambiar a sesión de trabajo
      }
      setIsPlaying(false); // Pausar automáticamente entre cambios de sesión
    }
  }, [workTime, isWorkSession]);

  return (
    <View style={[styles.container, {backgroundColor: theme.secondary}]}>
      <View style={styles.timer}>
        <Timer time={workTime} setTime={setWorkTime} isPlaying={isPlaying} />
      </View>

      <View style={styles.controlButtons}>
        <PlayPauseButton
          isPlaying={isPlaying}
          onPress={() => setIsPlaying(!isPlaying)}
        />
        <IconButton iconName="refresh" onPress={resetTimer} />
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    
  },
  timer: {
    
    padding: '8%'

  },
  controlButtons: {
    
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: '10%'
  },
});
