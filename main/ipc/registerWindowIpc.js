"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerWindowIpc = void 0;
const electron_1 = require("electron");
const security_1 = require("./security");
const registerWindowIpc = (getMainWindow) => {
    electron_1.ipcMain.on("window:expand", (event, { width, height }) => {
        (0, security_1.assertTrustedSender)(event);
        const mainWindow = getMainWindow();
        if (mainWindow) {
            mainWindow.setSize(width, height, true);
        }
    });
    electron_1.ipcMain.on("window:restore", (event) => {
        (0, security_1.assertTrustedSender)(event);
        const mainWindow = getMainWindow();
        if (mainWindow) {
            mainWindow.setSize(1400, 960, true);
        }
    });
};
exports.registerWindowIpc = registerWindowIpc;
