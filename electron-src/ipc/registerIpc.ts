import type { BrowserWindow } from "electron";
import { registerDataIpc } from "./registerDataIpc";
import { registerSettingsIpc } from "./registerSettingsIpc";
import { registerWindowIpc } from "./registerWindowIpc";

export const registerIpc = (getMainWindow: () => BrowserWindow | null): void => {
  registerSettingsIpc();
  registerDataIpc();
  registerWindowIpc(getMainWindow);
};
