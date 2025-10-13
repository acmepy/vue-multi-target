import exeCmd from './exeCmd.js';
import pkg from '../../package.json' with { type: 'json' };

const appId = pkg.appId;

export function instalarWin() {
  //para las notificaciones salgan con titulo e icono
  exeCmd(`reg add HKCU\\Software\\Classes\\AppUserModelId\\${appId} /f /t REG_SZ /v DisplayName /d "Notificaciones del Sistema"`);
  exeCmd(`reg add HKCU\\Software\\Classes\\AppUserModelId\\${appId} /f /t REG_SZ /v IconUri /d %LocalAppData%\\${pkg.productName}\\app-${pkg.version}\\resources\\electron.ico`);
  exeCmd(`reg add HKCU\\Software\\Classes\\AppUserModelId\\${appId} /f /t REG_DWORD /v ShowInSettings /d 0`);
  exeCmd(`reg add HKCU\\Software\\Classes\\AppUserModelId\\${appId} /f /t REG_DWORD /v ShowInSettings /d 0`);

  //para que inicie al iniciar el sistema
  exeCmd(
    `reg add HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /f /t REG_SZ /v ${pkg.productName} /d "%LocalAppData%\\${pkg.productName}\\update.exe --processStart ${pkg.productName}.exe"`
  );
}
export function desInstalarWin() {
  console.log('borrando entradas al registro');
  exeCmd(`reg delete HKCU\\Software\\Classes\\AppUserModelId\\${appId} /f`);
  exeCmd(`reg delete HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Notifications\\Settings\\${appId} /f`);
  exeCmd(`reg delete HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\PushNotifications\\Backup\\${appId} /f`);
  exeCmd(`reg delete HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run /f /v ${pkg.productName}`);
}
