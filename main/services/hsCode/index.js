"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchHsCodes = void 0;
const client_1 = require("../../db/client");
const validation_1 = require("../validation");
const searchHsCodes = async ({ q }) => {
    const safeQuery = (0, validation_1.sanitizeSearchQuery)(q);
    const result = await (0, client_1.withDatabase)("Category", async (conn) => {
        const rows = (await conn.query(`SELECT cat_code, tax_cat, hs_code, gov_cat, big_cat, name_high, name_mid, name_low, name_detail,
              code_high, code_mid, code_low, code_detail, cp_cat_ref
         FROM hs_code
        WHERE cp_cat_ref LIKE ?
        LIMIT 100`, [`%${safeQuery}%`]));
        return rows.map((row) => ({
            key: row.cat_code,
            value: row.cat_code,
            label: row.cp_cat_ref.replace(/\n/g, ""),
            ...row,
        }));
    });
    return { result };
};
exports.searchHsCodes = searchHsCodes;
