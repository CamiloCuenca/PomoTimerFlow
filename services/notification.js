import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

// Configuración del manejador de notificaciones (solo para móvil)
if (!isWeb) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

// Configurar el canal de notificaciones (necesario para Android)
async function setupNotifications() {
  if (isWeb) return;

  try {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  } catch (e) {
    console.log('Error setting up notifications:', e);
  }
}

// Solicitar permisos
export async function registerForPushNotificationsAsync() {
  if (isWeb) {
    // Para web, solicitar permiso de notificaciones
    if ('Notification' in window) {
      try {
        if (Notification.permission === 'granted') {
          return true;
        }
        if (Notification.permission !== 'denied') {
          const permission = await Notification.requestPermission();
          return permission === 'granted';
        }
      } catch (e) {
        console.log('Error requesting web notification permission:', e);
      }
    }
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Permiso denegado para notificaciones');
      return false;
    }
    
    await setupNotifications();
    return true;
  } catch (e) {
    console.log('Error requesting mobile notification permission:', e);
    return false;
  }
}

// Mostrar notificación local (funciona en web y móvil)
export async function mostrarNotificacionLocal({ title, body, seconds = 1 }) {
  if (isWeb) {
    // Web Notifications API
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: require('../assets/icon-mini.png'),
        });
      } catch (e) {
        console.log('Error showing web notification:', e);
      }
    }
  } else {
    // Expo Notifications (móvil)
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          seconds: Number.isFinite(seconds) ? seconds : 1,
          channelId: 'default',
        },
      });
    } catch (e) {
      console.log('Error scheduling mobile notification:', e);
    }
  }
}