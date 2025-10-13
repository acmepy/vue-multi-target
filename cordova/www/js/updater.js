/* global ApkUpdater */

const SERVER = 'http://localhost:3000/apk';
const version = SERVER + '/app.json';
const apk = SERVER + 'app.apk';

export async function puedoInstalar() {
  let puedoInstalar = true;
  console.log('updater.puedoInstalar1', 'iniciando');
  puedoInstalar = await ApkUpdater.canRequestPackageInstalls();
  console.log('updater.puedoInstalar2', { puedoInstalar });
  if (!puedoInstalar) {
    console.log('updater.puedoInstalar3', 'soliciatando permiso');
    puedoInstalar = await ApkUpdater.openInstallSetting();
    console.log('updater.puedoInstalar4', { puedoInstalar });
    /*if (!puedoInstalar) {
      alert('Es necesario el permiso instalar.');
    } else {
      buscar();
    }*/
  }
  return puedoInstalar;
}

async function buscar() {
  const remote = await fetch(version).then((r) => r.json()); //, { headers: { Authorization: 'Basic ' + btoa(username + ':' + password) } });
  const local = await ApkUpdater.getInstalledVersion();
  const actualizacionDisponible = remote.app.version.code > local.version.code;
  console.log('updater.buscar', { remote: remote.app.version.code, local: local.version.code, actualizacionDisponible });
  if (actualizacionDisponible) {
    confirm('Hay una nueva versión, desea actualizar?', () => {
      actualizar();
    });
  }
}

async function actualizar() {
  if (await puedoInstalar()) {
    preloader('Descargando...');
    await ApkUpdater.download(apk); //, {authorization: "Basic " + btoa(username+':'+password)})
    preloader(false);
    await ApkUpdater.install();
    buscar();
  }
}

async function preloader(data) {
  if (!data) {
    console.log('quitando preloader');
  } else {
    console.log('mostrando preloader');
  }
}

export default function () {}
