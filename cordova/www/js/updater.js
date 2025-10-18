/* global ApkUpdater */
const SERVER = `https://${window.SERVER}/android/`;
const version = SERVER + 'output-metadata.json';
const apk = SERVER + 'app-debug.apk';

async function puedoInstalar() {
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
  console.log('updater.buscar iniciando');
  const remote = await fetch(version, { headers: { 'ngrok-skip-browser-warning': 'true' } }).then((r) => r.json()); //, { headers: { Authorization: 'Basic ' + btoa(username + ':' + password) } });
  console.log('updater.buscar 2', remote);
  const local = await ApkUpdater.getInstalledVersion();
  const actualizacionDisponible = remote.elements[0].versionCode > local.version.code;
  console.log('updater.buscar 3', { remote: remote.elements[0].versionCode, local: local.version.code, actualizacionDisponible });
  if (actualizacionDisponible) {
    if (confirm('Hay una nueva versión, desea actualizar?')) {
      await actualizar();
    }
  }
}

async function actualizar() {
  console.log('updater.actualizar iniciando');
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

//export default function () {}

console.log('updater buscando actualizaciones');
buscar();
