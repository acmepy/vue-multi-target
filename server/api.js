import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import data from './routes/data.js';

import webpush from 'web-push';
import { WebSocketServer } from 'ws';
import http from 'http';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, '../dist');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

webpush.setVapidDetails(`mailto:${process.env.VAPID_MAIL}`, process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);

const pwaSubscriptions = [];
const wsSubscriptions = [];

app.get('/', (req, res) => {
  res.json({ message: 'Notificaciones push.' });
});
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '/dist/favicon.ico'));
});
app.get('/pwa-192x192.png', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '/dist/pwa-192x192.png'));
});

app.get('/', (req, res) => res.redirect('/app/'));
app.use('/app', express.static(distPath));
app.get(/^\/app(\/.*)?$/, (req, res, next) => {
  if (req.path.match(/\.[^\/]+$/)) {
    next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.use('/electron', express.static('../electron/out/make/squirrel.windows/x64'));
app.use('/android', express.static('../cordova/platforms/android/app/build/outputs/apk/debug'));

app.use('/api', data);

app.post('/subscribe', (req, res) => {
  const sub = req.body;
  if (sub.subscription?.endpoint) {
    const exists = pwaSubscriptions.find((s) => s.subscription.endpoint === sub.subscription.endpoint);
    console.log(pwaSubscriptions);
    if (!exists) {
      pwaSubscriptions.push(req.body);
    }
    console.log('iniciando suscripcion', pwaSubscriptions.length, pwaSubscriptions);
    res.status(201).json({});
  } else if (sub.clientId) {
    const exists = wsSubscriptions.find((c) => c.clientId === sub.clientId);
    if (!exists) wsSubscriptions.push(sub);
    console.log('Electron cliente registrado:', wsSubscriptions.length);
    console.log(wsSubscriptions);
    res.json({ ok: true });
  }
});

app.post('/notify', async (req, res) => {
  console.log('enviando notificacion', req.body);
  const { title = 'Notificación', body = '', url = '/' } = req.body;
  const payload = JSON.stringify({ title, body, url });

  // PWA
  for (const key in pwaSubscriptions) {
    const sub = pwaSubscriptions[key];
    try {
      await webpush.sendNotification(sub.subscription, payload);
    } catch (err) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        console.log('Subscripción inválida, eliminando...');
        pwaSubscriptions.splice(key, 1);
      }
    }
  }
  // Electron & Cordova
  for (const c of wsSubscriptions) {
    wss.clients.forEach((ws) => {
      if (ws.clientId === c.clientId && ws.readyState === ws.OPEN) {
        ws.send(payload);
      }
    });
  }
  // PWA
  //await Promise.allSettled(subscriptions.map((sub) => webpush.sendNotification(sub.subscription, payload)));
  // Electron & Cordova
  /*electronClients.forEach((c) => {
    wss.clients.forEach((/** @type {any} */ /* ws) => {
      if (ws.clientId === c.clientId && ws.readyState === ws.OPEN) {
        ws.send(payload);
      }
    });
  });*/

  res.json({ sent: pwaSubscriptions.length + wsSubscriptions.length });
});
server.on('upgrade', (request, socket, head) => {
  console.log('upgrade');
  const url = new URL(request.url, 'http://localhost:3000'); // base dummy
  const clientId = url.searchParams.get('clientId');
  console.log('upgrade:', url.pathname, 'clientId:', clientId);

  if (url.pathname === '/upgrade') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.clientId = clientId;
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', (/** @type {any} */ ws) => {
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

server.listen(3000, () => console.log('Backend en http://localhost:3000'));
