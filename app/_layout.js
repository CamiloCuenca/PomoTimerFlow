import '../global.css';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { AudioProvider } from '../context/AudioContext';
import { AudioPlayerProvider } from '../context/AudioPlayerContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { TaskProvider } from '../context/TaskContext';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Prevenir que el splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync().catch(() => {
  /* En web puede fallar, ignoramos el error */
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {
        /* En web puede fallar, ignoramos el error */
      });
    }
  }, [fontsLoaded, fontError]);

  // No renderizar nada hasta que las fuentes estén cargadas
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <AudioProvider>
        <AudioPlayerProvider>
          <PaperProvider>
            <TaskProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </TaskProvider>
          </PaperProvider>
        </AudioPlayerProvider>
      </AudioProvider>
    </ThemeProvider>
  );
}