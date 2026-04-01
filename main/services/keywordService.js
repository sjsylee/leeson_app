"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadKeyword = exports.uploadKeyword = exports.searchKeywords = void 0;
const client_1 = require("../db/client");
const exportToExcel_1 = require("./exportToExcel");
const validation_1 = require("./validation");
const searchKeywords = async ({ q }) => {
    const safeQuery = (0, validation_1.sanitizeSearchQuery)(q);
    const result = await (0, client_1.withDatabase)("Keyword", async (conn) => {
        const rows = (await conn.query("SELECT kwd, related_kwd FROM cp_kwd WHERE kwd LIKE ? LIMIT 100", [`%${safeQuery}%`]));
        return rows.map((row) => ({
            value: row.related_kwd,
            label: `🌎 ${row.kwd} 🌎 : ${row.related_kwd}`,
        }));
    });
    return { result };
};
exports.searchKeywords = searchKeywords;
const uploadKeyword = async ({ kwd, related_kwd, }) => {
    const safeKeyword = (0, validation_1.sanitizeRequiredText)(kwd, "kwd", 255);
    const safeRelatedKeyword = (0, validation_1.sanitizeRequiredText)(related_kwd, "related_kwd", 1000);
    let result = true;
    let errorLog = "";
    try {
        await (0, client_1.withDatabase)("Keyword", async (conn) => {
            await conn.query("INSERT INTO cp_kwd (kwd, related_kwd) VALUES (?, ?)", [
                safeKeyword,
                safeRelatedKeyword,
            ]);
        });
    }
    catch (error) {
        errorLog = error instanceof Error ? error.message : String(error);
        result = false;
    }
    if (errorLog.includes("PRIMARY")) {
        try {
            await (0, client_1.withDatabase)("Keyword", async (conn) => {
                await conn.query("UPDATE cp_kwd SET related_kwd = ? WHERE kwd = ?", [safeRelatedKeyword, safeKeyword]);
            });
            errorLog = "update";
            result = true;
        }
        catch (error) {
            errorLog = error instanceof Error ? error.message : String(error);
            result = false;
        }
    }
    return { result, errorLog };
};
exports.uploadKeyword = uploadKeyword;
const downloadKeyword = async ({ savePath, }) => {
    const safeSavePath = (0, validation_1.sanitizeRequiredText)(savePath, "savePath", 1024);
    let result = true;
    let errorLog = "";
    try {
        const rows = await (0, client_1.withDatabase)("Keyword", async (conn) => {
            return conn.query("SELECT kwd, related_kwd FROM cp_kwd");
        });
        (0, exportToExcel_1.exportWorksheet)(safeSavePath, "kwd", rows);
    }
    catch (error) {
        result = false;
        errorLog = error instanceof Error ? error.message : String(error);
    }
    return { result, errorLog };
};
exports.downloadKeyword = downloadKeyword;
