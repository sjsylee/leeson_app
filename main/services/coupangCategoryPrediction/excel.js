"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadCoupangCategoryBatchWorkbook = exports.importCoupangCategoryWorkbook = exports.downloadCoupangCategoryTemplateWorkbook = void 0;
const xlsx_js_style_1 = __importDefault(require("xlsx-js-style"));
const validation_1 = require("../validation");
const TEMPLATE_HEADERS = ["sourceCategory", "productDescription", "brand"];
const normalizeText = (value) => {
    return String(value ?? "").trim();
};
const autoFitColumns = (worksheet) => {
    const range = worksheet["!ref"] ? xlsx_js_style_1.default.utils.decode_range(worksheet["!ref"]) : null;
    if (!range) {
        return;
    }
    const widths = [];
    for (let column = range.s.c; column <= range.e.c; column += 1) {
        let maxLength = 10;
        for (let row = range.s.r; row <= range.e.r; row += 1) {
            const cell = worksheet[xlsx_js_style_1.default.utils.encode_cell({ c: column, r: row })];
            const length = String(cell?.v ?? "").length + 2;
            if (length > maxLength) {
                maxLength = length;
            }
        }
        widths.push({ wch: Math.min(maxLength, 48) });
    }
    worksheet["!cols"] = widths;
};
const buildStyledWorksheet = (headers, rows) => {
    const worksheet = xlsx_js_style_1.default.utils.json_to_sheet([]);
    xlsx_js_style_1.default.utils.sheet_add_aoa(worksheet, [headers]);
    xlsx_js_style_1.default.utils.sheet_add_json(worksheet, rows, { origin: "A2", skipHeader: true });
    headers.forEach((_, index) => {
        const cell = worksheet[`${xlsx_js_style_1.default.utils.encode_col(index)}1`];
        if (cell) {
            cell.s = {
                font: { sz: "13", color: { rgb: "FFFFFF" }, bold: true },
                fill: { fgColor: { rgb: "141E46" } },
                alignment: { horizontal: "center" },
                border: {
                    right: { style: "thin", color: "000000" },
                    left: { style: "thin", color: "000000" },
                    top: { style: "thin", color: "000000" },
                    bottom: { style: "thin", color: "000000" },
                },
            };
        }
    });
    autoFitColumns(worksheet);
    return worksheet;
};
const downloadCoupangCategoryTemplateWorkbook = ({ savePath }) => {
    const safeSavePath = (0, validation_1.sanitizeRequiredText)(savePath, "savePath", 1024);
    try {
        const workbook = xlsx_js_style_1.default.utils.book_new();
        const worksheet = buildStyledWorksheet(TEMPLATE_HEADERS, [
            {
                sourceCategory: "예: 여성 샌들",
                productDescription: "예: EVA 밑창, 미끄럼 방지",
                brand: "예: CROCS",
            },
        ]);
        xlsx_js_style_1.default.utils.book_append_sheet(workbook, worksheet, "Template");
        xlsx_js_style_1.default.writeFile(workbook, safeSavePath);
        return { result: true, errorLog: "" };
    }
    catch (error) {
        return {
            result: false,
            errorLog: error instanceof Error ? error.message : String(error),
        };
    }
};
exports.downloadCoupangCategoryTemplateWorkbook = downloadCoupangCategoryTemplateWorkbook;
const importCoupangCategoryWorkbook = ({ filePath, }) => {
    const safeFilePath = (0, validation_1.sanitizeRequiredText)(filePath, "filePath", 1024);
    const workbook = xlsx_js_style_1.default.readFile(safeFilePath);
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
        throw new Error("엑셀 파일에서 시트를 찾지 못했습니다.");
    }
    const worksheet = workbook.Sheets[firstSheetName];
    const rows = xlsx_js_style_1.default.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
    const headerRow = rows[0]?.map((cell) => normalizeText(cell)) ?? [];
    if (!TEMPLATE_HEADERS.every((header, index) => headerRow[index] === header)) {
        throw new Error("엑셀 양식이 올바르지 않습니다. sourceCategory, productDescription, brand 헤더를 확인해주세요.");
    }
    let skippedRows = 0;
    const parsedRows = rows
        .slice(1)
        .map((row, index) => {
        const sourceCategory = normalizeText(row[0]);
        const productDescription = normalizeText(row[1]);
        const brand = normalizeText(row[2]);
        if (!sourceCategory && !productDescription && !brand) {
            skippedRows += 1;
            return null;
        }
        return {
            rowNumber: index + 2,
            sourceCategory,
            productDescription,
            brand,
        };
    })
        .filter((row) => row !== null);
    return {
        rows: parsedRows,
        totalRows: Math.max(rows.length - 1, 0),
        parsedRows: parsedRows.length,
        skippedRows,
    };
};
exports.importCoupangCategoryWorkbook = importCoupangCategoryWorkbook;
const downloadCoupangCategoryBatchWorkbook = ({ savePath, rows, }) => {
    const safeSavePath = (0, validation_1.sanitizeRequiredText)(savePath, "savePath", 1024);
    try {
        const workbook = xlsx_js_style_1.default.utils.book_new();
        const worksheet = buildStyledWorksheet([
            "rowNumber",
            "sourceCategory",
            "productDescription",
            "brand",
            "status",
            "summary",
            "topCategoryCode",
            "topCategoryName",
            "rawCode",
            "rawMessage",
        ], rows.map((row) => ({
            rowNumber: row.rowNumber,
            sourceCategory: row.sourceCategory,
            productDescription: row.productDescription,
            brand: row.brand,
            status: row.status,
            summary: row.summary,
            topCategoryCode: row.topCategoryCode,
            topCategoryName: row.topCategoryName,
            rawCode: row.rawCode,
            rawMessage: row.rawMessage,
        })));
        xlsx_js_style_1.default.utils.book_append_sheet(workbook, worksheet, "Results");
        xlsx_js_style_1.default.writeFile(workbook, safeSavePath);
        return { result: true, errorLog: "" };
    }
    catch (error) {
        return {
            result: false,
            errorLog: error instanceof Error ? error.message : String(error),
        };
    }
};
exports.downloadCoupangCategoryBatchWorkbook = downloadCoupangCategoryBatchWorkbook;
