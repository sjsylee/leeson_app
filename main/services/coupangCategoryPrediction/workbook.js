"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCoupangCategoryWorkbook = void 0;
const xlsx_js_style_1 = __importDefault(require("xlsx-js-style"));
const normalizeText = (value) => {
    if (value === null || typeof value === "undefined") {
        return "";
    }
    return String(value).trim();
};
const findHeaderIndex = (headers, target) => {
    return headers.findIndex((header) => header.toLowerCase() === target.toLowerCase());
};
const parseCoupangCategoryWorkbook = (filePath) => {
    const workbook = xlsx_js_style_1.default.readFile(filePath);
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
        throw new Error("엑셀 파일에서 시트를 찾지 못했습니다.");
    }
    const worksheet = workbook.Sheets[firstSheetName];
    const rows = xlsx_js_style_1.default.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
    });
    if (rows.length === 0) {
        return {
            rows: [],
            totalRows: 0,
            parsedRows: 0,
            skippedRows: 0,
        };
    }
    const headerRow = rows[0] ?? [];
    const headers = headerRow.map((cell) => normalizeText(cell));
    const sourceCategoryIndex = findHeaderIndex(headers, "sourceCategory");
    const productDescriptionIndex = findHeaderIndex(headers, "productDescription");
    const brandIndex = findHeaderIndex(headers, "brand");
    if (sourceCategoryIndex < 0) {
        throw new Error("엑셀 헤더에 sourceCategory 컬럼이 필요합니다.");
    }
    const parsedRows = [];
    let skippedRows = 0;
    for (let index = 1; index < rows.length; index += 1) {
        const row = rows[index] ?? [];
        const sourceCategory = normalizeText(row[sourceCategoryIndex]);
        const productDescription = productDescriptionIndex >= 0 ? normalizeText(row[productDescriptionIndex]) : "";
        const brand = brandIndex >= 0 ? normalizeText(row[brandIndex]) : "";
        if (!sourceCategory && !productDescription && !brand) {
            skippedRows += 1;
            continue;
        }
        parsedRows.push({
            rowNumber: index + 1,
            sourceCategory,
            productDescription,
            brand,
        });
    }
    return {
        rows: parsedRows,
        totalRows: rows.length - 1,
        parsedRows: parsedRows.length,
        skippedRows,
    };
};
exports.parseCoupangCategoryWorkbook = parseCoupangCategoryWorkbook;
