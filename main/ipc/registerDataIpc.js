"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDataIpc = void 0;
const electron_1 = require("electron");
const category_1 = require("../services/category");
const cpCategoryMeta_1 = require("../services/cpCategoryMeta");
const coupangCategoryPrediction_1 = require("../services/coupangCategoryPrediction");
const customsValidation_1 = require("../services/customsValidation");
const hsCode_1 = require("../services/hsCode");
const keyword_1 = require("../services/keyword");
const security_1 = require("./security");
const registerDataIpc = () => {
    electron_1.ipcMain.handle("category:searchCp", (event, payload) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, category_1.searchCpCategories)(payload);
    });
    electron_1.ipcMain.handle("category:searchEc", (event, payload) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, category_1.searchEcCategories)(payload);
    });
    electron_1.ipcMain.handle("category:upload", (event, payload) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, category_1.uploadCategory)(payload);
    });
    electron_1.ipcMain.handle("category:download", (event, payload) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, category_1.downloadCategory)(payload);
    });
    electron_1.ipcMain.handle("keyword:search", (event, payload) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, keyword_1.searchKeywords)(payload);
    });
    electron_1.ipcMain.handle("keyword:upload", (event, payload) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, keyword_1.uploadKeyword)(payload);
    });
    electron_1.ipcMain.handle("keyword:download", (event, payload) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, keyword_1.downloadKeyword)(payload);
    });
    electron_1.ipcMain.handle("hsCode:search", (event, payload) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, hsCode_1.searchHsCodes)(payload);
    });
    electron_1.ipcMain.handle("cpCategoryMeta:get", (event, payload) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, cpCategoryMeta_1.getCpCategoryMeta)(payload);
    });
    electron_1.ipcMain.handle("customsValidation:validate", (event, payload) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, customsValidation_1.validateCustoms)(payload);
    });
    electron_1.ipcMain.handle("coupangCategoryPrediction:predict", (event, payload) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, coupangCategoryPrediction_1.predictCoupangCategory)(payload);
    });
    electron_1.ipcMain.handle("coupangCategoryPrediction:chooseTemplateSavePath", async (event) => {
        (0, security_1.assertTrustedSender)(event);
        const parentWindow = electron_1.BrowserWindow.fromWebContents(event.sender);
        const dialogOptions = {
            title: "카테고리 AI 양식 저장",
            defaultPath: "category_ai_template.xlsx",
            filters: [{ name: "Excel", extensions: ["xlsx"] }],
        };
        const result = parentWindow
            ? await electron_1.dialog.showSaveDialog(parentWindow, dialogOptions)
            : await electron_1.dialog.showSaveDialog(dialogOptions);
        return result.canceled ? null : result.filePath ?? null;
    });
    electron_1.ipcMain.handle("coupangCategoryPrediction:chooseImportExcelFile", async (event) => {
        (0, security_1.assertTrustedSender)(event);
        const parentWindow = electron_1.BrowserWindow.fromWebContents(event.sender);
        const dialogOptions = {
            title: "카테고리 AI 엑셀 불러오기",
            properties: ["openFile"],
            filters: [{ name: "Excel", extensions: ["xlsx", "xls"] }],
        };
        const result = parentWindow
            ? await electron_1.dialog.showOpenDialog(parentWindow, dialogOptions)
            : await electron_1.dialog.showOpenDialog(dialogOptions);
        return result.canceled ? null : result.filePaths[0] ?? null;
    });
    electron_1.ipcMain.handle("coupangCategoryPrediction:chooseBatchResultSavePath", async (event) => {
        (0, security_1.assertTrustedSender)(event);
        const parentWindow = electron_1.BrowserWindow.fromWebContents(event.sender);
        const dialogOptions = {
            title: "카테고리 AI 결과 저장",
            defaultPath: "category_ai_result.xlsx",
            filters: [{ name: "Excel", extensions: ["xlsx"] }],
        };
        const result = parentWindow
            ? await electron_1.dialog.showSaveDialog(parentWindow, dialogOptions)
            : await electron_1.dialog.showSaveDialog(dialogOptions);
        return result.canceled ? null : result.filePath ?? null;
    });
    electron_1.ipcMain.handle("coupangCategoryPrediction:downloadTemplate", (event, payload) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, coupangCategoryPrediction_1.downloadCoupangCategoryTemplate)(payload);
    });
    electron_1.ipcMain.handle("coupangCategoryPrediction:importExcel", (event, payload) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, coupangCategoryPrediction_1.importCoupangCategoryExcel)(payload);
    });
    electron_1.ipcMain.handle("coupangCategoryPrediction:predictBatch", (event, payload) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, coupangCategoryPrediction_1.predictCoupangCategoryBatch)(payload, (progress) => {
            event.sender.send("coupangCategoryPrediction:batchProgress", progress);
        });
    });
    electron_1.ipcMain.handle("coupangCategoryPrediction:downloadBatchResults", (event, payload) => {
        (0, security_1.assertTrustedSender)(event);
        return (0, coupangCategoryPrediction_1.downloadCoupangCategoryBatchResults)(payload);
    });
};
exports.registerDataIpc = registerDataIpc;
