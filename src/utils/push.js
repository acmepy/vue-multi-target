import { registerSW } from 'virtual:pwa-register'

const publicVapidKey = 'BNrQPesK8rigfx_RG-vAMF5ftcgjBc0K_W2mA9EfowEDrQ2x0Ycfwb5xl3S72RrOOBDeU1tV8csnE5juNxH-j1w'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

export async function subscribe() {
  const reg = await navigator.serviceWorker.ready

  let subscription = await reg.pushManager.getSubscription()

  if (!subscription) {
    console.log('ℹ️ No había suscripción, creando una nueva...')
    subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    })
  } else {
    console.log('✅ Ya existe una suscripción, se reutiliza.')
  }

  await fetch('http://localhost:3000/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'pwa', subscription }),
  })

  console.log('✅ Suscripción enviada al servidor')
}

export function register() {
  subscribe()
  registerSW({
    immediate: true, // se registra y actualiza al cargar
    onNeedRefresh() {}, // no hacemos nada, nada de notificaciones extra
    onOfflineReady() {}, // opcional
  })
}
