import { precacheAndRoute } from 'workbox-precaching'
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('push', (event) => {
  const data = event.data.json()
  const { title = 'prueba dft', body = 'body dft', icon = '/app/pwa-192x192.png' } = data
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
    }),
  )
})
