"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearSettingsUnipassKey = exports.saveSettingsUnipassKey = exports.clearSettingsCoupangCredentials = exports.saveSettingsCoupangCredentials = exports.clearSettingsDbCredentials = exports.saveSettingsDbCredentials = exports.saveSettingsProfile = exports.getSettingsStatus = exports.getSettingsProfile = void 0;
const profile_1 = require("../../config/profile");
const secrets_1 = require("../../config/secrets");
const status_1 = require("../../config/status");
const getSettingsProfile = () => {
    return (0, profile_1.loadProfile)();
};
exports.getSettingsProfile = getSettingsProfile;
const getSettingsStatus = async () => {
    return (0, status_1.getProfileStatus)();
};
exports.getSettingsStatus = getSettingsStatus;
const saveSettingsProfile = (profile) => {
    return (0, profile_1.saveProfile)(profile);
};
exports.saveSettingsProfile = saveSettingsProfile;
const saveSettingsDbCredentials = async (credentials) => {
    await (0, secrets_1.saveDbCredentials)(credentials);
    return (0, status_1.getProfileStatus)();
};
exports.saveSettingsDbCredentials = saveSettingsDbCredentials;
const clearSettingsDbCredentials = async () => {
    await (0, secrets_1.clearDbCredentials)();
    return (0, status_1.getProfileStatus)();
};
exports.clearSettingsDbCredentials = clearSettingsDbCredentials;
const saveSettingsCoupangCredentials = async (credentials) => {
    await (0, secrets_1.saveCoupangCredentials)(credentials);
    return (0, status_1.getProfileStatus)();
};
exports.saveSettingsCoupangCredentials = saveSettingsCoupangCredentials;
const clearSettingsCoupangCredentials = async () => {
    await (0, secrets_1.clearCoupangCredentials)();
    return (0, status_1.getProfileStatus)();
};
exports.clearSettingsCoupangCredentials = clearSettingsCoupangCredentials;
const saveSettingsUnipassKey = async (credentials) => {
    await (0, secrets_1.saveUnipassKey)(credentials);
    return (0, status_1.getProfileStatus)();
};
exports.saveSettingsUnipassKey = saveSettingsUnipassKey;
const clearSettingsUnipassKey = async () => {
    await (0, secrets_1.clearUnipassKey)();
    return (0, status_1.getProfileStatus)();
};
exports.clearSettingsUnipassKey = clearSettingsUnipassKey;
