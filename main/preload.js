"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const listenerMap = new Map();
electron_1.contextBridge.exposeInMainWorld("electron", {
    ipcRenderer: {
        send: (channel, data) => electron_1.ipcRenderer.send(channel, data),
        on: (channel, callback) => {
            const wrappedListener = (event, ...args) => {
                callback(event, ...args);
            };
            const channelListeners = listenerMap.get(channel) ?? new Map();
            channelListeners.set(callback, wrappedListener);
            listenerMap.set(channel, channelListeners);
            electron_1.ipcRenderer.on(channel, wrappedListener);
        },
        removeListener: (channel, callback) => {
            const channelListeners = listenerMap.get(channel);
            const wrappedListener = channelListeners?.get(callback);
            if (wrappedListener) {
                electron_1.ipcRenderer.removeListener(channel, wrappedListener);
                channelListeners?.delete(callback);
                if (channelListeners && channelListeners.size === 0) {
                    listenerMap.delete(channel);
                }
            }
        },
        invoke: (channel, ...args) => electron_1.ipcRenderer.invoke(channel, ...args),
    },
});
