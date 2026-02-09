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
import { LocalizationProvider } from '../context/LocalizationContext';

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

  // Inicializar AdMob en el arranque (solo en nativo). Usamos require dinámico para evitar errores en Expo Go.
  useEffect(() => {
    if (isWeb) return;

    let mounted = true;

    const initAds = async () => {
      try {
        // (iOS) pedir permiso ATT antes de inicializar
        if (Platform.OS === 'ios') {
          try {
            const { requestTrackingPermissionsAsync } = await import('expo-tracking-transparency');
            await requestTrackingPermissionsAsync();
          } catch (err) {
            // No bloquear si no está disponible
            console.warn('expo-tracking-transparency no disponible o permiso falló:', err?.message || err);
          }
        }

        // Cargar el módulo nativo de AdMob de forma dinámica
        let mobileAds;
        try {
          // Algunos entornos exponen la exportación por defecto, otros no
          mobileAds = require('react-native-google-mobile-ads').default || require('react-native-google-mobile-ads');
        } catch (e) {
          console.warn('react-native-google-mobile-ads no está disponible en este entorno:', e?.message || e);
          return;
        }

        // Inicializar
        await mobileAds().initialize();
        if (mounted) console.log('AdMob inicializado');
      } catch (e) {
        console.warn('Inicialización de AdMob falló:', e?.message || e);
      }
    };

    void initAds();

    return () => {
      mounted = false;
    };
  }, []);

  // Esperar fuentes en nativo; en web ya retornamos true arriba
  if (!isWeb && !fontsLoaded && !fontError) {
    return null;
  }

  return (
    <LocalizationProvider>
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
    </LocalizationProvider>
  );
}