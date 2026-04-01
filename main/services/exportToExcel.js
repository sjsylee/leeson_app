"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportWorksheet = void 0;
const xlsx_js_style_1 = __importDefault(require("xlsx-js-style"));
function autoFitColumns(worksheet) {
    const reference = worksheet["!ref"];
    if (!reference) {
        return;
    }
    const [firstCol, lastCol] = reference.replace(/\d/, "").split(":");
    const numRegexp = new RegExp(/\d+$/g);
    const firstColIndex = firstCol.charCodeAt(0);
    const lastColIndex = lastCol.charCodeAt(0);
    const rows = Number(numRegexp.exec(lastCol)?.[0] ?? 0);
    const objectMaxLength = [];
    for (let colIndex = firstColIndex; colIndex <= lastColIndex; colIndex += 1) {
        const col = String.fromCharCode(colIndex);
        let maxCellLength = 0;
        for (let row = 1; row <= rows; row += 1) {
            try {
                const cellLength = String(worksheet[`${col}${row}`].v).length + 1;
                if (cellLength > maxCellLength) {
                    maxCellLength = cellLength;
                }
            }
            catch {
                continue;
            }
        }
        objectMaxLength.push({ width: maxCellLength });
    }
    worksheet["!cols"] = objectMaxLength;
}
function exportWorksheet(fileName, target, json) {
    const workbook = xlsx_js_style_1.default.utils.book_new();
    const worksheet = xlsx_js_style_1.default.utils.json_to_sheet([]);
    const categoryHeader = [
        [
            {
                v: "name",
                t: "s",
                s: {
                    font: { sz: "13", color: { rgb: "FFFFFF" }, bold: true },
                    fill: { fgColor: { rgb: "141E46" }, bold: true },
                    alignment: { horizontal: "center" },
                    border: {
                        right: { style: "thin", color: "000000" },
                        left: { style: "thin", color: "000000" },
                        top: { style: "thin", color: "000000" },
                        bottom: { style: "thin", color: "000000" },
                    },
                },
            },
            {
                v: "displayCategoryCode",
                t: "s",
                s: {
                    font: { sz: "13", color: { rgb: "FFFFFF" }, bold: true },
                    fill: { fgColor: { rgb: "141E46" }, bold: true },
                    alignment: { horizontal: "center" },
                    border: {
                        right: { style: "thin", color: "000000" },
                        left: { style: "thin", color: "000000" },
                        top: { style: "thin", color: "000000" },
                        bottom: { style: "thin", color: "000000" },
                    },
                },
            },
        ],
    ];
    const keywordHeader = [
        [
            {
                v: "kwd",
                t: "s",
                s: {
                    font: { sz: "13", color: { rgb: "FFFFFF" }, bold: true },
                    fill: { fgColor: { rgb: "141E46" }, bold: true },
                    alignment: { horizontal: "center" },
                    border: {
                        right: { style: "thin", color: "000000" },
                        left: { style: "thin", color: "000000" },
                        top: { style: "thin", color: "000000" },
                        bottom: { style: "thin", color: "000000" },
                    },
                },
            },
            {
                v: "related_kwd",
                t: "s",
                s: {
                    font: { sz: "13", color: { rgb: "FFFFFF" }, bold: true },
                    fill: { fgColor: { rgb: "141E46" }, bold: true },
                    alignment: { horizontal: "center" },
                    border: {
                        right: { style: "thin", color: "000000" },
                        left: { style: "thin", color: "000000" },
                        top: { style: "thin", color: "000000" },
                        bottom: { style: "thin", color: "000000" },
                    },
                },
            },
        ],
    ];
    const header = target === "cat" ? categoryHeader : keywordHeader;
    xlsx_js_style_1.default.utils.sheet_add_aoa(worksheet, header);
    xlsx_js_style_1.default.utils.sheet_add_json(worksheet, json, {
        origin: "A2",
        skipHeader: true,
    });
    xlsx_js_style_1.default.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    autoFitColumns(worksheet);
    xlsx_js_style_1.default.writeFile(workbook, fileName);
}
exports.exportWorksheet = exportWorksheet;
