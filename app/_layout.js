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

const isWeb = Platform.OS === 'web';

// Solo controlar splash en nativo
if (!isWeb) {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

export default function RootLayout() {
  // En web no cargamos fuentes nativas para evitar 404; en nativo sí.
  const [fontsLoaded, fontError] = isWeb
    ? [true, null]
    : useFonts({
        Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
        MaterialCommunityIcons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
      });

  useEffect(() => {
    if (!isWeb && (fontsLoaded || fontError)) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  // Esperar fuentes en nativo; en web ya retornamos true arriba
  if (!isWeb && !fontsLoaded && !fontError) {
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