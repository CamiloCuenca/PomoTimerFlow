import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

// Map para almacenar timeouts en web (solo como fallback cuando sea posible)
const webTimeouts = new Map();

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

// Mostrar notificación inmediata (funciona en web y móvil)
export async function mostrarNotificacionLocal({ title, body }) {
  if (isWeb) {
    // Web Notifications API (mostramos inmediatamente si hay permiso)
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
    // Expo Notifications (móvil) - mostramos inmediatamente
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null,
      });
    } catch (e) {
      console.log('Error showing mobile notification:', e);
    }
  }
}

// Programar una notificación para que se dispare en `seconds` segundos.
// Devuelve un id que puede usarse para cancelar la notificación.
export async function scheduleNotification({ title, body, seconds = 1 }) {
  // Asegurar segundos como entero >= 0
  const secs = Math.max(0, Math.round(Number(seconds) || 0));

  if (isWeb) {
    // Fallback web: solo posible si la página está activa y con permiso.
    // Guardamos el timeout para permitir cancelación mientras la pestaña esté abierta.
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const timeoutId = setTimeout(() => {
          try {
            new Notification(title, {
              body,
              icon: require('../assets/icon-mini.png'),
            });
          } catch (e) {
            console.log('Error showing scheduled web notification:', e);
          }
        }, secs * 1000);

        const id = `web-${String(timeoutId)}`;
        webTimeouts.set(id, timeoutId);
        return id;
      } catch (e) {
        console.log('Error scheduling web notification:', e);
        return null;
      }
    }
    return null;
  }

  try {
    await setupNotifications();
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        seconds: Math.max(1, secs),
      },
    });

    return id;
  } catch (e) {
    console.log('Error scheduling mobile notification:', e);
    return null;
  }
}

// Cancelar una notificación programada por id
export async function cancelScheduledNotification(id) {
  if (!id) return;

  if (isWeb) {
    // fallback web
    try {
      if (typeof id === 'string' && id.startsWith('web-')) {
        const timeoutId = webTimeouts.get(id);
        if (timeoutId) {
          clearTimeout(timeoutId);
          webTimeouts.delete(id);
        }
      }
    } catch (e) {
      console.log('Error cancelling web scheduled notification:', e);
    }
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (e) {
    console.log('Error cancelling scheduled mobile notification:', e);
  }
}

// Cancelar todas las notificaciones programadas (móvil)
export async function cancelAllScheduledNotifications() {
  if (isWeb) {
    try {
      for (const [id, timeoutId] of webTimeouts) {
        clearTimeout(timeoutId);
      }
      webTimeouts.clear();
    } catch (e) {
      console.log('Error cancelling all web scheduled notifications:', e);
    }
    return;
  }

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.log('Error cancelling all scheduled mobile notifications:', e);
  }
}