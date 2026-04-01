import XLSX from "xlsx-js-style";
import type { CoupangCategoryBatchInputRow, CoupangCategoryExcelImportResult } from "./types";

const normalizeText = (value: unknown): string => {
  if (value === null || typeof value === "undefined") {
    return "";
  }

  return String(value).trim();
};

const findHeaderIndex = (headers: string[], target: string): number => {
  return headers.findIndex((header) => header.toLowerCase() === target.toLowerCase());
};

export const parseCoupangCategoryWorkbook = (filePath: string): CoupangCategoryExcelImportResult => {
  const workbook = XLSX.readFile(filePath);
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error("엑셀 파일에서 시트를 찾지 못했습니다.");
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: "",
  });

  if (rows.length === 0) {
    return {
      rows: [],
      totalRows: 0,
      parsedRows: 0,
      skippedRows: 0,
    };
  }

  const headerRow = rows[0] ?? [];
  const headers = headerRow.map((cell) => normalizeText(cell));
  const sourceCategoryIndex = findHeaderIndex(headers, "sourceCategory");
  const productDescriptionIndex = findHeaderIndex(headers, "productDescription");
  const brandIndex = findHeaderIndex(headers, "brand");

  if (sourceCategoryIndex < 0) {
    throw new Error("엑셀 헤더에 sourceCategory 컬럼이 필요합니다.");
  }

  const parsedRows: CoupangCategoryBatchInputRow[] = [];
  let skippedRows = 0;

  for (let index = 1; index < rows.length; index += 1) {
    const row = rows[index] ?? [];
    const sourceCategory = normalizeText(row[sourceCategoryIndex]);
    const productDescription =
      productDescriptionIndex >= 0 ? normalizeText(row[productDescriptionIndex]) : "";
    const brand = brandIndex >= 0 ? normalizeText(row[brandIndex]) : "";

    if (!sourceCategory && !productDescription && !brand) {
      skippedRows += 1;
      continue;
    }

    parsedRows.push({
      rowNumber: index + 1,
      sourceCategory,
      productDescription,
      brand,
    });
  }

  return {
    rows: parsedRows,
    totalRows: rows.length - 1,
    parsedRows: parsedRows.length,
    skippedRows,
  };
};
