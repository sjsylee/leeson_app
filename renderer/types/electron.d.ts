export {};

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, data?: unknown) => void;
        on: (
          channel: string,
          callback: (event: unknown, ...args: unknown[]) => void
        ) => void;
        removeListener: (
          channel: string,
          callback: (event: unknown, ...args: unknown[]) => void
        ) => void;
        invoke: <T = unknown>(channel: string, ...args: unknown[]) => Promise<T>;
      };
    };
  }
}
