import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors.json';


export default function PlayPauseButton({ isPlaying, onPress }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Ionicons
        name={isPlaying ? 'pause' : 'play'}
        size={32}
        color={colors.secondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 50,
  },
});
