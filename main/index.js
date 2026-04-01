"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const electron_log_1 = __importDefault(require("electron-log"));
const electron_updater_1 = require("electron-updater");
const migrateLegacyConfig_1 = require("./config/migrateLegacyConfig");
const registerIpc_1 = require("./ipc/registerIpc");
const protocol_1 = require("./renderer/protocol");
let mainWindow = null;
let updateWindow = null;
const getMainWindow = () => {
    return mainWindow;
};
const createMainWindow = () => {
    const window = new electron_1.BrowserWindow({
        titleBarStyle: "hidden",
        trafficLightPosition: { x: 15, y: 12 },
        width: 1400,
        height: 1160,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: (0, path_1.join)(__dirname, "preload.js"),
        },
    });
    window.loadURL((0, protocol_1.getRendererPageUrl)("home"));
    return window;
};
const createUpdateWindow = () => {
    const window = new electron_1.BrowserWindow({
        width: 400,
        height: 250,
        frame: false,
        alwaysOnTop: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: (0, path_1.join)(__dirname, "preload.js"),
        },
    });
    window.loadURL((0, protocol_1.getRendererPageUrl)("update"));
    return window;
};
const startUpdateProcess = () => {
    if (mainWindow) {
        mainWindow.close();
    }
    updateWindow = createUpdateWindow();
    electron_updater_1.autoUpdater.downloadUpdate();
};
const checkForUpdates = () => {
    electron_log_1.default.info("🔄 업데이트 확인 중 (Mac 환경)");
    try {
        electron_updater_1.autoUpdater.setFeedURL({
            provider: "generic",
            url: "https://github.com/sjsylee/leeson_desktop/releases/latest/download/",
        });
        electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
    }
    catch (error) {
        electron_log_1.default.error("❌ autoUpdater 실행 실패:", error);
    }
};
const registerUpdaterEvents = () => {
    electron_updater_1.autoUpdater.on("update-available", (info) => {
        electron_log_1.default.info("✅ 업데이트 가능: ", info.version);
        electron_1.dialog
            .showMessageBox({
            type: "info",
            title: "업데이트 확인",
            message: "새로운 업데이트가 있습니다. 다운로드하시겠습니까?",
            buttons: ["업데이트", "나중에"],
        })
            .then((result) => {
            if (result.response === 0) {
                startUpdateProcess();
            }
        });
    });
    electron_updater_1.autoUpdater.on("download-progress", (progress) => {
        electron_log_1.default.info(`📥 다운로드 진행중: ${progress.percent.toFixed(2)}%`);
        if (updateWindow) {
            updateWindow.webContents.send("update-progress", progress.percent);
        }
    });
    electron_updater_1.autoUpdater.on("update-downloaded", () => {
        electron_log_1.default.info("✅ 업데이트 다운로드 완료! 앱을 재시작합니다.");
        if (updateWindow) {
            updateWindow.webContents.send("update-complete");
        }
        setTimeout(() => {
            electron_updater_1.autoUpdater.quitAndInstall();
        }, 3000);
    });
    electron_updater_1.autoUpdater.on("update-not-available", () => {
        electron_log_1.default.info("❌ 업데이트 없음. 최신 버전입니다.");
    });
    electron_updater_1.autoUpdater.on("error", (error) => {
        electron_log_1.default.error("❌ 업데이트 오류 발생:", error);
    });
};
electron_1.app.on("ready", async () => {
    (0, protocol_1.registerRendererProtocol)(electron_1.app.getAppPath());
    await (0, migrateLegacyConfig_1.migrateLegacyConfig)();
    (0, registerIpc_1.registerIpc)(getMainWindow);
    registerUpdaterEvents();
    mainWindow = createMainWindow();
    checkForUpdates();
});
electron_1.app.on("window-all-closed", () => {
    electron_1.app.quit();
});
