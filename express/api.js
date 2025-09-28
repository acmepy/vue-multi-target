import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import webpush from 'web-push'

//import path from 'path'
//import { fileURLToPath } from 'url'
//const __filename = fileURLToPath(import.meta.url)
//const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(bodyParser.json())

webpush.setVapidDetails('mailto:tuemail@dominio.com', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY)

const subscriptions = []

app.get('/', (req, res) => {
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
  const exists = subscriptions.find((s) => s.endpoint === sub.endpoint)
  if (!exists) {
    subscriptions.push(req.body)
  }
  console.log('iniciando suscripcion', subscriptions.length)
  res.status(201).json({})
})

app.post('/notify', async (req, res) => {
  console.log('enviando notificacion')
  const payload = JSON.stringify(req.body)
  await Promise.allSettled(
    subscriptions.map((sub) => {
      webpush.sendNotification(sub, payload)
    }),
  )
  res.json({ sent: subscriptions.length })
})

app.listen(3000, () => console.log('🚀 Backend en http://localhost:3000'))
