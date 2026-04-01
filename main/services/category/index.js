"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadCategory = exports.uploadCategory = exports.searchEcCategories = exports.searchCpCategories = void 0;
const client_1 = require("../../db/client");
const exportToExcel_1 = require("../exportToExcel");
const validation_1 = require("../validation");
const searchCpCategories = async ({ q }) => {
    const safeQuery = (0, validation_1.sanitizeSearchQuery)(q);
    const result = await (0, client_1.withDatabase)("Category", async (conn) => {
        const rows = (await conn.query("SELECT displayCategoryCode, nameKo FROM cp_category_list WHERE nameKo LIKE ? LIMIT 100", [`%${safeQuery}%`]));
        return rows.map((row) => ({
            value: row.displayCategoryCode,
            label: `[${row.displayCategoryCode}] ${row.nameKo}`,
        }));
    });
    return { result };
};
exports.searchCpCategories = searchCpCategories;
const searchEcCategories = async ({ q }) => {
    const safeQuery = (0, validation_1.sanitizeSearchQuery)(q);
    const result = await (0, client_1.withDatabase)("Category", async (conn) => {
        let rows = (await conn.query("SELECT displayCategoryCode, name FROM amz_category_list WHERE name LIKE ? LIMIT 100", [`%${safeQuery}%`]));
        if (rows.length === 0 && /^\d+$/.test(safeQuery)) {
            rows = (await conn.query("SELECT displayCategoryCode, name FROM amz_category_list WHERE displayCategoryCode = ?", [Number(safeQuery)]));
        }
        return rows.map((row) => ({
            value: row.displayCategoryCode,
            label: row.name,
        }));
    });
    return { result };
};
exports.searchEcCategories = searchEcCategories;
const uploadCategory = async ({ displayCategoryCode, name, }) => {
    const safeDisplayCategoryCode = (0, validation_1.sanitizePositiveInteger)(displayCategoryCode, "displayCategoryCode");
    const safeName = (0, validation_1.sanitizeRequiredText)(name, "name");
    let result = true;
    let errorLog = "";
    try {
        await (0, client_1.withDatabase)("Category", async (conn) => {
            await conn.query("INSERT INTO amz_category_list (name, displayCategoryCode) VALUES (?, ?)", [
                safeName,
                safeDisplayCategoryCode,
            ]);
        });
    }
    catch (error) {
        result = false;
        errorLog = error instanceof Error ? error.message : String(error);
    }
    return { result, errorLog };
};
exports.uploadCategory = uploadCategory;
const downloadCategory = async ({ savePath, }) => {
    const safeSavePath = (0, validation_1.sanitizeRequiredText)(savePath, "savePath", 1024);
    let result = true;
    let errorLog = "";
    try {
        const rows = await (0, client_1.withDatabase)("Category", async (conn) => {
            return conn.query("SELECT name, displayCategoryCode FROM amz_category_list");
        });
        (0, exportToExcel_1.exportWorksheet)(safeSavePath, "cat", rows);
    }
    catch (error) {
        result = false;
        errorLog = error instanceof Error ? error.message : String(error);
    }
    return { result, errorLog };
};
exports.downloadCategory = downloadCategory;
