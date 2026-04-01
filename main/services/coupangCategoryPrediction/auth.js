"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCoupangAuthorizationHeader = void 0;
const crypto_1 = require("crypto");
const pad = (value) => {
    return String(value).padStart(2, "0");
};
const toSignedDate = (date) => {
    const year = pad(date.getUTCFullYear() % 100);
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
};
const createCoupangAuthorizationHeader = ({ accessKey, secretKey, method, path, query, }) => {
    const signedDate = toSignedDate(new Date());
    const message = `${signedDate}${method.toUpperCase()}${path}${query}`;
    const signature = (0, crypto_1.createHmac)("sha256", secretKey).update(message, "utf8").digest("hex");
    return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${signedDate}, signature=${signature}`;
};
exports.createCoupangAuthorizationHeader = createCoupangAuthorizationHeader;
