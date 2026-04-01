"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSettingsIpc = void 0;
const electron_1 = require("electron");
const settings_1 = require("../services/settings");
const security_1 = require("./security");
const registerSettingsIpc = () => {
    electron_1.ipcMain.handle("settings:getProfile", (event) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, settings_1.getSettingsProfile)();
    });
    electron_1.ipcMain.handle("settings:getStatus", async (event) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, settings_1.getSettingsStatus)();
    });
    electron_1.ipcMain.handle("settings:saveProfile", (event, profile) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, settings_1.saveSettingsProfile)(profile);
    });
    electron_1.ipcMain.handle("settings:saveDbCredentials", async (event, credentials) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, settings_1.saveSettingsDbCredentials)(credentials);
    });
    electron_1.ipcMain.handle("settings:clearDbCredentials", async (event) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, settings_1.clearSettingsDbCredentials)();
    });
    electron_1.ipcMain.handle("settings:saveCoupangCredentials", async (event, credentials) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, settings_1.saveSettingsCoupangCredentials)(credentials);
    });
    electron_1.ipcMain.handle("settings:clearCoupangCredentials", async (event) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, settings_1.clearSettingsCoupangCredentials)();
    });
    electron_1.ipcMain.handle("settings:saveUnipassKey", async (event, credentials) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, settings_1.saveSettingsUnipassKey)(credentials);
    });
    electron_1.ipcMain.handle("settings:clearUnipassKey", async (event) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, settings_1.clearSettingsUnipassKey)();
    });
};
exports.registerSettingsIpc = registerSettingsIpc;
