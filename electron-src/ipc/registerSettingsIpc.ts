import { ipcMain } from "electron";
import type { AppProfile, CoupangCredentialInput, DbCredentialInput, UnipassCredentialInput } from "../types/settings";
import {
  clearSettingsCoupangCredentials,
  clearSettingsDbCredentials,
  clearSettingsUnipassKey,
  getSettingsProfile,
  getSettingsStatus,
  saveSettingsCoupangCredentials,
  saveSettingsDbCredentials,
  saveSettingsProfile,
  saveSettingsUnipassKey,
} from "../services/settings";
import { assertTrustedSender } from "./security";

export const registerSettingsIpc = (): void => {
  ipcMain.handle("settings:getProfile", (event) => {
    assertTrustedSender(event);

    return getSettingsProfile();
  });

  ipcMain.handle("settings:getStatus", async (event) => {
    assertTrustedSender(event);

    return getSettingsStatus();
  });

  ipcMain.handle("settings:saveProfile", (event, profile: AppProfile) => {
    assertTrustedSender(event);

    return saveSettingsProfile(profile);
  });

  ipcMain.handle("settings:saveDbCredentials", async (event, credentials: DbCredentialInput) => {
    assertTrustedSender(event);

    return saveSettingsDbCredentials(credentials);
  });

  ipcMain.handle("settings:clearDbCredentials", async (event) => {
    assertTrustedSender(event);

    return clearSettingsDbCredentials();
  });

  ipcMain.handle(
    "settings:saveCoupangCredentials",
    async (event, credentials: CoupangCredentialInput) => {
      assertTrustedSender(event);

      return saveSettingsCoupangCredentials(credentials);
    }
  );

  ipcMain.handle("settings:clearCoupangCredentials", async (event) => {
    assertTrustedSender(event);

    return clearSettingsCoupangCredentials();
  });

  ipcMain.handle("settings:saveUnipassKey", async (event, credentials: UnipassCredentialInput) => {
    assertTrustedSender(event);

    return saveSettingsUnipassKey(credentials);
  });

  ipcMain.handle("settings:clearUnipassKey", async (event) => {
    assertTrustedSender(event);

    return clearSettingsUnipassKey();
  });
};
