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

/*registerSW({
  immediate: true, // se registra y actualiza al cargar
  onNeedRefresh() {}, // no hacemos nada, nada de notificaciones extra
  onOfflineReady() {}, // opcional
})*/
if (window.electronAPI) {
  window.electronAPI.onNotificationClick((route) => {
    console.log('Notificación con ruta:', route);
    router.push(route.replace('/app/', '/')); // usa tu router de Vue
  });
}

setTimeout(() => {
  console.log('cordova.plugins');
  cordova.plugins.notification.local.on('click', (notification) => {
    //console.log('-->', notification.data.route);
    const route = notification.data.route.replace('/app/', '/');
    console.log('-->', route);
    if (route) {
      //window.location.hash = route; // abre esa ruta
      router.push(route);
    }
  });
}, 3000);
