import XLSX from "xlsx-js-style";
import type { DownloadRequest, CoupangCategoryBatchExportRequest, CoupangCategoryExcelImportRequest } from "../../types/settings";
import { sanitizeRequiredText } from "../validation";
import type {
  CoupangCategoryBatchInputRow,
  CoupangCategoryBatchResultRow,
  CoupangCategoryExcelImportResult,
} from "./types";

const TEMPLATE_HEADERS = ["sourceCategory", "productDescription", "brand"];

const normalizeText = (value: unknown): string => {
  return String(value ?? "").trim();
};

const autoFitColumns = (worksheet: XLSX.WorkSheet): void => {
  const range = worksheet["!ref"] ? XLSX.utils.decode_range(worksheet["!ref"]) : null;

  if (!range) {
    return;
  }

  const widths: Array<{ wch: number }> = [];

  for (let column = range.s.c; column <= range.e.c; column += 1) {
    let maxLength = 10;

    for (let row = range.s.r; row <= range.e.r; row += 1) {
      const cell = worksheet[XLSX.utils.encode_cell({ c: column, r: row })];
      const length = String(cell?.v ?? "").length + 2;

      if (length > maxLength) {
        maxLength = length;
      }
    }

    widths.push({ wch: Math.min(maxLength, 48) });
  }

  worksheet["!cols"] = widths;
};

const buildStyledWorksheet = (headers: string[], rows: Record<string, unknown>[]): XLSX.WorkSheet => {
  const worksheet = XLSX.utils.json_to_sheet([]);

  XLSX.utils.sheet_add_aoa(worksheet, [headers]);
  XLSX.utils.sheet_add_json(worksheet, rows, { origin: "A2", skipHeader: true });

  headers.forEach((_, index) => {
    const cell = worksheet[`${XLSX.utils.encode_col(index)}1`];

    if (cell) {
      cell.s = {
        font: { sz: "13", color: { rgb: "FFFFFF" }, bold: true },
        fill: { fgColor: { rgb: "141E46" } },
        alignment: { horizontal: "center" },
        border: {
          right: { style: "thin", color: "000000" },
          left: { style: "thin", color: "000000" },
          top: { style: "thin", color: "000000" },
          bottom: { style: "thin", color: "000000" },
        },
      };
    }
  });

  autoFitColumns(worksheet);

  return worksheet;
};

export const downloadCoupangCategoryTemplateWorkbook = ({ savePath }: DownloadRequest): { result: boolean; errorLog: string } => {
  const safeSavePath = sanitizeRequiredText(savePath, "savePath", 1024);

  try {
    const workbook = XLSX.utils.book_new();
    const worksheet = buildStyledWorksheet(TEMPLATE_HEADERS, [
      {
        sourceCategory: "예: 여성 샌들",
        productDescription: "예: EVA 밑창, 미끄럼 방지",
        brand: "예: CROCS",
      },
    ]);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, safeSavePath);

    return { result: true, errorLog: "" };
  } catch (error) {
    return {
      result: false,
      errorLog: error instanceof Error ? error.message : String(error),
    };
  }
};

export const importCoupangCategoryWorkbook = ({
  filePath,
}: CoupangCategoryExcelImportRequest): CoupangCategoryExcelImportResult => {
  const safeFilePath = sanitizeRequiredText(filePath, "filePath", 1024);
  const workbook = XLSX.readFile(safeFilePath);
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error("엑셀 파일에서 시트를 찾지 못했습니다.");
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json<Array<unknown>>(worksheet, { header: 1, defval: "" });
  const headerRow = rows[0]?.map((cell) => normalizeText(cell)) ?? [];

  if (!TEMPLATE_HEADERS.every((header, index) => headerRow[index] === header)) {
    throw new Error("엑셀 양식이 올바르지 않습니다. sourceCategory, productDescription, brand 헤더를 확인해주세요.");
  }

  let skippedRows = 0;

  const parsedRows: CoupangCategoryBatchInputRow[] = rows
    .slice(1)
    .map((row, index) => {
      const sourceCategory = normalizeText(row[0]);
      const productDescription = normalizeText(row[1]);
      const brand = normalizeText(row[2]);

      if (!sourceCategory && !productDescription && !brand) {
        skippedRows += 1;
        return null;
      }

      return {
        rowNumber: index + 2,
        sourceCategory,
        productDescription,
        brand,
      };
    })
    .filter((row): row is CoupangCategoryBatchInputRow => row !== null);

  return {
    rows: parsedRows,
    totalRows: Math.max(rows.length - 1, 0),
    parsedRows: parsedRows.length,
    skippedRows,
  };
};

export const downloadCoupangCategoryBatchWorkbook = ({
  savePath,
  rows,
}: CoupangCategoryBatchExportRequest): { result: boolean; errorLog: string } => {
  const safeSavePath = sanitizeRequiredText(savePath, "savePath", 1024);

  try {
    const workbook = XLSX.utils.book_new();
    const worksheet = buildStyledWorksheet(
      [
        "rowNumber",
        "sourceCategory",
        "productDescription",
        "brand",
        "status",
        "summary",
        "topCategoryCode",
        "topCategoryName",
        "rawCode",
        "rawMessage",
      ],
      rows.map((row: CoupangCategoryBatchResultRow) => ({
        rowNumber: row.rowNumber,
        sourceCategory: row.sourceCategory,
        productDescription: row.productDescription,
        brand: row.brand,
        status: row.status,
        summary: row.summary,
        topCategoryCode: row.topCategoryCode,
        topCategoryName: row.topCategoryName,
        rawCode: row.rawCode,
        rawMessage: row.rawMessage,
      }))
    );

    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, safeSavePath);

    return { result: true, errorLog: "" };
  } catch (error) {
    return {
      result: false,
      errorLog: error instanceof Error ? error.message : String(error),
    };
  }
};
