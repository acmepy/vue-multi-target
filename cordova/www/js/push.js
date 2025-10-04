/* global cordova */
export default async function () {
  const clientId = Date.now().toString() // identificador simple
  window.clientId = clientId

  // registrar cliente Cordova en el servidor
  try {
    await fetch('https://tuservidor/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, platform: 'cordova' }),
    })
    console.log('Cordova registrado')
  } catch (e) {
    console.error('Error registrando Cordova', e)
  }

  connectWebSocket(clientId)
}

function connectWebSocket(clientId) {
  const ws = new WebSocket(`wss://tuservidor/upgrade?clientId=${clientId}`)

  ws.onopen = () => console.log('WS conectado')
  ws.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data)
      showNotification(data.title, data.body)
    } catch (err) {
      console.error('Error parseando mensaje:', err)
    }
  }

  ws.onclose = () => {
    console.warn('WS cerrado, reintentando...')
    setTimeout(() => connectWebSocket(clientId), 3000)
  }
}

function showNotification(title, body) {
  cordova.plugins.notification.local.schedule({
    title,
    text: body,
    foreground: true,
    smallIcon: 'res://icon', // opcional
    sound: true,
  })
}
