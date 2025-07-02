import { IArqnetProcessManager, invoke } from './arqnetProcessManager';
import { logLineToAppSide } from './ipcNode';

import { app } from 'electron';
import { dirname } from 'path';

function getArqnetControlLocation() {
  // We will be at: Arqnet.app/Contents/Helpers/Arqnet-GUI.app/Contents/MacOS/Arqnet-GUI, we want to back to
  // Arqnet.app/Contents/MacOS/Arqnet:
  const controlLocation =
    dirname(dirname(dirname(dirname(dirname(app.getPath('exe')))))) +
    '/MacOS/Arqnet';
  logLineToAppSide(`Arqnet bin control location: "${controlLocation}"`);
  return controlLocation;
}

export class ArqnetMacOSProcessManager implements IArqnetProcessManager {
  nodeStartArqnetProcess(): Promise<string | null> {
    return invoke(getArqnetControlLocation(), ['--start']);
  }

  nodeStopArqnetProcess(): Promise<string | null> {
    return invoke(getArqnetControlLocation(), ['--stop']);
  }
}
