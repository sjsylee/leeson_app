"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultProfile = exports.persistNormalizedProfile = exports.readLegacyConfig = exports.saveProfile = exports.loadProfile = exports.getProfilePath = void 0;
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const fs = __importStar(require("fs"));
const defaultProfile = {
    HOST: null,
    PORT: null,
};
exports.defaultProfile = defaultProfile;
const normalizePort = (value) => {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === "string" && value.trim().length > 0) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
};
const normalizeProfile = (value) => {
    const record = (value ?? {});
    const fallbackHost = typeof record.HOST === "string"
        ? record.HOST
        : typeof value?.HOST_IN === "string"
            ? value.HOST_IN
            : typeof value?.HOST_OUT === "string"
                ? value.HOST_OUT
                : null;
    return {
        HOST: typeof fallbackHost === "string" && fallbackHost.trim().length > 0 ? fallbackHost : null,
        PORT: normalizePort(record.PORT),
    };
};
const getProfilePath = () => {
    const isDev = process.env.NODE_ENV === "development";
    return isDev
        ? path_1.default.join(electron_1.app.getAppPath(), "config.json")
        : path_1.default.join(electron_1.app.getPath("userData"), "config.json");
};
exports.getProfilePath = getProfilePath;
const ensureProfileFile = (filePath, profile) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(profile, null, 2));
    }
};
const loadProfile = () => {
    const filePath = (0, exports.getProfilePath)();
    ensureProfileFile(filePath, defaultProfile);
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    const profile = normalizeProfile(parsed);
    if (JSON.stringify(parsed) !== JSON.stringify(profile)) {
        fs.writeFileSync(filePath, JSON.stringify(profile, null, 2));
    }
    return profile;
};
exports.loadProfile = loadProfile;
const saveProfile = (input) => {
    const filePath = (0, exports.getProfilePath)();
    const profile = normalizeProfile(input);
    fs.writeFileSync(filePath, JSON.stringify(profile, null, 2));
    return profile;
};
exports.saveProfile = saveProfile;
const readLegacyConfig = () => {
    const filePath = (0, exports.getProfilePath)();
    if (!fs.existsSync(filePath)) {
        return {};
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
};
exports.readLegacyConfig = readLegacyConfig;
const persistNormalizedProfile = (value) => {
    const profile = normalizeProfile(value);
    (0, exports.saveProfile)(profile);
    return profile;
};
exports.persistNormalizedProfile = persistNormalizedProfile;
