"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearUnipassKey = exports.saveUnipassKey = exports.clearCoupangCredentials = exports.saveCoupangCredentials = exports.clearDbCredentials = exports.saveDbCredentials = exports.getCredentialStatus = exports.getStoredCredentials = void 0;
const keytar_1 = __importDefault(require("keytar"));
const serviceName = "com.leeson.app.db";
const userAccount = "db-user";
const passwordAccount = "db-password";
const coupangAccessKeyAccount = "coupang-access-key";
const coupangSecretKeyAccount = "coupang-secret-key";
const unipassKeyAccount = "unipass-key";
const getStoredCredentials = async () => {
    const [user, password, coupangAccessKey, coupangSecretKey, unipassKey] = await Promise.all([
        keytar_1.default.getPassword(serviceName, userAccount),
        keytar_1.default.getPassword(serviceName, passwordAccount),
        keytar_1.default.getPassword(serviceName, coupangAccessKeyAccount),
        keytar_1.default.getPassword(serviceName, coupangSecretKeyAccount),
        keytar_1.default.getPassword(serviceName, unipassKeyAccount),
    ]);
    return { user, password, coupangAccessKey, coupangSecretKey, unipassKey };
};
exports.getStoredCredentials = getStoredCredentials;
const getCredentialStatus = async () => {
    const credentials = await (0, exports.getStoredCredentials)();
    return {
        dbUser: Boolean(credentials.user),
        dbPassword: Boolean(credentials.password),
        coupangAccessKey: Boolean(credentials.coupangAccessKey),
        coupangSecretKey: Boolean(credentials.coupangSecretKey),
        unipassKey: Boolean(credentials.unipassKey),
    };
};
exports.getCredentialStatus = getCredentialStatus;
const saveDbCredentials = async ({ user, password }) => {
    await Promise.all([
        keytar_1.default.setPassword(serviceName, userAccount, user),
        keytar_1.default.setPassword(serviceName, passwordAccount, password),
    ]);
};
exports.saveDbCredentials = saveDbCredentials;
const clearDbCredentials = async () => {
    await Promise.all([
        keytar_1.default.deletePassword(serviceName, userAccount),
        keytar_1.default.deletePassword(serviceName, passwordAccount),
    ]);
};
exports.clearDbCredentials = clearDbCredentials;
const saveCoupangCredentials = async ({ accessKey, secretKey, }) => {
    await Promise.all([
        keytar_1.default.setPassword(serviceName, coupangAccessKeyAccount, accessKey),
        keytar_1.default.setPassword(serviceName, coupangSecretKeyAccount, secretKey),
    ]);
};
exports.saveCoupangCredentials = saveCoupangCredentials;
const clearCoupangCredentials = async () => {
    await Promise.all([
        keytar_1.default.deletePassword(serviceName, coupangAccessKeyAccount),
        keytar_1.default.deletePassword(serviceName, coupangSecretKeyAccount),
    ]);
};
exports.clearCoupangCredentials = clearCoupangCredentials;
const saveUnipassKey = async ({ unipassKey }) => {
    await keytar_1.default.setPassword(serviceName, unipassKeyAccount, unipassKey);
};
exports.saveUnipassKey = saveUnipassKey;
const clearUnipassKey = async () => {
    await keytar_1.default.deletePassword(serviceName, unipassKeyAccount);
};
exports.clearUnipassKey = clearUnipassKey;
