/* global cordova */
import { v4 as uuidv4 } from 'uuid';

const SERVER_URL = 'localhost:3000'; // tu servidor Express
let clientId = null;
let ws = null;

export async function suscribe() {
  //clientId = localStorage.getItem('clientId')
  if (!clientId) {
    clientId = uuidv4();
    //localStorage.setItem('clientId', clientId)
  }
  window.clientId = clientId;

  try {
    await fetch(`http://${SERVER_URL}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'prueba', clientId, platform: 'cordova' }),
    });
    console.log('Suscripcion enviada');
    connect();
  } catch (e) {
    console.error('Suscribe, Error registrando', e);
  }
}

export function connect() {
  if (!clientId) {
    console.error('Debe suscribirse primero con subscribe()');
    return;
  }

  ws = new WebSocket(`ws://${SERVER_URL}/upgrade?clientId=${clientId}`);

  ws.onopen = () => {
    console.log('WS conectado');
  };
  ws.onmessage = (msg) => {
    try {
      const { title, body } = JSON.parse(msg.data);
      console.log('WS message', { title, body });
      notification({ title, body });
    } catch (err) {
      console.error('WS Error parseando mensaje:', err);
    }
  };
  ws.onclose = () => {
    console.warn('WS cerrado, reintentando...');
    setTimeout(() => connect(), 3000);
  };

  //ws.onerror = () => {};
}

export function notification({ title, body }) {
  cordova.plugins.notification.local.schedule({
    title,
    text: body,
    foreground: true,
    smallIcon: 'res://icon', // opcional
    sound: true,
  });
}
