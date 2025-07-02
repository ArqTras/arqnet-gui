import { IArqnetProcessManager } from './arqnetProcessManager';

export class ArqnetLinuxProcessManager implements IArqnetProcessManager {
  async nodeStartArqnetProcess(): Promise<string | null> {
    throw new Error('Not systemd: not supported yet');
  }

  async nodeStopArqnetProcess(): Promise<string | null> {
    throw new Error('Not systemd: not supported yet');
  }
}
