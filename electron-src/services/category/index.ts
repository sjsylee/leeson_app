import type { CategoryUploadRequest, DownloadRequest, SearchRequest } from "../../types/settings";
import { withDatabase } from "../../db/client";
import { exportWorksheet } from "../exportToExcel";
import {
  sanitizePositiveInteger,
  sanitizeRequiredText,
  sanitizeSearchQuery,
} from "../validation";

type CategoryOption = {
  value: number;
  label: string;
};

type CategorySearchRow = {
  displayCategoryCode: number;
  nameKo: string;
};

type ExistingCategoryRow = {
  displayCategoryCode: number;
  name: string;
};

export const searchCpCategories = async ({ q }: SearchRequest): Promise<{ result: CategoryOption[] }> => {
  const safeQuery = sanitizeSearchQuery(q);

  const result = await withDatabase("Category", async (conn) => {
    const rows = (await conn.query(
      "SELECT displayCategoryCode, nameKo FROM cp_category_list WHERE nameKo LIKE ? LIMIT 100",
      [`%${safeQuery}%`]
    )) as CategorySearchRow[];

    return rows.map((row) => ({
      value: row.displayCategoryCode,
      label: `[${row.displayCategoryCode}] ${row.nameKo}`,
    }));
  });

  return { result };
};

export const searchEcCategories = async ({ q }: SearchRequest): Promise<{ result: CategoryOption[] }> => {
  const safeQuery = sanitizeSearchQuery(q);

  const result = await withDatabase("Category", async (conn) => {
    let rows = (await conn.query(
      "SELECT displayCategoryCode, name FROM amz_category_list WHERE name LIKE ? LIMIT 100",
      [`%${safeQuery}%`]
    )) as ExistingCategoryRow[];

    if (rows.length === 0 && /^\d+$/.test(safeQuery)) {
      rows = (await conn.query(
        "SELECT displayCategoryCode, name FROM amz_category_list WHERE displayCategoryCode = ?",
        [Number(safeQuery)]
      )) as ExistingCategoryRow[];
    }

    return rows.map((row) => ({
      value: row.displayCategoryCode,
      label: row.name,
    }));
  });

  return { result };
};

export const uploadCategory = async ({
  displayCategoryCode,
  name,
}: CategoryUploadRequest): Promise<{ result: boolean; errorLog: string }> => {
  const safeDisplayCategoryCode = sanitizePositiveInteger(
    displayCategoryCode,
    "displayCategoryCode"
  );
  const safeName = sanitizeRequiredText(name, "name");

  let result = true;
  let errorLog = "";

  try {
    await withDatabase("Category", async (conn) => {
      await conn.query("INSERT INTO amz_category_list (name, displayCategoryCode) VALUES (?, ?)", [
        safeName,
        safeDisplayCategoryCode,
      ]);
    });
  } catch (error) {
    result = false;
    errorLog = error instanceof Error ? error.message : String(error);
  }

  return { result, errorLog };
};

export const downloadCategory = async ({
  savePath,
}: DownloadRequest): Promise<{ result: boolean; errorLog: string }> => {
  const safeSavePath = sanitizeRequiredText(savePath, "savePath", 1024);

  let result = true;
  let errorLog = "";

  try {
    const rows = await withDatabase("Category", async (conn) => {
      return conn.query("SELECT name, displayCategoryCode FROM amz_category_list");
    });

    exportWorksheet(safeSavePath, "cat", rows);
  } catch (error) {
    result = false;
    errorLog = error instanceof Error ? error.message : String(error);
  }

  return { result, errorLog };
};
