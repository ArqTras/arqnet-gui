/* eslint-disable @typescript-eslint/no-explicit-any */
import { app, BrowserWindow, screen, Tray, ipcMain } from 'electron';
import * as path from 'path';
import { initializeIpcNodeSide } from './ipcNode';
import { doStopArqnetProcess } from './arqnetProcessManager';
import { closeRpcConnection } from './arqnetRpcCall';
import { createTrayIcon } from './trayIcon';
import { markShouldQuit, shouldQuit } from './windowState';

import ElectronStore from 'electron-store';
import {
  getDefaultOnExitDo,
  OnExitStopSetting,
  SETTINGS_ID_SELECTED_THEME,
  SETTINGS_ID_STOP_ON_EXIT
} from './types';
import { darkTheme, lightTheme } from './src/app/theme';
import { isMacOS, isLinux } from './sharedIpc';

let store: ElectronStore | undefined;

let mainWindow: BrowserWindow | null;
let tray: Tray | null = null;
let ready = false;

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

export function getTrayIcon(): Tray | null {
  return tray;
}

async function createWindow() {
  if (!store) {
    store = new ElectronStore();
  }

  // Setup config IPC handlers
  ipcMain.handle('config-get', (event, { key, defaultValue }) => {
    return store?.get(key, defaultValue);
  });

  ipcMain.handle('config-set', (event, { key, value }) => {
    store?.set(key, value);
    return true;
  });

  ipcMain.handle('config-has', (event, key) => {
    return store?.has(key);
  });

  ipcMain.handle('config-delete', (event, key) => {
    store?.delete(key);
    return true;
  });

  ipcMain.handle('config-clear', () => {
    store?.clear();
    return true;
  });

  ipcMain.handle('config-size', () => {
    return store?.size;
  });

  const allDisplays = screen.getAllDisplays();

  const openDevTools = process.env.OPEN_DEV_TOOLS === 'true' || false;
  const defaultHeight = 850;
  const defaultWidth = openDevTools ? 1250 : 450;

  const bounds = allDisplays[0].bounds;

  const width = defaultWidth;
  let height = defaultHeight;

  const selectedTheme = store.get(SETTINGS_ID_SELECTED_THEME, 'light');
  const screenHeight = bounds.height;
  // ideally we want the window to be 850 so everything fits in it without resizing.
  // but some screen are too small to fit this. So, if we are on a small screen, make the default height to be 700 instead

  if (screenHeight < defaultHeight) {
    height = 700;
  }

  mainWindow = new BrowserWindow({
    width,
    height,
    minHeight: 600,
    minWidth: 450,
    resizable: true,

    icon: './build/icon.png',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor:
      selectedTheme === 'light'
        ? lightTheme.backgroundColor
        : darkTheme.backgroundColor,
    autoHideMenuBar: true,
    frame: false,
    x: Math.floor(bounds.x + bounds.width / 2 - width / 2),
    y: Math.floor(bounds.y + bounds.height / 2 - height / 2)
  });
  ready = true;
  if (!isMacOS()) {
    tray = createTrayIcon(getMainWindow);
  }

  mainWindow.loadFile('./dist/index.html');
  if (openDevTools) {
    mainWindow.webContents.openDevTools({ mode: 'right' });
  }

  // if you hide the menu the shortcut CTLR-Q won't work
  // mainWindow.removeMenu();
  await initializeIpcNodeSide(getMainWindow);

  // Emitted when the window is about to be closed.
  // Note: We do most of our shutdown logic here because all windows are closed by
  //   Electron before the app quits.
  mainWindow.on('close', async (e) => {
    if (!mainWindow || shouldQuit()) {
      return;
    }
    // Prevent the shutdown
    e.preventDefault();
    mainWindow.hide();

    // toggle the visibility of the show/hide tray icon menu entries
    if (!isMacOS()) {
      (tray as any)?.updateContextMenu();
    }

    return;
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

let stopEverythingDone = false;
app.on('before-quit', async (event) => {
  console.log('before-quit event');
  closeRpcConnection();

  const todoOnExit: OnExitStopSetting =
    (store?.get(
      SETTINGS_ID_STOP_ON_EXIT,
      getDefaultOnExitDo()
    ) as OnExitStopSetting) || getDefaultOnExitDo();
  console.info('todoOnExit', todoOnExit);

  if (todoOnExit === 'stop_everything') {
    if (isLinux()) {
      console.info('just triggering arqnet daemon stop');
      void doStopArqnetProcess('stop_everything');
    } else {
      if (stopEverythingDone) {
        return;
      }
      event.preventDefault();
      console.info('waiting for arqnet daemon to stop');
      await doStopArqnetProcess('stop_everything');
      console.info('arqnet daemon stopped');
      stopEverythingDone = true;

      tray?.destroy();
      markShouldQuit();
      // we have to call quite ourself as we prevented the event default
      app.quit();
      return;
    }
  }

  tray?.destroy();
  markShouldQuit();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (!ready) {
    return;
  }

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow) {
    mainWindow.show();
  } else {
    createWindow();
  }
});

// Defense in depth. We never intend to open webviews or windows. Prevent it completely.
app.on('web-contents-created', (createEvent, contents) => {
  contents.on('will-attach-webview', (attachEvent) => {
    attachEvent.preventDefault();
  });
  contents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });
});

app.on('ready', createWindow);
