/* global process */
import { app } from 'electron';
import { instalarWin, desInstalarWin } from './registro.js';

export default () => {
  const isSquirrel = process.argv.some((arg) => arg.startsWith('--squirrel'));
  if (isSquirrel) {
    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
      case '--squirrel-install':
      case '--squirrel-updated':
        instalarWin();
        app.quit();
        break;
      case '--squirrel-uninstall':
        desInstalarWin();
        app.quit();
        break;
      case '--squirrel-obsolete':
        console.log('squirrel-obsolete');
        app.quit();
        break;
    }
  }
};
