// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  onNotificationClick: (callback) => {
    ipcRenderer.on('notification-click', (_, route) => {
      console.log('on click ->', callback, route);
      callback(route);
    });
  },
});
