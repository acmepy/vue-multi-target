import { Notification } from 'electron/main';
import { EventSource } from 'eventsource';

function generarUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0;
    var v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const SERVER_URL = process.env.SERVER_URL;
let clientId = null;

let mainWindow;

export async function init(mw) {
  console.log('iniciando subscripcion');
  mainWindow = mw;
  //clientId = localStorage.getItem('clientId')
  if (!clientId) {
    clientId = generarUUID();
    //localStorage.setItem('clientId', clientId)
  }
  await sse();
}
export async function sse() {
  console.log('conectando a ', { SERVER_URL, clientId });
  const es = new EventSource(`${SERVER_URL}/push/sse/${'electron'}/${clientId}`);
  es.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Notificación:', data);
    if (!!data.title) {
      notification(data);
    }
  };
}
export function notification({ title, body, url }) {
  const n = new Notification({ title, body });
  const route = url;

  n.on('click', () => {
    if (route && mainWindow) {
      console.log('Notificación clickeada!');
      mainWindow.webContents.send('notification-click', route);
    }
  });

  n.show();
}
