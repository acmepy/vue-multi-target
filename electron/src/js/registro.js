const exeCmd = require('./exeCmd.js');
const appId="py.com.guarapi.notificaciones"
module.exports = {
  instalar:()=>{
    //para las notificaciones salgan con titulo e icono
    exeCmd(`reg add HKCU\\Software\\Classes\\AppUserModelId\\${appId} /f /t REG_SZ /v DisplayName /d "Notificaciones del Sistema"`);
    exeCmd(`reg add HKCU\\Software\\Classes\\AppUserModelId\\${appId} /f /t REG_SZ /v IconUri /d %LocalAppData%\\notificaciones\\app.ico`);
    exeCmd(`reg add HKCU\\Software\\Classes\\AppUserModelId\\${appId} /f /t REG_DWORD /v ShowInSettings /d 0`);
    exeCmd(`reg add HKCU\\Software\\Classes\\AppUserModelId\\${appId} /f /t REG_DWORD /v ShowInSettings /d 0`);

    //para que inicie al iniciar el sistema
    exeCmd(`reg add HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /f /t REG_SZ /v Notificaciones /d "%LocalAppData%\\notificaciones\\update.exe --processStart Notificaciones.exe"`);
  },
  desInstalar:()=>{
    console.log('borrando entradas al registro')
    exeCmd(`reg delete HKCU\\Software\\Classes\\AppUserModelId\\${appId} /f`);
    exeCmd(`reg delete HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Notifications\\Settings\\${appId} /f`);
    exeCmd(`reg delete HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\PushNotifications\\Backup\\${appId} /f`);
    exeCmd(`reg delete HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /f /v Notificaciones`);
  }
}