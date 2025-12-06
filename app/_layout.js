import '../global.css';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { AudioProvider } from '../context/AudioContext';
import { AudioPlayerProvider } from '../context/AudioPlayerContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AudioProvider>
        <AudioPlayerProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AudioPlayerProvider>
      </AudioProvider>
    </ThemeProvider>
  );
}