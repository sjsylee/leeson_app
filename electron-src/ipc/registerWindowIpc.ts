import { BrowserWindow, ipcMain } from "electron";
import { assertTrustedSender } from "./security";

export const registerWindowIpc = (getMainWindow: () => BrowserWindow | null): void => {
  ipcMain.on("window:expand", (event, { width, height }: { width: number; height: number }) => {
    assertTrustedSender(event);

    const mainWindow = getMainWindow();

    if (mainWindow) {
      mainWindow.setSize(width, height, true);
    }
  });

  ipcMain.on("window:restore", (event) => {
    assertTrustedSender(event);

    const mainWindow = getMainWindow();

    if (mainWindow) {
      mainWindow.setSize(1400, 960, true);
    }
  });
};
