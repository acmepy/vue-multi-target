import 'dotenv/config';
import express from 'express';
import cors from 'cors';
//import bodyParser from 'body-parser';

import api from './routes/api.js';
import push from './routes/push.js';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, '../dist');

const app = express();
app.use(cors());
//app.use(bodyParser.json());
app.use(express.json());

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
app.use('/push', push);
app.use('/api', api);

app.listen(3000, () => console.log('Backend en http://localhost:3000'));
