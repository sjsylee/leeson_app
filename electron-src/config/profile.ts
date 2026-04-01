import path from "path";
import { app } from "electron";
import * as fs from "fs";
import type { AppProfile } from "../types/settings";

const defaultProfile: AppProfile = {
  HOST: null,
  PORT: null,
};

const normalizePort = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const normalizeProfile = (value: unknown): AppProfile => {
  const record = (value ?? {}) as Partial<Record<keyof AppProfile | "USER" | "PASSWORD", unknown>>;
  const fallbackHost = typeof record.HOST === "string"
    ? record.HOST
    : typeof (value as Record<string, unknown>)?.HOST_IN === "string"
      ? ((value as Record<string, unknown>).HOST_IN as string)
      : typeof (value as Record<string, unknown>)?.HOST_OUT === "string"
        ? ((value as Record<string, unknown>).HOST_OUT as string)
        : null;

  return {
    HOST: typeof fallbackHost === "string" && fallbackHost.trim().length > 0 ? fallbackHost : null,
    PORT: normalizePort(record.PORT),
  };
};

export const getProfilePath = (): string => {
  const isDev = process.env.NODE_ENV === "development";

  return isDev
    ? path.join(app.getAppPath(), "config.json")
    : path.join(app.getPath("userData"), "config.json");
};

const ensureProfileFile = (filePath: string, profile: AppProfile): void => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(profile, null, 2));
  }
};

export const loadProfile = (): AppProfile => {
  const filePath = getProfilePath();

  ensureProfileFile(filePath, defaultProfile);

  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw);
  const profile = normalizeProfile(parsed);

  if (JSON.stringify(parsed) !== JSON.stringify(profile)) {
    fs.writeFileSync(filePath, JSON.stringify(profile, null, 2));
  }

  return profile;
};

export const saveProfile = (input: AppProfile): AppProfile => {
  const filePath = getProfilePath();
  const profile = normalizeProfile(input);

  fs.writeFileSync(filePath, JSON.stringify(profile, null, 2));

  return profile;
};

export const readLegacyConfig = (): Record<string, unknown> => {
  const filePath = getProfilePath();

  if (!fs.existsSync(filePath)) {
    return {};
  }

  const raw = fs.readFileSync(filePath, "utf-8");

  return JSON.parse(raw) as Record<string, unknown>;
};

export const persistNormalizedProfile = (value: unknown): AppProfile => {
  const profile = normalizeProfile(value);

  saveProfile(profile);

  return profile;
};

export { defaultProfile };
