import './assets/main.css'
import { subscribeToPush } from './utils/push'
import { registerSW } from 'virtual:pwa-register'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

subscribeToPush()
registerSW({
  immediate: true, // se registra y actualiza al cargar
  onNeedRefresh() {}, // no hacemos nada, nada de notificaciones extra
  onOfflineReady() {}, // opcional
})
