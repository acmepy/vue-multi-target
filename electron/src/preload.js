// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyCBnwP5VqMRguB0mOpTvGXX0k-Ih6fNtVk',
  authDomain: 'vue-notification-push.firebaseapp.com',
  projectId: 'vue-notification-push',
  storageBucket: 'vue-notification-push.firebasestorage.app',
  messagingSenderId: '778855553759',
  appId: '1:778855553759:web:46172506a7828ca2d7276a',
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Solicitar permisos de notificación
Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    getToken(messaging, { vapidKey: 'TU_VAPID_KEY' }).then((token) => {
      console.log('Token Electron:', token);
    });
  }
});

onMessage(messaging, (payload) => {
  console.log('Notificación en foreground:', payload);
  new Notification(payload.notification.title, { body: payload.notification.body });
});
