import { Jimp } from 'jimp'
import fs from 'fs'
import path from 'path'
import { copy, remove } from 'fs-extra'

const electronAssets = async () => {
  fs.mkdirSync('../electron/icon', { recursive: true })
  remove('../electron/icon/cordova.png')
  copy('../public/pwa-512x512.png', '../electron/icon/cordova.png')
}
const outDir = '../cordova/res'
const [outDirIco, outDirScr] = [outDir + '/icon/android', outDir + '/screen/android']
fs.mkdirSync(outDirIco, { recursive: true })
fs.mkdirSync(outDirScr, { recursive: true })

const inIco = '../public/icon.png'
const inScr = '../public/icon.png'

// Iconos Android (densidades)
const icons = [
  { name: 'ldpi', size: 36 },
  { name: 'mdpi', size: 48 },
  { name: 'hdpi', size: 72 },
  { name: 'xhdpi', size: 96 },
  { name: 'xxhdpi', size: 144 },
  { name: 'xxxhdpi', size: 192 },
]

// Splashscreens Android (landscape y portrait)
const splashes = [
  { name: 'land-ldpi', width: 320, height: 240 },
  { name: 'land-mdpi', width: 480, height: 320 },
  { name: 'land-hdpi', width: 800, height: 480 },
  { name: 'land-xhdpi', width: 1280, height: 720 },
  { name: 'land-xxhdpi', width: 1600, height: 960 },
  { name: 'land-xxxhdpi', width: 1920, height: 1280 },

  { name: 'port-ldpi', width: 240, height: 320 },
  { name: 'port-mdpi', width: 320, height: 480 },
  { name: 'port-hdpi', width: 480, height: 800 },
  { name: 'port-xhdpi', width: 720, height: 1280 },
  { name: 'port-xxhdpi', width: 960, height: 1600 },
  { name: 'port-xxxhdpi', width: 1280, height: 1920 },
  { name: 'xxxhdpi', width: 1280, height: 1920 },
]

async function generateIcons() {
  const iconImg = await Jimp.read(inIco)
  for (const { name, size } of icons) {
    const file = path.join(outDirIco, `icon-${name}.png`)
    await iconImg.clone().resize({ w: size, h: size }).write(file)
    //console.log(`✅ Icono generado: ${file}`)
  }
}

async function generateSplashes() {
  let splashImg = await Jimp.read(inScr)
  for (const { name, width, height } of splashes) {
    const file = path.join(outDirScr, `splash-${name}.png`)
    const icoSize = width * 0.15
    splashImg = splashImg.clone().cover({ w: icoSize, h: icoSize })
    const splash = new Jimp({ width, height, color: 0x00000000 })
    const [x, y] = [(width - icoSize) / 2, (height - icoSize) / 2]
    await splash.composite(splashImg, x, y).write(file)
    //console.log(`✅ Splash generado: ${file}`)
  }
}

;(async () => {
  await generateIcons()
  await generateSplashes()
  await electronAssets()
  console.log('🎉 Todos los assets generados en', outDir)
})()
