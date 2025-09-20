import { copy, remove } from 'fs-extra'
import { readFileSync, writeFileSync } from 'fs'
import { EOL } from 'os'
import data from '../package.json' with { type: 'json' }

const pathSpa = '../dist/'
const pathCordova = '../cordova/www/'
const spatIndex = pathSpa + 'index.html'
const cordovaIndex = pathCordova + 'index.html'
const cordovaConfig = '../cordova/config.xml'
const cordovaPackage = '../cordova/package.json'

const updConfig = async () => {
  let conf = readFileSync(cordovaConfig, 'utf8')
  conf = conf.split(/\r?\n/)
  conf[1] = conf[1].replace(/id="(\w.\S+)"/, `id="${data.appId}"`).replace(/version="(\d.\S+)"/, data.version)
  conf[2] = conf[2].replace(/<name>(\w+)<\/name>/, `<name>${data.appName}</name>`)
  conf[3] = conf[3].replace(/<description>[\w\s]+<\/description>/, `<description>${data.description}</description>`)
  writeFileSync(cordovaConfig, conf.join(EOL))
}

const updPackage = async () => {
  let pk = JSON.parse(readFileSync(cordovaPackage, 'utf8'))
  pk.name = data.name
  pk.version = data.version
  pk.description = data.description
  pk.displayName = data.appName
  writeFileSync(cordovaPackage, JSON.stringify(pk, null, '\t'))
}

const assets = async () => {
  await remove(pathCordova + 'assets')
  await copy(pathSpa + 'assets', pathCordova + 'assets')

  await remove(pathCordova + 'favicon.ico')
  await copy(pathSpa + 'favicon.ico', pathCordova + 'icon/favicon.ico')

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

const build = async () => {
  await assets()
  await updConfig()
  await updPackage()
}

build()
