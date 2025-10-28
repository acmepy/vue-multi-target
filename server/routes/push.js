import express from 'express';
import webpush from 'web-push';

const router = express.Router();
webpush.setVapidDetails(`mailto:${process.env.VAPID_MAIL}`, process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);

const pwaSubscriptions = [];
const sseSubscriptions = new Map();

router.post('/subscribe', (req, res) => {
  const sub = req.body;
  if (sub.subscription?.endpoint) {
    const exists = pwaSubscriptions.find((s) => s.subscription.endpoint === sub.subscription.endpoint);
    console.log(pwaSubscriptions);
    if (!exists) {
      pwaSubscriptions.push(req.body);
    }
    console.log('iniciando suscripcion', pwaSubscriptions.length, pwaSubscriptions);
    res.status(201).json({});
  }
});

router.post('/notify', async (req, res) => {
  console.log('enviando notificacion', req.body);
  const { title = 'Notificación', body = '', url = '/' } = req.body;
  const payload = JSON.stringify({ title, body, url });

  // PWA
  for (const key in pwaSubscriptions) {
    const sub = pwaSubscriptions[key];
    try {
      console.log(sub.userId, payload);
      await webpush.sendNotification(sub.subscription, payload);
    } catch (err) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        console.log('Subscripción inválida, eliminando...');
        pwaSubscriptions.splice(key, 1);
      }
    }
  }
  // Electron & Cordova
  for (const [clientId, sse] of sseSubscriptions) {
    sse.res.write(`data: ${payload}\n\n`);
  }
  res.json({ pwa: pwaSubscriptions.length, sse: sseSubscriptions.size });
});

router.get('/sse/:platfom/:clientId', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const { clientId, platform } = req.params;
  sseSubscriptions.set(clientId, { clientId, platform, res });
  res.write(`data: ${JSON.stringify({ ok: true, msg: 'Conectado a SSE' })}\n\n`);
  console.log(`Cliente ${clientId} conectado. Total Conectados:${sseSubscriptions.size}`);
});

export default router;

setInterval(() => {
  for (const [clientId, sse] of sseSubscriptions) {
    sse.res.write(`data: ${JSON.stringify({ ok: true, msg: 'Conectado a SSE' })}\n\n`);
  }
}, 120000);
