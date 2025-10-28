import './assets/main.css';
import { register } from './utils/push';
//import { registerSW } from 'virtual:pwa-register'

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');

register();

if (window.electronAPI) {
  window.electronAPI.onNotificationClick((route) => {
    console.log('Notificación con ruta:', route);
    router.push(route.replace('/app/', '/'));
  });
}

function isCordova() {
  try {
    return !!cordova;
  } catch (e) {
    return false;
  }
}

setTimeout(() => {
  if (isCordova()) {
    cordova.plugins.notification.local.on('click', (notification) => {
      const route = notification.data.route.replace('/app/', '/');
      if (route) {
        router.push(route);
      }
    });
  }
}, 3000);
