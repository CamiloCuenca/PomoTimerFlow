import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../constants/colors.json';

// Components
import PlayPauseButton from '../components/PlayPauseButton'; 
import IconButton from '../components/IconButton';
import Timer from '../components/Timer';

export default function MainTimerScreen() {
  const [isPlaying, setIsPlaying] = useState(false); // Estado para iniciar/pausar el temporizador
  const [time, setTime] = useState(1 * 60); // Tiempo inicial del temporizador (25 minutos en segundos)

  // Función para reiniciar el temporizador
  const resetTimer = () => {
    setIsPlaying(false); // Detener el temporizador
    setTime(1 * 60); // Reiniciar el tiempo a 25 minutos
  };

  return (
    <View style={styles.container}>
      <View style={{ padding: 85 }}>
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
  controlsbuttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 1,
    columnGap: 50,
  },
});
