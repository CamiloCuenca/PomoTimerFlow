import * as Notifications from 'expo-notifications';

// Configuración del manejador de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,  // Muestra la notificación como banner
    shouldShowList: true,    // Muestra la notificación en el centro de notificaciones
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Configurar el canal de notificaciones (necesario para Android)
async function setupNotifications() {
  await Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}

// Solicitar permisos
export async function registerForPushNotificationsAsync() {
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
}

export async function mostrarNotificacionLocal({ title, body, seconds = 1 }) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: { seconds }, // Notificación programada para 'seconds' segundos en el futuro
  });
}