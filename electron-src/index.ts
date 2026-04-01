import { BrowserWindow, app, dialog } from "electron";
import { join } from "path";
import log from "electron-log";
import { autoUpdater } from "electron-updater";
import { migrateLegacyConfig } from "./config/migrateLegacyConfig";
import { registerIpc } from "./ipc/registerIpc";
import {
  getRendererPageUrl,
  registerRendererProtocol,
} from "./renderer/protocol";

let mainWindow: BrowserWindow | null = null;
let updateWindow: BrowserWindow | null = null;

const getMainWindow = (): BrowserWindow | null => {
  return mainWindow;
};

const createMainWindow = (): BrowserWindow => {
  const window = new BrowserWindow({
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 15, y: 12 },
    width: 1400,
    height: 1160,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, "preload.js"),
    },
  });

  window.loadURL(getRendererPageUrl("home"));

  return window;
};

const createUpdateWindow = (): BrowserWindow => {
  const window = new BrowserWindow({
    width: 400,
    height: 250,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, "preload.js"),
    },
  });

  window.loadURL(getRendererPageUrl("update"));

  return window;
};

const startUpdateProcess = (): void => {
  if (mainWindow) {
    mainWindow.close();
  }

  updateWindow = createUpdateWindow();
  autoUpdater.downloadUpdate();
};

const checkForUpdates = (): void => {
  log.info("🔄 업데이트 확인 중 (Mac 환경)");

  try {
    autoUpdater.setFeedURL({
      provider: "generic",
      url: "https://github.com/sjsylee/leeson_desktop/releases/latest/download/",
    });

    autoUpdater.checkForUpdatesAndNotify();
  } catch (error) {
    log.error("❌ autoUpdater 실행 실패:", error);
  }
};

const registerUpdaterEvents = (): void => {
  autoUpdater.on("update-available", (info) => {
    log.info("✅ 업데이트 가능: ", info.version);
    dialog
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

  autoUpdater.on("download-progress", (progress) => {
    log.info(`📥 다운로드 진행중: ${progress.percent.toFixed(2)}%`);

    if (updateWindow) {
      updateWindow.webContents.send("update-progress", progress.percent);
    }
  });

  autoUpdater.on("update-downloaded", () => {
    log.info("✅ 업데이트 다운로드 완료! 앱을 재시작합니다.");

    if (updateWindow) {
      updateWindow.webContents.send("update-complete");
    }

    setTimeout(() => {
      autoUpdater.quitAndInstall();
    }, 3000);
  });

  autoUpdater.on("update-not-available", () => {
    log.info("❌ 업데이트 없음. 최신 버전입니다.");
  });

  autoUpdater.on("error", (error) => {
    log.error("❌ 업데이트 오류 발생:", error);
  });
};

app.on("ready", async () => {
  registerRendererProtocol(app.getAppPath());
  await migrateLegacyConfig();
  registerIpc(getMainWindow);
  registerUpdaterEvents();

  mainWindow = createMainWindow();
  checkForUpdates();
});

app.on("window-all-closed", () => {
  app.quit();
});
