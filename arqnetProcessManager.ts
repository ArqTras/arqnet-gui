/* eslint-disable @typescript-eslint/no-explicit-any */
import util from 'util';
import {
  logLineToAppSide,
  sendGlobalErrorToAppSide,
  sendIpcReplyAndDeleteJob
} from './ipcNode';
import { ArqnetLinuxProcessManager } from './arqnetProcessManagerLinux';
import {
  ArqnetSystemDProcessManager,
  isSystemD
} from './arqnetProcessManagerSystemd';

import { ArqnetWindowsProcessManager } from './arqnetProcessManagerWindows';

import { exec } from 'child_process';
import { ArqnetMacOSProcessManager } from './arqnetProcessManagerMacOS';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const execPromisified = util.promisify(exec);
// eslint-disable-next-line @typescript-eslint/no-var-requires

const LINUX = 'linux';
const WIN = 'win32';
const MACOS = 'darwin';

export const invoke = async (
  cmd: string,
  args: Array<string>
): Promise<string | null> => {
  const cmdWithArgs = `${cmd} ${args.join(' ')}`;
  console.log('running cmdWithArgs', cmdWithArgs);
  try {
    const result = await execPromisified(cmdWithArgs);
    if (result && (result.stdout || result.stderr)) {
      console.info(`Failed to invoke: '${cmdWithArgs}'`);
      console.info(`result: `, result);
      return result.stdout || result.stderr || null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.info('invoke failed with', e);
    const stderr = e.stderr ? e.stderr : '';
    const stdout = e.stdout ? e.stdout : '';
    const cmd = e.cmd ? `${e.cmd}: ` : '';
    logLineToAppSide(`invoke failed with: ${e}`);
    return `${cmd}${stdout}  ${stderr}`;
  }

  return null;
};

export interface IArqnetProcessManager {
  nodeStartArqnetProcess: () => Promise<string | null>;
  nodeStopArqnetProcess: () => Promise<string | null>;
}

let arqnetProcessManager: IArqnetProcessManager;

const getArqnetProcessManager = async () => {
  if (arqnetProcessManager) {
    return arqnetProcessManager;
  }

  if (process.platform === WIN) {
    logLineToAppSide('Current system is windows');

    arqnetProcessManager = new ArqnetWindowsProcessManager();
    return arqnetProcessManager;
  }

  if (process.platform === MACOS) {
    logLineToAppSide('Current system is macos');

    arqnetProcessManager = new ArqnetMacOSProcessManager();
    return arqnetProcessManager;
  }

  if (process.platform === LINUX) {
    if (await isSystemD()) {
      arqnetProcessManager = new ArqnetSystemDProcessManager();
      return arqnetProcessManager;
    }
    logLineToAppSide('Current system is linux but not systemd');

    arqnetProcessManager = new ArqnetLinuxProcessManager();
    return arqnetProcessManager;
  }
  logLineToAppSide('Current system is UNSUPPORTED');

  throw new Error(
    `ArqnetProcessManager not implemented for ${process.platform}`
  );
};

export const doStartArqnetProcess = async (jobId: string): Promise<void> => {
  let result: string | undefined;

  try {
    logLineToAppSide('About to start Arqnet process');

    const manager = await getArqnetProcessManager();

    let startResult = await manager.nodeStartArqnetProcess();
    logLineToAppSide(`Arqnet process start result: "${startResult}"`);

    if (
      startResult &&
      startResult.includes('The requested service has already been started')
    ) {
      // try to stop it and restart it?
      logLineToAppSide(`Trying to restart the daemon...`);
      const stopResult = await manager.nodeStopArqnetProcess();
      logLineToAppSide(`restart stop: ${stopResult}`);

      startResult = await manager.nodeStartArqnetProcess();
      logLineToAppSide(`Arqnet process restart result: "${startResult}"`);
    }

    if (startResult) {
      sendGlobalErrorToAppSide('error-start-stop');
    }
    sendIpcReplyAndDeleteJob(jobId, null, '');
  } catch (e: any) {
    logLineToAppSide(`Arqnet process start failed with ${e.message}`);
    console.info('nodeStartArqnetProcess failed with', e);
    sendGlobalErrorToAppSide('error-start-stop');
    sendIpcReplyAndDeleteJob(jobId, null, result);
  }
};

/**
 * doStopArqnetProcess is only called when exiting the app so there is no point to wait
 * for the event return and so no jobId argument required
 */
export const doStopArqnetProcess = async (jobId: string): Promise<void> => {
  try {
    logLineToAppSide('About to stop Arqnet process');

    const manager = await getArqnetProcessManager();
    await manager.nodeStopArqnetProcess();
    sendIpcReplyAndDeleteJob(jobId, null, '');
  } catch (e: any) {
    logLineToAppSide(`Arqnet process stop failed with ${e.message}`);
    sendIpcReplyAndDeleteJob(jobId, e.message, '');

    console.info('nodeStopArqnetProcess failed with', e);
  }
};
