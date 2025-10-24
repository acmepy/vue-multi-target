import { copy, remove } from 'fs-extra';
import { readFileSync, writeFileSync } from 'fs';
import { EOL } from 'os';
import data from '../package.json' with { type: 'json' };

const pathSpa = '../dist/';
const pathElectron = '../electron/src/';
const spatIndex = pathSpa + 'index.html';
const electronIndex = pathElectron + 'index.html';
const electronPackage = '../electron/package.json';

const updPackage = async () => {
  let pk = JSON.parse(readFileSync(electronPackage, 'utf8'));
  pk.version = data.version;
  pk.description = data.description;
  pk.productName = data.appName;
  pk.name = data.appName; //para que nupkg tenga el mismo nombre
  pk.appId = data.appId;
  writeFileSync(electronPackage, JSON.stringify(pk, null, '\t'));
};

const assets = async () => {
  await remove(pathElectron + 'assets');
  await copy(pathSpa + 'assets', pathElectron + 'assets');

  await remove(pathElectron + 'electron.ico');
  await copy(pathSpa + 'favicon.ico', pathElectron + 'icon/electron.ico');

  await remove(pathElectron + 'electron.png');
  await copy(pathSpa + 'pwa-64x64.png', pathElectron + 'icon/electron.png');

  //agregando referencias assets de dist/index.html
  let idxSpa = readFileSync(spatIndex, 'utf8');
  idxSpa = idxSpa.split(/\r?\n/).filter((i) => i.indexOf('/assets/') > -1);
  let idxCor = readFileSync(electronIndex, 'utf8');
  idxCor = idxCor.split(/\r?\n/);
  let idxFin = [];
  idxCor.forEach((i) => {
    if (!(i.indexOf('assets') > -1)) {
      idxFin.push(i);
    }
    if (i.indexOf('<!--dist/index-->') > -1) {
      idxSpa.forEach((s) => {
        idxFin.push(s.replaceAll('/app/', './'));
      });
    }
  });
  writeFileSync(electronIndex, idxFin.join(EOL));
};

const clear = async () => {
  await remove('../electron/out/*');
};

const build = async () => {
  await assets();
  await updPackage();
  await clear();
};

build();
