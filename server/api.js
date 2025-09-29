import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import webpush from 'web-push'
import { WebSocketServer } from 'ws'
import http from 'http'
//import path from 'path'
//import { fileURLToPath } from 'url'
//const __filename = fileURLToPath(import.meta.url)
//const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(bodyParser.json())

const server = http.createServer(app)
const wss = new WebSocketServer({ noServer: true })

webpush.setVapidDetails('mailto:tuemail@dominio.com', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY)

const subscriptions = []
const electronClients = []

app.get('/', (req, res) => {
  console.log('por aqui')
  res.json({ message: 'Notificaciones push.' })
})
app.get('/favicon.ico', (req, res) => {
  res.sendFile('c:/tmp/vue/vue-multi-target/dist/favicon.ico')
})

/*app.get('/pwa-192x192.png', (req, res) => {
  res.sendFile('c:/tmp/vue/vue-multi-target/dist/pwa-192x192.png')
})*/
app.use('/app', express.static('../dist'))
app.get('/app/', (req, res) => {
  res.sendFile('../dist/index.html')
})

app.post('/subscribe', (req, res) => {
  const sub = req.body
  if (sub.endpoint) {
    const exists = subscriptions.find((s) => s.endpoint === sub.endpoint)
    if (!exists) {
      subscriptions.push(req.body)
    }
    console.log('iniciando suscripcion', subscriptions.length, subscriptions)
    res.status(201).json({})
  } else if (sub.clientId) {
    // es Electron
    const exists = electronClients.find((c) => c.clientId === sub.clientId)
    if (!exists) electronClients.push(sub)
    console.log('Electron cliente registrado:', electronClients.length)
    res.json({ ok: true })
  }
})

app.post('/notify', async (req, res) => {
  console.log('enviando notificacion', req.body)
  const { title = 'Notificación', body = '' } = req.body
  const payload = JSON.stringify({ title, body })

  // PWA
  await Promise.allSettled(subscriptions.map((sub) => webpush.sendNotification(sub, payload)))

  // Electron
  electronClients.forEach((c) => {
    wss.clients.forEach((ws) => {
      if (ws.clientId === c.clientId && ws.readyState === ws.OPEN) {
        ws.send(payload)
      }
    })
  })

  res.json({ sent: subscriptions.length + electronClients.length })
})
server.on('upgrade', (request, socket, head) => {
  console.log('upgrade')
  const url = new URL(request.url, 'http://localhost:3000') // base dummy
  const clientId = url.searchParams.get('clientId')
  console.log('upgrade:', url.pathname, 'clientId:', clientId)

  if (url.pathname === '/upgrade') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.clientId = clientId
      wss.emit('connection', ws, request)
    })
  } else {
    socket.destroy()
  }
})

wss.on('connection', (ws) => {
  console.log('Cliente conectado WS:', ws.clientId)

  /*ws.on('close', () => {
    console.log('Cliente desconectado:', ws.clientId)
  })*/
})

server.listen(3000, () => console.log('Backend en http://localhost:3000'))
