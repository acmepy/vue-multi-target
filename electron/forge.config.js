import { FusesPlugin } from '@electron-forge/plugin-fuses'
import { FuseV1Options, FuseVersion } from '@electron/fuses'
//import { appName, version } = require('../package.json')
import pkg from '../package.json' with { type: 'json' }
const { appName, version } = pkg

export default {
  packagerConfig: {
    asar: true,
    icon: './src/icon/electron.ico',
    extraResource: ['./src/icon/electron.ico', './src/icon/electron.png'],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: { setupIcon: './src/icon/electron.ico', iconUrl: 'http://www.guarapi.com.py/notificaciones/windows/electron.ico', setupExe: `${appName}-${version}.exe` },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'], //'win32',
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },

    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
}
