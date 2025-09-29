import { autoUpdater } from 'electron/main'
const os = process.platform == 'win32' ? 'windows' : 'linux'

export default () => {
  try {
    //autoUpdater.setFeedURL(`http://www.guarapi.com.py/notificaciones/update/${process.platform}/${app.getVersion()}`);
    autoUpdater.setFeedURL(`http://www.guarapi.com.py/notificaciones/${os}`)
    autoUpdater.checkForUpdates()
    autoUpdater.on('checking-for-update', () => {
      console.log('Buscando Actualizaciones')
    })
    autoUpdater.on('update-available', () => {
      console.log('Hay una actualización y se esta descagando!')
    })
    autoUpdater.on('update-not-available', () => {
      console.log('No hay actualizaciones :(')
    })
    autoUpdater.on('update-downloaded', (event, notes, name, date) => {
      console.log('Actualización descargada!')
      console.log(`La nueva versión es ${name} y con fecha ${date}`)
      console.log(`Notas de esta version: ${notes}`)

      // The update will automatically be installed the next time the
      // app launches. If you want to, you can force the installation
      // now:
      autoUpdater.quitAndInstall()
    })
  } catch (e) {
    console.log('Error al actualizar', e)
  }
}
