/* global FCM */
document.addEventListener('deviceready', async () => {
  console.log('Device ready, inicializando FCM');

  // Obtener token FCM
  FCM.getToken().then((token) => {
    console.log('Token FCM:', token);
    // Aquí podrías enviar este token a tu servidor
  });

  // Refrescar token si cambia
  FCM.onTokenRefresh((token) => {
    console.log('Token refrescado:', token);
    // Actualiza en tu backend
  });

  // Recibir notificaciones en primer plano
  FCM.onNotification((data) => {
    console.log('Notificación recibida:', data);
    if (data.wasTapped) {
      console.log('Notificación abierta desde bandeja');
    } else {
      console.log('Notificación en primer plano');
    }
  });
});
