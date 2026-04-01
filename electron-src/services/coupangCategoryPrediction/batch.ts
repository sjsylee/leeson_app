import type {
  CoupangCategoryBatchInputRow,
  CoupangCategoryBatchPredictResult,
  CoupangCategoryBatchResultRow,
  CoupangCategoryPredictionResult,
} from "./types";

const toSuccessRow = (
  input: CoupangCategoryBatchInputRow,
  prediction: CoupangCategoryPredictionResult
): CoupangCategoryBatchResultRow => {
  const topCandidate = prediction.candidates[0];

  return {
    rowNumber: input.rowNumber,
    sourceCategory: input.sourceCategory,
    productDescription: input.productDescription,
    brand: input.brand,
    status: "success",
    summary: prediction.summary,
    topCategoryCode: topCandidate?.categoryCode ?? "",
    topCategoryName: topCandidate?.categoryName ?? "",
    rawCode: prediction.rawCode ?? "",
    rawMessage: prediction.rawMessage ?? "",
  };
};

const toErrorRow = (input: CoupangCategoryBatchInputRow, errorMessage: string): CoupangCategoryBatchResultRow => {
  return {
    rowNumber: input.rowNumber,
    sourceCategory: input.sourceCategory,
    productDescription: input.productDescription,
    brand: input.brand,
    status: "error",
    summary: errorMessage,
    topCategoryCode: "",
    topCategoryName: "",
    rawCode: "",
    rawMessage: errorMessage,
  };
};

export const predictCoupangCategoryBatch = async (
  rows: CoupangCategoryBatchInputRow[],
  predict: (payload: {
    productName: string;
    productDescription: string;
    brand: string;
  }) => Promise<CoupangCategoryPredictionResult>
): Promise<CoupangCategoryBatchPredictResult> => {
  const resultRows: CoupangCategoryBatchResultRow[] = [];

  for (const row of rows) {
    if (!row.sourceCategory.trim()) {
      resultRows.push(toErrorRow(row, "sourceCategory 값이 비어 있습니다."));
      continue;
    }

    try {
      const prediction = await predict({
        productName: row.sourceCategory,
        productDescription: row.productDescription,
        brand: row.brand,
      });

      resultRows.push(toSuccessRow(row, prediction));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "카테고리 예측 중 오류가 발생했습니다.";
      resultRows.push(toErrorRow(row, errorMessage));
    }
  }

  const successCount = resultRows.filter((row) => row.status === "success").length;
  const errorCount = resultRows.length - successCount;
  const summary = `총 ${resultRows.length}건 처리 완료 (성공 ${successCount}건 / 오류 ${errorCount}건)`;

  return {
    summary,
    totalRows: resultRows.length,
    successCount,
    errorCount,
    rows: resultRows,
  };
};
