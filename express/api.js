import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import webpush from 'web-push'

const app = express()
app.use(cors())
app.use(bodyParser.json())

webpush.setVapidDetails('mailto:tuemail@dominio.com', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY)

const subscriptions = []

app.get('/', (req, res) => {
  res.json({ message: 'Notificaciones push.' })
})

app.post('/subscribe', (req, res) => {
  console.log('iniciando suscripcion')
  subscriptions.push(req.body)
  res.status(201).json({})
})

app.post('/notify', async (req, res) => {
  console.log('enviando notificacion')
  const payload = JSON.stringify(req.body)
  await Promise.allSettled(subscriptions.map((sub) => webpush.sendNotification(sub, payload)))
  res.json({ sent: subscriptions.length })
})

app.listen(3000, () => console.log('🚀 Backend en http://localhost:3000'))
