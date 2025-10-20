import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCBnwP5VqMRguB0mOpTvGXX0k-Ih6fNtVk',
  authDomain: 'vue-notification-push.firebaseapp.com',
  projectId: 'vue-notification-push',
  storageBucket: 'vue-notification-push.firebasestorage.app',
  messagingSenderId: '778855553759',
  appId: '1:778855553759:web:46172506a7828ca2d7276a',
};

const firebase = initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Recibido en background', payload);
  new Notification(payload.notification.title, {
    body: payload.notification.body,
  });
});
