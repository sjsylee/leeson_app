"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadCoupangCategoryBatchResults = exports.predictCoupangCategoryBatch = exports.importCoupangCategoryExcel = exports.downloadCoupangCategoryTemplate = exports.predictCoupangCategory = void 0;
const secrets_1 = require("../../config/secrets");
const excel_1 = require("./excel");
const endpoints_1 = require("./endpoints");
const params_1 = require("./params");
const BATCH_REQUEST_MIN_GAP_MS = 3000;
const delay = async (ms) => {
    await new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
const getStringField = (value, keys) => {
    for (const key of keys) {
        const current = value[key];
        if (typeof current === "string") {
            const normalized = current.trim();
            if (normalized) {
                return normalized;
            }
        }
    }
    return null;
};
const getNumberField = (value, keys) => {
    for (const key of keys) {
        const current = value[key];
        if (typeof current === "number" && Number.isFinite(current)) {
            return current;
        }
        if (typeof current === "string") {
            const parsed = Number(current);
            if (Number.isFinite(parsed)) {
                return parsed;
            }
        }
    }
    return null;
};
const toCandidates = (items) => {
    return items
        .filter((item) => {
        return Boolean(item) && typeof item === "object";
    })
        .map((item) => {
        const categoryCode = getStringField(item, [
            "categoryCode",
            "displayCategoryCode",
            "code",
            "id",
        ]);
        const categoryName = getStringField(item, [
            "categoryName",
            "name",
            "label",
            "categoryPath",
        ]);
        if (!categoryCode && !categoryName) {
            return null;
        }
        return {
            categoryCode: categoryCode ?? "미상",
            categoryName: categoryName ?? "이름 없음",
            score: getNumberField(item, ["score", "confidence", "predictionScore", "similarity"]),
        };
    })
        .filter((candidate) => {
        return candidate !== null;
    })
        .sort((a, b) => {
        const left = a.score ?? -Infinity;
        const right = b.score ?? -Infinity;
        return right - left;
    });
};
const extractItemArray = (raw) => {
    if (Array.isArray(raw)) {
        return raw;
    }
    if (!raw || typeof raw !== "object") {
        return [];
    }
    const root = raw;
    if (Array.isArray(root.data)) {
        return root.data;
    }
    if (root.data && typeof root.data === "object") {
        const data = root.data;
        const predictedCategoryId = getStringField(data, ["predictedCategoryId", "displayCategoryCode"]);
        const predictedCategoryName = getStringField(data, ["predictedCategoryName", "categoryName"]);
        const predictedCategoryScore = getNumberField(data, ["score", "predictionScore", "confidence"]);
        if (predictedCategoryId || predictedCategoryName) {
            return [
                {
                    categoryCode: predictedCategoryId,
                    categoryName: predictedCategoryName,
                    score: predictedCategoryScore,
                },
            ];
        }
        for (const key of ["items", "categories", "predictions", "predictedCategories", "result"]) {
            const candidate = data[key];
            if (Array.isArray(candidate)) {
                return candidate;
            }
        }
    }
    if (Array.isArray(root.result)) {
        return root.result;
    }
    return [];
};
const getCodeAndMessage = (raw) => {
    if (!raw || typeof raw !== "object") {
        return { code: null, message: null };
    }
    const root = raw;
    return {
        code: getStringField(root, ["code", "status"]),
        message: getStringField(root, ["message", "errorMessage"]),
    };
};
const normalizePredictionResponse = (raw) => {
    const { code, message } = getCodeAndMessage(raw);
    const candidates = toCandidates(extractItemArray(raw));
    const summary = candidates.length > 0
        ? "카테고리 예측 결과를 받아왔습니다."
        : message ?? "응답에서 카테고리 예측 후보를 찾지 못했습니다.";
    return {
        summary,
        candidates,
        rawCode: code,
        rawMessage: message,
    };
};
const predictCoupangCategory = async (payload) => {
    const { accessKey, secretKey } = await getCoupangCredentials();
    return predictWithCredentials(payload, accessKey, secretKey);
};
exports.predictCoupangCategory = predictCoupangCategory;
const getCoupangCredentials = async () => {
    const credentials = await (0, secrets_1.getStoredCredentials)();
    const accessKey = credentials.coupangAccessKey?.trim();
    const secretKey = credentials.coupangSecretKey?.trim();
    if (!accessKey || !secretKey) {
        throw new Error("Coupang Access Key 또는 Secret Key가 저장되어 있지 않습니다. 설정 페이지에서 먼저 저장해주세요.");
    }
    return { accessKey, secretKey };
};
const predictWithCredentials = async (payload, accessKey, secretKey) => {
    const params = (0, params_1.sanitizeCoupangCategoryPredictParams)(payload);
    const raw = await (0, endpoints_1.requestCoupangCategoryPrediction)(params, accessKey, secretKey);
    const normalized = normalizePredictionResponse(raw);
    if (normalized.rawCode && normalized.rawCode.toUpperCase() !== "SUCCESS") {
        const message = normalized.rawMessage
            ? `카테고리 예측에 실패했습니다: ${normalized.rawMessage}`
            : `카테고리 예측에 실패했습니다. (${normalized.rawCode})`;
        throw new Error(message);
    }
    if (normalized.candidates.length === 0) {
        throw new Error("카테고리 예측 결과가 비어 있습니다. 상품 정보를 더 구체적으로 입력해 다시 시도해주세요.");
    }
    return normalized;
};
const downloadCoupangCategoryTemplate = async (payload) => {
    return (0, excel_1.downloadCoupangCategoryTemplateWorkbook)(payload);
};
exports.downloadCoupangCategoryTemplate = downloadCoupangCategoryTemplate;
const importCoupangCategoryExcel = async (payload) => {
    return (0, excel_1.importCoupangCategoryWorkbook)(payload);
};
exports.importCoupangCategoryExcel = importCoupangCategoryExcel;
const predictCoupangCategoryBatch = async (payload, onProgress) => {
    const { accessKey, secretKey } = await getCoupangCredentials();
    const rows = [];
    let successCount = 0;
    let errorCount = 0;
    let lastBatchRequestStartedAt = 0;
    let processedRows = 0;
    const totalRows = payload.rows.length;
    onProgress?.({
        processedRows,
        totalRows,
        successCount,
        errorCount,
        currentRowNumber: null,
        currentSourceCategory: null,
        status: "running",
    });
    for (const row of payload.rows) {
        const sourceCategory = row.sourceCategory.trim();
        const productDescription = row.productDescription.trim();
        const brand = row.brand.trim();
        if (!sourceCategory) {
            errorCount += 1;
            processedRows += 1;
            rows.push({
                rowNumber: row.rowNumber,
                sourceCategory,
                productDescription,
                brand,
                status: "error",
                summary: "상품명 또는 원본 카테고리가 비어 있습니다.",
                topCategoryCode: "",
                topCategoryName: "",
                rawCode: "",
                rawMessage: "",
            });
            onProgress?.({
                processedRows,
                totalRows,
                successCount,
                errorCount,
                currentRowNumber: row.rowNumber,
                currentSourceCategory: sourceCategory || null,
                status: "running",
            });
            continue;
        }
        try {
            const now = Date.now();
            const elapsedSinceLastStart = now - lastBatchRequestStartedAt;
            if (lastBatchRequestStartedAt > 0 && elapsedSinceLastStart < BATCH_REQUEST_MIN_GAP_MS) {
                await delay(BATCH_REQUEST_MIN_GAP_MS - elapsedSinceLastStart);
            }
            lastBatchRequestStartedAt = Date.now();
            const result = await predictWithCredentials({
                productName: sourceCategory,
                productDescription,
                brand,
            }, accessKey, secretKey);
            const topCandidate = result.candidates[0];
            successCount += 1;
            rows.push({
                rowNumber: row.rowNumber,
                sourceCategory,
                productDescription,
                brand,
                status: "success",
                summary: result.summary,
                topCategoryCode: topCandidate?.categoryCode ?? "",
                topCategoryName: topCandidate?.categoryName ?? "",
                rawCode: result.rawCode ?? "",
                rawMessage: result.rawMessage ?? "",
            });
            processedRows += 1;
            onProgress?.({
                processedRows,
                totalRows,
                successCount,
                errorCount,
                currentRowNumber: row.rowNumber,
                currentSourceCategory: sourceCategory,
                status: "running",
            });
        }
        catch (error) {
            errorCount += 1;
            rows.push({
                rowNumber: row.rowNumber,
                sourceCategory,
                productDescription,
                brand,
                status: "error",
                summary: error instanceof Error ? error.message : "카테고리 예측 실패",
                topCategoryCode: "",
                topCategoryName: "",
                rawCode: "",
                rawMessage: error instanceof Error ? error.message : "",
            });
            processedRows += 1;
            onProgress?.({
                processedRows,
                totalRows,
                successCount,
                errorCount,
                currentRowNumber: row.rowNumber,
                currentSourceCategory: sourceCategory,
                status: "running",
            });
        }
    }
    onProgress?.({
        processedRows,
        totalRows,
        successCount,
        errorCount,
        currentRowNumber: null,
        currentSourceCategory: null,
        status: "completed",
    });
    return {
        summary: `총 ${rows.length}건 중 ${successCount}건 성공, ${errorCount}건 실패`,
        totalRows: rows.length,
        successCount,
        errorCount,
        rows,
    };
};
exports.predictCoupangCategoryBatch = predictCoupangCategoryBatch;
const downloadCoupangCategoryBatchResults = async (payload) => {
    return (0, excel_1.downloadCoupangCategoryBatchWorkbook)(payload);
};
exports.downloadCoupangCategoryBatchResults = downloadCoupangCategoryBatchResults;
