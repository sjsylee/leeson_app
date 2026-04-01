"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCoupangCategoryTemplate = void 0;
const xlsx_js_style_1 = __importDefault(require("xlsx-js-style"));
const createCoupangCategoryTemplate = (savePath) => {
    const workbook = xlsx_js_style_1.default.utils.book_new();
    const worksheet = xlsx_js_style_1.default.utils.aoa_to_sheet([
        ["sourceCategory", "productDescription", "brand"],
    ]);
    xlsx_js_style_1.default.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    xlsx_js_style_1.default.writeFile(workbook, savePath);
};
exports.createCoupangCategoryTemplate = createCoupangCategoryTemplate;
