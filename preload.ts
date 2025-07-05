import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
    send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
    on: (channel: string, func: (...args: any[]) => void) => {
      const validChannels = [
        'app-logs-updated',
        'status-updated', 
        'ui-status-updated',
        'window-close',
        'window-minimize',
        'window-maximize',
        'IPC_LOG_LINE',
        'IPC_GLOBAL_ERROR',
        'IPC_CHANNEL_KEY'
      ];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    removeAllListeners: (channel: string) => {
      ipcRenderer.removeAllListeners(channel);
    },
    setMaxListeners: (n: number) => {
      ipcRenderer.setMaxListeners(n);
    }
  },
  // Config API for electron-store
  config: {
    get: (key: string, defaultValue?: any) => {
      return ipcRenderer.invoke('config-get', { key, defaultValue });
    },
    
    set: (key: string, value: any) => {
      return ipcRenderer.invoke('config-set', { key, value });
    },
    
    has: (key: string) => {
      return ipcRenderer.invoke('config-has', key);
    },
    
    delete: (key: string) => {
      return ipcRenderer.invoke('config-delete', key);
    },
    
    clear: () => {
      return ipcRenderer.invoke('config-clear');
    },
    
    size: () => {
      return ipcRenderer.invoke('config-size');
    }
  }
});

// Expose Node.js APIs if needed (be very careful with this)
contextBridge.exposeInMainWorld('nodeAPI', {
  process: {
    platform: process.platform
  }
});
