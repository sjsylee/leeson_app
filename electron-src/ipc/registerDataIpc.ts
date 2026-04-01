import { BrowserWindow, dialog, ipcMain } from "electron";
import type { OpenDialogOptions, SaveDialogOptions } from "electron";
import {
  downloadCategory,
  searchCpCategories,
  searchEcCategories,
  uploadCategory,
} from "../services/category";
import { getCpCategoryMeta } from "../services/cpCategoryMeta";
import {
  downloadCoupangCategoryBatchResults,
  downloadCoupangCategoryTemplate,
  importCoupangCategoryExcel,
  predictCoupangCategory,
  predictCoupangCategoryBatch,
} from "../services/coupangCategoryPrediction";
import { validateCustoms } from "../services/customsValidation";
import { searchHsCodes } from "../services/hsCode";
import { downloadKeyword, searchKeywords, uploadKeyword } from "../services/keyword";
import type {
  CategoryUploadRequest,
  CoupangCategoryBatchExportRequest,
  CoupangCategoryBatchPredictRequest,
  CoupangCategoryExcelImportRequest,
  CoupangCategoryPredictRequest,
  CustomsValidationRequest,
  CpCategoryMetaRequest,
  DownloadRequest,
  KeywordUploadRequest,
  SearchRequest,
} from "../types/settings";
import { assertTrustedSender } from "./security";

export const registerDataIpc = (): void => {
  ipcMain.handle("category:searchCp", (event, payload: SearchRequest) => {
    assertTrustedSender(event);

    return searchCpCategories(payload);
  });

  ipcMain.handle("category:searchEc", (event, payload: SearchRequest) => {
    assertTrustedSender(event);

    return searchEcCategories(payload);
  });

  ipcMain.handle("category:upload", (event, payload: CategoryUploadRequest) => {
    assertTrustedSender(event);

    return uploadCategory(payload);
  });

  ipcMain.handle("category:download", (event, payload: DownloadRequest) => {
    assertTrustedSender(event);

    return downloadCategory(payload);
  });

  ipcMain.handle("keyword:search", (event, payload: SearchRequest) => {
    assertTrustedSender(event);

    return searchKeywords(payload);
  });

  ipcMain.handle("keyword:upload", (event, payload: KeywordUploadRequest) => {
    assertTrustedSender(event);

    return uploadKeyword(payload);
  });

  ipcMain.handle("keyword:download", (event, payload: DownloadRequest) => {
    assertTrustedSender(event);

    return downloadKeyword(payload);
  });

  ipcMain.handle("hsCode:search", (event, payload: SearchRequest) => {
    assertTrustedSender(event);

    return searchHsCodes(payload);
  });

  ipcMain.handle("cpCategoryMeta:get", (event, payload: CpCategoryMetaRequest) => {
    assertTrustedSender(event);

    return getCpCategoryMeta(payload);
  });

  ipcMain.handle("customsValidation:validate", (event, payload: CustomsValidationRequest) => {
    assertTrustedSender(event);

    return validateCustoms(payload);
  });

  ipcMain.handle(
    "coupangCategoryPrediction:predict",
    (event, payload: CoupangCategoryPredictRequest) => {
      assertTrustedSender(event);

      return predictCoupangCategory(payload);
    }
  );

  ipcMain.handle("coupangCategoryPrediction:chooseTemplateSavePath", async (event) => {
    assertTrustedSender(event);

    const parentWindow = BrowserWindow.fromWebContents(event.sender);
    const dialogOptions: SaveDialogOptions = {
      title: "카테고리 AI 양식 저장",
      defaultPath: "category_ai_template.xlsx",
      filters: [{ name: "Excel", extensions: ["xlsx"] }],
    };
    const result = parentWindow
      ? await dialog.showSaveDialog(parentWindow, dialogOptions)
      : await dialog.showSaveDialog(dialogOptions);

    return result.canceled ? null : result.filePath ?? null;
  });

  ipcMain.handle("coupangCategoryPrediction:chooseImportExcelFile", async (event) => {
    assertTrustedSender(event);

    const parentWindow = BrowserWindow.fromWebContents(event.sender);
    const dialogOptions: OpenDialogOptions = {
      title: "카테고리 AI 엑셀 불러오기",
      properties: ["openFile"],
      filters: [{ name: "Excel", extensions: ["xlsx", "xls"] }],
    };
    const result = parentWindow
      ? await dialog.showOpenDialog(parentWindow, dialogOptions)
      : await dialog.showOpenDialog(dialogOptions);

    return result.canceled ? null : result.filePaths[0] ?? null;
  });

  ipcMain.handle("coupangCategoryPrediction:chooseBatchResultSavePath", async (event) => {
    assertTrustedSender(event);

    const parentWindow = BrowserWindow.fromWebContents(event.sender);
    const dialogOptions: SaveDialogOptions = {
      title: "카테고리 AI 결과 저장",
      defaultPath: "category_ai_result.xlsx",
      filters: [{ name: "Excel", extensions: ["xlsx"] }],
    };
    const result = parentWindow
      ? await dialog.showSaveDialog(parentWindow, dialogOptions)
      : await dialog.showSaveDialog(dialogOptions);

    return result.canceled ? null : result.filePath ?? null;
  });

  ipcMain.handle("coupangCategoryPrediction:downloadTemplate", (event, payload: DownloadRequest) => {
    assertTrustedSender(event);

    return downloadCoupangCategoryTemplate(payload);
  });

  ipcMain.handle("coupangCategoryPrediction:importExcel", (event, payload: CoupangCategoryExcelImportRequest) => {
    assertTrustedSender(event);

    return importCoupangCategoryExcel(payload);
  });

  ipcMain.handle(
    "coupangCategoryPrediction:predictBatch",
    (event, payload: CoupangCategoryBatchPredictRequest) => {
      assertTrustedSender(event);

      return predictCoupangCategoryBatch(payload, (progress) => {
        event.sender.send("coupangCategoryPrediction:batchProgress", progress);
      });
    }
  );

  ipcMain.handle(
    "coupangCategoryPrediction:downloadBatchResults",
    (event, payload: CoupangCategoryBatchExportRequest) => {
      assertTrustedSender(event);

      return downloadCoupangCategoryBatchResults(payload);
    }
  );
};
