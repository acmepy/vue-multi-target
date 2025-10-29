//
//http://localhost:3000/electron/RELEASES?id=vue&localVersion=0.0.2&arch=amd64
//
import { autoUpdater } from 'electron/main';
import { app } from 'electron/main';
import fs from 'node:fs';
import path from 'node:path';

const SERVER_URL = `${process.env.SERVER_URL}/electron`;

export default () => {
  if (app.isPackaged) {
    try {
      autoUpdater.setFeedURL(SERVER_URL);
      autoUpdater.checkForUpdates();
      autoUpdater.on('checking-for-update', () => {
        console.log('Buscando Actualizaciones');
      });
      autoUpdater.on('update-available', () => {
        console.log('Hay una actualización y se esta descagando!');
      });
      autoUpdater.on('update-not-available', () => {
        console.log('No hay actualizaciones :(');
      });
      autoUpdater.on('update-downloaded', (event, notes, name, date) => {
        console.log('Actualización descargada!');
        console.log(`La nueva versión es ${name} y con fecha ${date}`);
        console.log(`Notas de esta version: ${notes}`);

        // The update will automatically be installed the next time the
        // app launches. If you want to, you can force the installation
        // now:
        autoUpdater.quitAndInstall();
      });

      app.on('ready', () => {
        cleanOldVersions();
      });
    } catch (e) {
      console.log('Error al actualizar', e);
    }
  }
};

export function cleanOldVersions() {
  const baseDir = path.resolve(path.dirname(process.execPath), '..');
  const currentFolder = path.basename(path.dirname(process.execPath));

  console.log('Base dir:', baseDir);
  console.log('Current folder:', currentFolder);

  fs.readdirSync(baseDir).forEach((folder) => {
    const fullPath = path.join(baseDir, folder);
    if (folder.startsWith('app-') && folder !== currentFolder) {
      try {
        console.log('Eliminando versión antigua:', folder);
        fs.rmSync(fullPath, { recursive: true, force: true });
      } catch (e) {
        console.warn(`No se pudo eliminar ${folder}:`, e);
      }
    }
  });
}
