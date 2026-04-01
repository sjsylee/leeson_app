"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileStatus = void 0;
const profile_1 = require("./profile");
const secrets_1 = require("./secrets");
const getProfileStatus = async () => {
    const profile = (0, profile_1.loadProfile)();
    const credentialsStored = await (0, secrets_1.getCredentialStatus)();
    const missingFields = [];
    if (!profile.HOST) {
        missingFields.push("HOST");
    }
    if (profile.PORT === null) {
        missingFields.push("PORT");
    }
    if (!credentialsStored.dbUser) {
        missingFields.push("USER");
    }
    if (!credentialsStored.dbPassword) {
        missingFields.push("PASSWORD");
    }
    if (!credentialsStored.coupangAccessKey) {
        missingFields.push("COUPANG_ACCESS_KEY");
    }
    if (!credentialsStored.coupangSecretKey) {
        missingFields.push("COUPANG_SECRET_KEY");
    }
    return {
        isConfigured: missingFields.length === 0,
        missingFields,
        credentialsStored,
    };
};
exports.getProfileStatus = getProfileStatus;
