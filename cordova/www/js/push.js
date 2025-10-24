function generarUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0;
    var v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

//const SERVER_URL = 'fdf623084ec8.ngrok-free.app';
const SERVER_URL = window.ENV.SERVER_URL;
let clientId = null;
let ws = null;

async function suscribe() {
  if (!clientId) {
    clientId = generarUUID();
  }
  window.clientId = clientId;

  try {
    await fetch(`https://${SERVER_URL}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'prueba', clientId, platform: 'cordova' }),
    });
    console.log('Suscripción enviada correctamente');
    connect();
  } catch (e) {
    console.error('Error al suscribirse', e);
  }
}

function connect() {
  if (!clientId) {
    console.error('Debe suscribirse primero con suscribe()');
    return;
  }

  ws = new WebSocket(`wss://${SERVER_URL}/upgrade?clientId=${clientId}`);

  ws.onopen = () => {
    console.log('WS conectado');
  };

  ws.onmessage = (msg) => {
    try {
      const { title, body, url } = JSON.parse(msg.data);
      console.log('WS mensaje', { title, body, url });
      notification({ title, body, url });
    } catch (err) {
      console.error('WS Error parseando mensaje:', err);
    }
  };

  ws.onclose = () => {
    console.warn('WS cerrado, reintentando...');
    setTimeout(connect, 3000);
  };
}

function notification({ title, body, url }) {
  if (!cordova || !cordova.plugins || !cordova.plugins.notification) {
    console.warn('Notificación local no disponible en este entorno');
    return;
  }

  cordova.plugins.notification.local.schedule({
    id: 1,
    title,
    text: body,
    data: { route: url },
    //foreground: true,
    //smallIcon: 'res://icon', // opcional
    //sound: true,
  });
}

console.log('notificaciones push cargado');
suscribe();
