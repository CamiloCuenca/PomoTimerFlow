import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themeContext } from '../themesContext';


export default function PlayPauseButton({ isPlaying, onPress }) {
  const { theme } = React.useContext(themeContext);
  
  return (
    <Pressable style={[styles.button,{backgroundColor: theme.primary}]} onPress={onPress}>
      <Ionicons
        name={isPlaying ? 'pause' : 'play'}
        size={32}
        color={theme.foreground}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {

    padding: 20,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'white',
  },
});
