export interface CoupangCategoryPredictParams {
  productName: string;
  productDescription: string;
  brand: string;
}

export interface CoupangCategoryPredictionCandidate {
  categoryCode: string;
  categoryName: string;
  score: number | null;
}

export interface CoupangCategoryPredictionResult {
  summary: string;
  candidates: CoupangCategoryPredictionCandidate[];
  rawCode: string | null;
  rawMessage: string | null;
}

export interface CoupangCategoryBatchInputRow {
  rowNumber: number;
  sourceCategory: string;
  productDescription: string;
  brand: string;
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
