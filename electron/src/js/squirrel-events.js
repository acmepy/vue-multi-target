const { app } = require('electron');
const {instalar, desInstalar} = require('./registro.js');

module.exports = ()=>{
  const isSquirrel = process.argv.some(arg => arg.startsWith('--squirrel'));
  if (isSquirrel) {
    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
      case '--squirrel-install':
      case '--squirrel-updated':
        instalar();
        app.quit();
        break;
      case '--squirrel-uninstall':
        desInstalar();
        app.quit();
        break;
      case '--squirrel-obsolete':
        console.log('squirrel-obsolete');
        app.quit();
        break;
    }
  }
}