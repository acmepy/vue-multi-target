import { copy, remove } from 'fs-extra'
import { readFileSync, writeFileSync } from 'fs'
import { EOL } from 'os'

const pathSpa = '../dist/'
const pathCordova = '../cordova/www/'
const spatIndex = pathSpa + 'index.html'
const cordovaIndex = pathCordova + 'index.html'

const build = async () => {
  await remove(pathCordova + 'assets')
  await copy(pathSpa + 'assets', pathCordova + 'assets')

  await remove(pathCordova + 'favicon.ico')
  await copy(pathSpa + 'favicon.ico', pathCordova + 'icon/favicon.ico')

  /*await remove(pathCordova + 'icon/icon-192x192.png')
  await copy(pathSpa + 'pwa-192x192.png', pathCordova + 'icon/icon-192x192.png')
  await remove(pathCordova + 'icon/icon-512x512.png')
  await copy(pathSpa + 'pwa-512x512.png', pathCordova + 'icon/icon-512x512.png')*/

  //agregando referencias assets de dist/index.html
  let idxSpa = readFileSync(spatIndex, 'utf8')
  idxSpa = idxSpa.split(/\r?\n/).filter((i) => i.indexOf('/assets/') > -1)
  let idxCor = readFileSync(cordovaIndex, 'utf8')
  idxCor = idxCor.split(/\r?\n/)
  let idxFin = []
  idxCor.forEach((i) => {
    if (!(i.indexOf('assets') > -1)) {
      idxFin.push(i)
    }
    if (i.indexOf('<!--dist/index-->') > -1) {
      idxSpa.forEach((s) => {
        idxFin.push(s)
      })
    }
  })
  writeFileSync(cordovaIndex, idxFin.join(EOL))
}

build()
