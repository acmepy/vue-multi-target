function generarUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0;
    var v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const SERVER_URL = window.ENV.SERVER_URL;
let clientId = null;
const options = { headers: { 'ngrok-skip-browser-warning': 'true' }, heartbeatTimeout: 120000 };

async function init() {
  console.log('iniciando subscripcion');
  if (!clientId) {
    clientId = generarUUID();
  }
  window.clientId = clientId;
  await sse();
}

async function sse() {
  const url = `${SERVER_URL}/push/sse/${'cordova'}/${clientId}`;
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
function notification({ title, body, url }) {
  if (!cordova || !cordova.plugins || !cordova.plugins.notification) {
    console.warn('Notificación local no disponible en este entorno');
  } else {
    cordova.plugins.notification.local.schedule({ id: 1, title, text: body, data: { route: url } }); //foreground: true, smallIcon: 'res://icon', sound: true,
  }
}

document.addEventListener('deviceready', () => {
  init();
});
