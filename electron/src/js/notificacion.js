import { Notification } from 'electron/main';
import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';

const SERVER_URL = '3d1486a79b9a.ngrok-free.app'; // tu servidor Express
let clientId = null;
let ws = null;

export async function suscribe() {
  try {
    //clientId = localStorage.getItem('clientId')
    if (!clientId) {
      clientId = uuidv4();
      //localStorage.setItem('clientId', clientId)
    }

    await fetch(`https://${SERVER_URL}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'prueba', clientId, platform: 'electron' }),
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

  ws = new WebSocket(`wss://${SERVER_URL}/upgrade?clientId=${clientId}`);

  ws.on('open', () => {
    console.log('WS conectado');
  });
  ws.on('message', (msg) => {
    try {
      const { title, body } = JSON.parse(msg.toString());
      console.log('WS message', { title, body });
      notification({ title, body });
    } catch (err) {
      console.error('WS Error parseando mensaje:', err);
    }
  });
  ws.on('close', () => {
    console.log('WS cerrado, intentando reconectar...');
    setTimeout(() => connect(clientId), 3000);
  });

  ws.on('error', (err) => {
    console.error('WS Error:', err.message);
  });
}

export function notification({ title, body }) {
  new Notification({ title, body }).show();
}

/*export function disconnectNotifications() {
  if (ws) ws.close();
}
*/
/*export async function suscribe() {
  await subscribe();
  connect();
}*/
