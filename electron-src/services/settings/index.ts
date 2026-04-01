import { loadProfile, saveProfile } from "../../config/profile";
import {
  clearCoupangCredentials,
  clearDbCredentials,
  clearUnipassKey,
  saveCoupangCredentials,
  saveDbCredentials,
  saveUnipassKey,
} from "../../config/secrets";
import { getProfileStatus } from "../../config/status";
import type {
  AppProfile,
  AppProfileStatus,
  CoupangCredentialInput,
  DbCredentialInput,
  UnipassCredentialInput,
} from "../../types/settings";

export const getSettingsProfile = (): AppProfile => {
  return loadProfile();
};

export const getSettingsStatus = async (): Promise<AppProfileStatus> => {
  return getProfileStatus();
};

export const saveSettingsProfile = (profile: AppProfile): AppProfile => {
  return saveProfile(profile);
};

export const saveSettingsDbCredentials = async (
  credentials: DbCredentialInput
): Promise<AppProfileStatus> => {
  await saveDbCredentials(credentials);

  return getProfileStatus();
};

export const clearSettingsDbCredentials = async (): Promise<AppProfileStatus> => {
  await clearDbCredentials();

  return getProfileStatus();
};

export const saveSettingsCoupangCredentials = async (
  credentials: CoupangCredentialInput
): Promise<AppProfileStatus> => {
  await saveCoupangCredentials(credentials);

  return getProfileStatus();
};

export const clearSettingsCoupangCredentials = async (): Promise<AppProfileStatus> => {
  await clearCoupangCredentials();

  return getProfileStatus();
};

export const saveSettingsUnipassKey = async (
  credentials: UnipassCredentialInput
): Promise<AppProfileStatus> => {
  await saveUnipassKey(credentials);

  return getProfileStatus();
};

export const clearSettingsUnipassKey = async (): Promise<AppProfileStatus> => {
  await clearUnipassKey();

  return getProfileStatus();
};
