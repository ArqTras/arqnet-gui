import { IArqnetProcessManager, invoke } from './arqnetProcessManager';

export class ArqnetWindowsProcessManager implements IArqnetProcessManager {
  nodeStartArqnetProcess(): Promise<string | null> {
    return invoke('net', ['start', 'arqnet']);
  }

  nodeStopArqnetProcess(): Promise<string | null> {
    return invoke('net', ['stop', 'arqnet']);
  }
}
