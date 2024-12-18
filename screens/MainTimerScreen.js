import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../constants/colors.json';


// Components
import PlayPauseButton from '../components/PlayPauseButton'; 
import IconButton from '../components/IconButton';


export default function MainTimerScreen() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <View style={styles.container}>
      
      <PlayPauseButton
        isPlaying={isPlaying}
        onPress={() => setIsPlaying(!isPlaying)} // Alternar estado
      />
      <IconButton iconName={"refresh"}></IconButton>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary ,
  },
 
});
