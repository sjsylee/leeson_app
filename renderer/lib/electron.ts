export type AppProfile = {
  HOST: string | null;
  PORT: number | null;
};

export type AppProfileStatus = {
  isConfigured: boolean;
  missingFields: string[];
  credentialsStored: {
    dbUser: boolean;
    dbPassword: boolean;
    coupangAccessKey: boolean;
    coupangSecretKey: boolean;
    unipassKey: boolean;
  };
};

export type DbCredentialInput = {
  user: string;
  password: string;
};

export type CoupangCredentialInput = {
  accessKey: string;
  secretKey: string;
};

export type UnipassCredentialInput = {
  unipassKey: string;
};

export type CategoryOption = {
  value: number;
  label: string;
};

export type KeywordOption = {
  value: string;
  label: string;
};

export type CategoryUploadRequest = {
  displayCategoryCode: number;
  name: string;
};

export type KeywordUploadRequest = {
  kwd: string;
  related_kwd: string;
};

export type DownloadRequest = {
  savePath: string;
};

export type SearchRequest = {
  q: string;
};

export type HsCodeResponse = {
  result: Array<Record<string, unknown>>;
};

export type CpCategoryMetaResponse = {
  status: number | undefined;
  result: Array<{
    attributeTypeName: string;
    dataType: string;
    inputType: string[] | string;
    basicUnit: string;
    usableUnits: string[];
    required: string;
    groupNumber: string;
    exposed: string;
  }>;
  cat_title: string | undefined;
};

export type CustomsValidationRequest = {
  recipientName: string;
  ordererName: string;
  customsCode: string;
  recipientPhone: string;
  postalCode: string;
};

export type CoupangCategoryPredictRequest = {
  productName: string;
  productDescription: string;
  brand: string;
};

export type CoupangCategoryBatchInputRow = {
  rowNumber: number;
  sourceCategory: string;
  productDescription: string;
  brand: string;
};

export type CoupangCategoryExcelImportRequest = {
  filePath: string;
};

export type CoupangCategoryBatchPredictRequest = {
  rows: CoupangCategoryBatchInputRow[];
};

export type CustomsValidationOutcome =
  | "receiver_valid"
  | "orderer_valid_instead"
  | "invalid";

export type CustomsValidationResult = {
  outcome: CustomsValidationOutcome;
  summary: string;
  receiver: {
    name: string;
    ntceInfo: string;
    isValid: boolean;
  };
  orderer: {
    name: string;
    ntceInfo: string;
    isValid: boolean;
  };
};

export type CoupangCategoryPredictionCandidate = {
  categoryCode: string;
  categoryName: string;
  score: number | null;
};

export type CoupangCategoryPredictionResult = {
  summary: string;
  candidates: CoupangCategoryPredictionCandidate[];
  rawCode: string | null;
  rawMessage: string | null;
};

export type CoupangCategoryBatchResultRow = {
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
};

export type CoupangCategoryExcelImportResult = {
  rows: CoupangCategoryBatchInputRow[];
  totalRows: number;
  parsedRows: number;
  skippedRows: number;
};

export type CoupangCategoryBatchPredictResult = {
  summary: string;
  totalRows: number;
  successCount: number;
  errorCount: number;
  rows: CoupangCategoryBatchResultRow[];
};

export type CoupangCategoryBatchProgress = {
  processedRows: number;
  totalRows: number;
  successCount: number;
  errorCount: number;
  currentRowNumber: number | null;
  currentSourceCategory: string | null;
  status: "running" | "completed";
};

export type CoupangCategoryBatchExportRequest = {
  savePath: string;
  rows: CoupangCategoryBatchResultRow[];
};

type UploadResult = {
  result: boolean;
  errorLog: string;
};

const invoke = async <T>(channel: string, ...args: unknown[]): Promise<T> => {
  return window.electron.ipcRenderer.invoke<T>(channel, ...args);
};

const subscribe = (
  channel: string,
  callback: (event: unknown, ...args: unknown[]) => void
): (() => void) => {
  window.electron.ipcRenderer.on(channel, callback);

  return () => {
    window.electron.ipcRenderer.removeListener(channel, callback);
  };
};

export const settingsApi = {
  getProfile: () => invoke<AppProfile>("settings:getProfile"),
  getStatus: () => invoke<AppProfileStatus>("settings:getStatus"),
  saveProfile: (profile: AppProfile) => invoke<AppProfile>("settings:saveProfile", profile),
  saveDbCredentials: (credentials: DbCredentialInput) =>
    invoke<AppProfileStatus>("settings:saveDbCredentials", credentials),
  clearDbCredentials: () => invoke<AppProfileStatus>("settings:clearDbCredentials"),
  saveCoupangCredentials: (credentials: CoupangCredentialInput) =>
    invoke<AppProfileStatus>("settings:saveCoupangCredentials", credentials),
  clearCoupangCredentials: () => invoke<AppProfileStatus>("settings:clearCoupangCredentials"),
  saveUnipassKey: (credentials: UnipassCredentialInput) =>
    invoke<AppProfileStatus>("settings:saveUnipassKey", credentials),
  clearUnipassKey: () => invoke<AppProfileStatus>("settings:clearUnipassKey"),
};

export const categoryApi = {
  searchCp: (payload: SearchRequest) => invoke<{ result: CategoryOption[] }>("category:searchCp", payload),
  searchEc: (payload: SearchRequest) => invoke<{ result: CategoryOption[] }>("category:searchEc", payload),
  upload: (payload: CategoryUploadRequest) => invoke<UploadResult>("category:upload", payload),
  download: (payload: DownloadRequest) => invoke<UploadResult>("category:download", payload),
};

export const keywordApi = {
  search: (payload: SearchRequest) => invoke<{ result: KeywordOption[] }>("keyword:search", payload),
  upload: (payload: KeywordUploadRequest) => invoke<UploadResult>("keyword:upload", payload),
  download: (payload: DownloadRequest) => invoke<UploadResult>("keyword:download", payload),
};

export const hsCodeApi = {
  search: (payload: SearchRequest) => invoke<HsCodeResponse>("hsCode:search", payload),
};

export const cpCategoryMetaApi = {
  get: (payload: { catCode: number | string }) =>
    invoke<CpCategoryMetaResponse>("cpCategoryMeta:get", payload),
};

export const customsValidationApi = {
  validate: (payload: CustomsValidationRequest) =>
    invoke<CustomsValidationResult>("customsValidation:validate", payload),
};

export const coupangCategoryPredictionApi = {
  chooseTemplateSavePath: () =>
    invoke<string | null>("coupangCategoryPrediction:chooseTemplateSavePath"),
  chooseImportExcelFile: () =>
    invoke<string | null>("coupangCategoryPrediction:chooseImportExcelFile"),
  chooseBatchResultSavePath: () =>
    invoke<string | null>("coupangCategoryPrediction:chooseBatchResultSavePath"),
  predict: (payload: CoupangCategoryPredictRequest) =>
    invoke<CoupangCategoryPredictionResult>("coupangCategoryPrediction:predict", payload),
  downloadTemplate: (payload: DownloadRequest) =>
    invoke<UploadResult>("coupangCategoryPrediction:downloadTemplate", payload),
  importExcel: (payload: CoupangCategoryExcelImportRequest) =>
    invoke<CoupangCategoryExcelImportResult>("coupangCategoryPrediction:importExcel", payload),
  onBatchProgress: (callback: (progress: CoupangCategoryBatchProgress) => void) =>
    subscribe("coupangCategoryPrediction:batchProgress", (_event, progress) => {
      if (progress && typeof progress === "object") {
        callback(progress as CoupangCategoryBatchProgress);
      }
    }),
  predictBatch: (payload: CoupangCategoryBatchPredictRequest) =>
    invoke<CoupangCategoryBatchPredictResult>("coupangCategoryPrediction:predictBatch", payload),
  downloadBatchResults: (payload: CoupangCategoryBatchExportRequest) =>
    invoke<UploadResult>("coupangCategoryPrediction:downloadBatchResults", payload),
};

export const windowApi = {
  expand: (width: number, height: number) =>
    window.electron.ipcRenderer.send("window:expand", { width, height }),
  restore: () => window.electron.ipcRenderer.send("window:restore"),
};

export const updaterApi = {
  onProgress: (callback: (percent: number) => void) =>
    subscribe("update-progress", (_event, percent) => {
      callback(typeof percent === "number" ? percent : 0);
    }),
  onComplete: (callback: () => void) =>
    subscribe("update-complete", () => {
      callback();
    }),
};
