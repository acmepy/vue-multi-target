import express from 'express';
import webpush from 'web-push';
import { WebSocketServer } from 'ws';

const router = express.Router();
webpush.setVapidDetails(`mailto:${process.env.VAPID_MAIL}`, process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
const wss = new WebSocketServer({ noServer: true });

const pwaSubscriptions = [];
const sseSubscriptions = new Map();
const wsSubscriptions = [];

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
  } /* else if (sub.clientId) {
    const exists = wsSubscriptions.find((c) => c.clientId === sub.clientId);
    if (!exists) wsSubscriptions.push(sub);
    console.log('Electron cliente registrado:', wsSubscriptions.length);
    console.log(wsSubscriptions);
    res.json({ ok: true });
  }*/
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
  /*for (const c of wsSubscriptions) {
    wss.clients.forEach((ws) => {
      if (ws.clientId === c.clientId && ws.readyState === ws.OPEN) {
        ws.send(payload);
      }
    });
  }*/
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

/*
export const upgrade = (server) => {
  server.on('upgrade', (request, socket, head) => {
    console.log('upgrade');
    const url = new URL(request.url, 'http://localhost:3000'); // base dummy
    const clientId = url.searchParams.get('clientId');
    console.log('upgrade:', url.pathname, 'clientId:', clientId);

    if (url.pathname === '/notificaciones/upgrade') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        ws.clientId = clientId;
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', (ws) => {
    console.log('Cliente conectado WS:', ws.clientId);

    ws.on('close', () => {
      wsSubscriptions.forEach((c, x) => {
        if (c.clientId == ws.clientId) {
          console.log('Cliente desconectado:', c.clientId);
          wsSubscriptions.splice(x, 1);
        }
      });
    });
  });
};
*/
export default router;
