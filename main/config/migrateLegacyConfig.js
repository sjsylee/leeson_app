"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateLegacyConfig = void 0;
const profile_1 = require("./profile");
const secrets_1 = require("./secrets");
const migrateLegacyConfig = async () => {
    const legacyConfig = (0, profile_1.readLegacyConfig)();
    const credentialStatus = await (0, secrets_1.getCredentialStatus)();
    const legacyUser = typeof legacyConfig.USER === "string" ? legacyConfig.USER : null;
    const legacyPassword = typeof legacyConfig.PASSWORD === "string" ? legacyConfig.PASSWORD : null;
    const legacyAccessKey = typeof legacyConfig.ACCESS_KEY === "string" ? legacyConfig.ACCESS_KEY : null;
    const legacySecretKey = typeof legacyConfig.SECRET_KEY === "string" ? legacyConfig.SECRET_KEY : null;
    if (!credentialStatus.dbUser && !credentialStatus.dbPassword && legacyUser && legacyPassword) {
        await (0, secrets_1.saveDbCredentials)({
            user: legacyUser,
            password: legacyPassword,
        });
    }
    if (!credentialStatus.coupangAccessKey &&
        !credentialStatus.coupangSecretKey &&
        legacyAccessKey &&
        legacySecretKey) {
        await (0, secrets_1.saveCoupangCredentials)({
            accessKey: legacyAccessKey,
            secretKey: legacySecretKey,
        });
    }
    (0, profile_1.persistNormalizedProfile)(legacyConfig);
};
exports.migrateLegacyConfig = migrateLegacyConfig;
