import '../global.css';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { AudioProvider } from '../context/AudioContext';
import { AudioPlayerProvider } from '../context/AudioPlayerContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { TaskProvider } from '../context/TaskContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';

// Prevenir que el splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync().catch(() => {
  /* En web puede fallar, ignoramos el error */
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Ionicons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
    'MaterialCommunityIcons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {
        /* En web puede fallar, ignoramos el error */
      });
    }
  }, [fontsLoaded, fontError]);

  // No renderizar nada hasta que las fuentes estén cargadas (excepto en web donde se cargan dinámicamente)
  if (!fontsLoaded && !fontError && Platform.OS !== 'web') {
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