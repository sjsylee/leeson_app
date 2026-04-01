import { contextBridge, ipcRenderer } from "electron";
import type { IpcRendererEvent } from "electron";

type RendererListener = (event: IpcRendererEvent, ...args: unknown[]) => void;

const listenerMap = new Map<string, Map<RendererListener, (event: IpcRendererEvent, ...args: unknown[]) => void>>();

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel: string, data?: unknown) => ipcRenderer.send(channel, data),
    on: (channel: string, callback: RendererListener) => {
      const wrappedListener = (event: IpcRendererEvent, ...args: unknown[]) => {
        callback(event, ...args);
      };

      const channelListeners = listenerMap.get(channel) ?? new Map();
      channelListeners.set(callback, wrappedListener);
      listenerMap.set(channel, channelListeners);

      ipcRenderer.on(channel, wrappedListener);
    },
    removeListener: (channel: string, callback: RendererListener) => {
      const channelListeners = listenerMap.get(channel);
      const wrappedListener = channelListeners?.get(callback);

      if (wrappedListener) {
        ipcRenderer.removeListener(channel, wrappedListener);
        channelListeners?.delete(callback);

        if (channelListeners && channelListeners.size === 0) {
          listenerMap.delete(channel);
        }
      }
    },
    invoke: (channel: string, ...args: unknown[]) => ipcRenderer.invoke(channel, ...args),
  },
});
