export interface AppProfile {
  HOST: string | null;
  PORT: number | null;
}

export interface AppProfileStatus {
  isConfigured: boolean;
  missingFields: string[];
  credentialsStored: {
    dbUser: boolean;
    dbPassword: boolean;
    coupangAccessKey: boolean;
    coupangSecretKey: boolean;
    unipassKey: boolean;
  };
}

export interface DbCredentialInput {
  user: string;
  password: string;
}

export interface CoupangCredentialInput {
  accessKey: string;
  secretKey: string;
}

export interface UnipassCredentialInput {
  unipassKey: string;
}

export interface SearchRequest {
  q: string;
}

export interface CategoryUploadRequest {
  displayCategoryCode: number;
  name: string;
}

export interface KeywordUploadRequest {
  kwd: string;
  related_kwd: string;
}

export interface DownloadRequest {
  savePath: string;
}

export interface CpCategoryMetaRequest {
  catCode: number | string;
}

export interface CustomsValidationRequest {
  recipientName: string;
  ordererName: string;
  customsCode: string;
  recipientPhone: string;
  postalCode: string;
}

export interface CoupangCategoryPredictRequest {
  productName: string;
  productDescription: string;
  brand: string;
}

export interface CoupangCategoryBatchInputRow {
  rowNumber: number;
  sourceCategory: string;
  productDescription: string;
  brand: string;
}

export interface CoupangCategoryExcelImportRequest {
  filePath: string;
}

export interface CoupangCategoryBatchPredictRequest {
  rows: CoupangCategoryBatchInputRow[];
}

export interface CoupangCategoryBatchResultRow {
  rowNumber: number;
  sourceCategory: string;
  productDescription: string;
  brand: string;
  status: "success" | "error";
  summary: string;
  topCategoryCode: string;
  topCategoryName: string;
  rawCode: string;
  rawMessage: string;
}

export interface CoupangCategoryExcelImportResult {
  rows: CoupangCategoryBatchInputRow[];
  totalRows: number;
  parsedRows: number;
  skippedRows: number;
}

export interface CoupangCategoryBatchPredictResult {
  summary: string;
  totalRows: number;
  successCount: number;
  errorCount: number;
  rows: CoupangCategoryBatchResultRow[];
}

export interface CoupangCategoryBatchExportRequest {
  savePath: string;
  rows: CoupangCategoryBatchResultRow[];
}

export interface CoupangCategoryExcelTemplateRequest {
  savePath: string;
}

export interface CoupangCategoryExcelImportRequest {
  filePath: string;
}

export type CoupangCategoryBatchStatus = "success" | "error";

export interface CoupangCategoryBatchResultRow {
  rowNumber: number;
  sourceCategory: string;
  productDescription: string;
  brand: string;
  status: CoupangCategoryBatchStatus;
  summary: string;
  topCategoryCode: string;
  topCategoryName: string;
  rawCode: string;
  rawMessage: string;
}

export interface CoupangCategoryBatchPredictRequest {
  filePath: string;
}

export interface CoupangCategoryBatchPredictResponse {
  summary: string;
  totalRows: number;
  successCount: number;
  errorCount: number;
  rows: CoupangCategoryBatchResultRow[];
}

export interface CoupangCategoryExcelImportResponse {
  totalRows: number;
  parsedRows: number;
  skippedRows: number;
}

export interface CoupangCategoryBatchExportRequest {
  savePath: string;
  rows: CoupangCategoryBatchResultRow[];
}
