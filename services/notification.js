import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

// Map para trackear timeouts de notificaciones web programadas
const webScheduled = new Map();

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


// Programar una notificación para X segundos en el futuro.
// Devuelve un id que puede usarse para cancelar.
export async function scheduleNotification({ title, body, seconds = 1, timerType = 'work' }) {
  // Mensajes por defecto (inglés)
  const defaultTitle = 'Session completed!';
  const defaultBodyWork = 'You finished a work session.';
  const defaultBodyBreak = 'You finished a break session.';

  const finalTitle = title || defaultTitle;
  const finalBody = body || (timerType === 'work' ? defaultBodyWork : defaultBodyBreak);

  if (isWeb) {
    try {
      if (!('Notification' in window)) return null;
      if (Notification.permission !== 'granted') {
        const granted = await registerForPushNotificationsAsync();
        if (!granted) return null;
      }

      const id = `web_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
      const timeoutId = setTimeout(() => {
        try {
          new Notification(finalTitle, { body: finalBody, icon: require('../assets/icon-mini.png') });
        } catch (e) {
          console.log('Error showing scheduled web notification:', e);
        }
        webScheduled.delete(id);
      }, Math.max(0, Math.round(Number(seconds)) * 1000));

      webScheduled.set(id, timeoutId);
      return id;
    } catch (e) {
      console.log('Error scheduling web notification:', e);
      return null;
    }
  } else {
    try {
      const secondsInt = Math.max(1, Math.round(Number(seconds)));

      await registerForPushNotificationsAsync();

      return await Notifications.scheduleNotificationAsync({
        content: {
          title: finalTitle,
          body: finalBody,
          sound: 'default',
        },
        trigger: { seconds: secondsInt, channelId: 'default' },
      });
    } catch (e) {
      console.log('Error scheduling mobile notification:', e);
      return null;
    }
  }
}

export async function cancelScheduledNotification(id) {
  if (!id) return;

  if (isWeb) {
    try {
      const timeoutId = webScheduled.get(id);
      if (timeoutId) {
        clearTimeout(timeoutId);
        webScheduled.delete(id);
      }
    } catch (e) {
      console.log('Error cancelling web scheduled notification:', e);
    }
  } else {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch (e) {
      console.log('Error cancelling mobile scheduled notification:', e);
    }
  }
}

// Se exportan funciones nombradas; no export default necesario
export async function mostrarNotificacionLocal({ title, body, seconds = 1 }) {
  if (isWeb) {
    try {
      if (!('Notification' in window)) return null;
      if (Notification.permission !== 'granted') {
        const granted = await registerForPushNotificationsAsync();
        if (!granted) return null;
      }

      const id = `web_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
      const timeoutId = setTimeout(() => {
        try {
          new Notification(title, { body, icon: require('../assets/icon-mini.png') });
        } catch (e) {
          console.log('Error showing scheduled web notification:', e);
        }
        webScheduled.delete(id);
      }, Math.max(0, Math.round(Number(seconds)) * 1000));

      webScheduled.set(id, timeoutId);
      return id;
    } catch (e) {
      console.log('Error scheduling web local notification:', e);
      return null;
    }
  } else {
    try {
      const secondsInt = Math.max(1, Math.round(Number(seconds)));
      await registerForPushNotificationsAsync();
      return await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: { seconds: Number.isFinite(secondsInt) ? secondsInt : 1, channelId: 'default' },
      });
    } catch (e) {
      console.log('Error scheduling mobile local notification:', e);
      return null;
    }
  }
}
