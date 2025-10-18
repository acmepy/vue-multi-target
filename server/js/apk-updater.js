/*
import fs from 'fs';

import Apk from 'node-apk';
import logger from './lib/logger.js'

const path = './app-apk'
const dir = '../cordova/platforms/android/app/build/outputs/apk/debug';
const file = dir + '/app-debug.apk';
const app = dir + '/app.apk';
const json = dir + '/app.json';

export const version = async () => {
  const apk = new Apk.Apk(app);
  const manifest = (await apk.getManifestInfo()).xml.attributes;
  const resources = (await apk.getResources()).table;
  const data = {
    name: app.split('/')[2],
    size: size(app),
    //compressedSize: 1327288,
    app: {
      name: resources.stringPool.values[0],
      package: manifest.package,
      version: {
        code: manifest.versionCode,
        name: manifest.versionName,
      },
    },
  };
  apk.close();
  fs.writeFileSync(json, JSON.stringify(data, null, 2));
  return data;
};

const size = (file) => {
  const oStats = fs.statSync(file);
  return oStats.size;
};

const watch = () => {
  //logger.info(path, 'escuchando cambios en '+file.split('/')[2])
  fs.watch(dir, async (eventType, filename) => {
    if (filename.indexOf('filepart') < 0 && ['rename'].includes(eventType)) {
      if (fs.existsSync(file)) {
        setTimeout(async () => {
          fs.renameSync(file, app);
          await version();
        }, 1000);
      }
    }
  });
};
*/
export default {
  /*version,
  size,
  watch,*/
};
