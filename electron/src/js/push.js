import { Notification } from 'electron/main';
import { EventSourcePolyfill } from 'event-source-polyfill';

function generarUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0;
    var v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const SERVER_URL = process.env.SERVER_URL;
let clientId = null;
const options = { headers: { 'ngrok-skip-browser-warning': 'true' }, heartbeatTimeout: 120000 };
let mainWindow;

export async function init(mw) {
  console.log('iniciando subscripcion');
  mainWindow = mw;
  if (!clientId) {
    clientId = generarUUID();
  }
  await sse();
}
export async function sse() {
  const url = `${SERVER_URL}/push/sse/${'electron'}/${clientId}`;
  console.log('conectando a ', { url, clientId });
  const es = new EventSourcePolyfill(url, options);
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

/*
  const toastXml = `<toast launch="${appProtocol}://?action=click" activationType="protocol">
  <visual>
    <binding template="ToastGeneric"><text>${title}</text><text>${body}</text></binding>
  </visual>
  <actions>
    <action content="Yes" arguments="${appProtocol}://?action=yes" activationType="protocol" />
    <action content="No" arguments="${appProtocol}://?action=no" activationType="protocol" />
  </actions>
</toast>`
  const notification = new Notification({toastXml,timeoutType:'never'});
*/
