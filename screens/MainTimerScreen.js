import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PlayPauseButton from '../components/PlayPauseButton'; 

export default function MainTimerScreen() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <View style={styles.container}>
      
      <PlayPauseButton
        isPlaying={isPlaying}
        onPress={() => setIsPlaying(!isPlaying)} // Alternar estado
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
 
});
