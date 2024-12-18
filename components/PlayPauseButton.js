import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PlayPauseButton({ isPlaying, onPress }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Ionicons
        name={isPlaying ? 'pause' : 'play'}
        size={32}
        color="white"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 50,
  },
});
