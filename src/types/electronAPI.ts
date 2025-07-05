// Shared type definitions for electronAPI
declare global {
  interface Window {
    electronAPI: {
      ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>;
        send: (channel: string, ...args: any[]) => void;
        on: (channel: string, func: (...args: any[]) => void) => void;
        removeAllListeners: (channel: string) => void;
        setMaxListeners: (n: number) => void;
      };
      config: {
        get: (key: string, defaultValue?: any) => Promise<any>;
        set: (key: string, value: any) => Promise<boolean>;
        has: (key: string) => Promise<boolean>;
        delete: (key: string) => Promise<boolean>;
        clear: () => Promise<boolean>;
        size: () => Promise<number>;
      };
    };
    nodeAPI: {
      process: {
        platform: string;
      };
    };
  }
}

export {}; // Make this a module
