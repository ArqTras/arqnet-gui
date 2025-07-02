/* eslint-disable @typescript-eslint/no-explicit-any */
import { IArqnetProcessManager, invoke } from './arqnetProcessManager';
import util from 'util';
import { exec } from 'child_process';
import { logLineToAppSide } from './ipcNode';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const execPromisified = util.promisify(exec);

export const isSystemD = async (): Promise<boolean> => {
  try {
    const { stdout, stderr } = await execPromisified(
      'ps --no-headers -o comm 1'
    );
    if (stdout && stdout.trim() === 'systemd') {
      logLineToAppSide('SystemD: The current system is using systemd.');
      return true;
    }
    console.log('isSystemD stderr:', stderr);
    throw new Error('not systemD');
  } catch (e: any) {
    logLineToAppSide(`The current system is NOT using systemd: ${e.message}`);

    console.error(e); // should contain code (exit code) and signal (that caused the termination).
    return false;
  }
};

const arqnetService = 'arqnet.service';

export class ArqnetSystemDProcessManager implements IArqnetProcessManager {
  async nodeStartArqnetProcess(): Promise<string | null> {
    const result = await invoke('systemctl', [
      '--no-block',
      'start',
      arqnetService
    ]);

    if (!result) {
      logLineToAppSide('SystemD: arqnet service started');
    }
    return result;
  }

  async nodeStopArqnetProcess(): Promise<string | null> {
    return invoke('systemctl', ['--no-block', 'stop', arqnetService]);
  }
}
