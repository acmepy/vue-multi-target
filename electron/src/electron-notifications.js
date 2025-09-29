import { Notification } from 'electron/main'
import { v4 as uuidv4 } from 'uuid'
import WebSocket from 'ws'

const SERVER_URL = 'http://localhost:3000' // tu servidor Express
let clientId = null
let ws = null

export async function subscribeElectron() {
  //clientId = localStorage.getItem('electronClientId')
  if (!clientId) {
    clientId = uuidv4()
    //localStorage.setItem('electronClientId', clientId)
  }

  await fetch(`${SERVER_URL}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId }),
  })
  console.log('Electron suscripcion enviada al servidor')
}

export function connectNotifications() {
  if (!clientId) {
    console.error('Debe suscribirse primero con subscribeElectron()')
    return
  }

  ws = new WebSocket(`ws://localhost:3000/upgrade?clientId=${clientId}`)

  ws.on('open', () => {
    console.log('Conectado al servidor WS')
  })

  ws.on('message', (msg) => {
    const { title, body } = JSON.parse(msg.toString())
    console.log('Notificacion recibida:', { title, body })

    new Notification({ title, body }).show()
  })

  ws.on('close', () => {
    console.log('WS cerrado, intentando reconectar...')
    setTimeout(() => connectNotifications(clientId), 3000)
  })

  ws.on('error', (err) => {
    console.error('Error en WS:', err.message)
  })
}

export function disconnectNotifications() {
  if (ws) ws.close()
}

export async function suscribe() {
  await subscribeElectron()
  connectNotifications()
}
