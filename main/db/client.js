"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withDatabase = void 0;
const mariadb_1 = __importDefault(require("mariadb"));
const profile_1 = require("../config/profile");
const secrets_1 = require("../config/secrets");
const getHost = () => {
    const profile = (0, profile_1.loadProfile)();
    if (!profile.HOST) {
        throw new Error("HOST is not configured.");
    }
    return profile.HOST;
};
const getPort = () => {
    const profile = (0, profile_1.loadProfile)();
    if (profile.PORT === null) {
        throw new Error("PORT is not configured.");
    }
    return profile.PORT;
};
const withDatabase = async (database, run) => {
    const credentials = await (0, secrets_1.getStoredCredentials)();
    if (!credentials.user || !credentials.password) {
        throw new Error("Database credentials are not configured.");
    }
    const pool = mariadb_1.default.createPool({
        host: getHost(),
        port: getPort(),
        user: credentials.user,
        password: credentials.password,
        database,
        connectionLimit: 5,
    });
    let conn;
    try {
        conn = await pool.getConnection();
        return await run(conn);
    }
    finally {
        if (conn) {
            conn.end();
        }
        await pool.end();
    }
};
exports.withDatabase = withDatabase;
