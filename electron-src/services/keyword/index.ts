import type { DownloadRequest, KeywordUploadRequest, SearchRequest } from "../../types/settings";
import { withDatabase } from "../../db/client";
import { exportWorksheet } from "../exportToExcel";
import { sanitizeRequiredText, sanitizeSearchQuery } from "../validation";

type KeywordRow = {
  kwd: string;
  related_kwd: string;
};

export const searchKeywords = async ({ q }: SearchRequest): Promise<{
  result: Array<{ value: string; label: string }>;
}> => {
  const safeQuery = sanitizeSearchQuery(q);

  const result = await withDatabase("Keyword", async (conn) => {
    const rows = (await conn.query(
      "SELECT kwd, related_kwd FROM cp_kwd WHERE kwd LIKE ? LIMIT 100",
      [`%${safeQuery}%`]
    )) as KeywordRow[];

    return rows.map((row) => ({
      value: row.related_kwd,
      label: `🌎 ${row.kwd} 🌎 : ${row.related_kwd}`,
    }));
  });

  return { result };
};

export const uploadKeyword = async ({
  kwd,
  related_kwd,
}: KeywordUploadRequest): Promise<{ result: boolean; errorLog: string }> => {
  const safeKeyword = sanitizeRequiredText(kwd, "kwd", 255);
  const safeRelatedKeyword = sanitizeRequiredText(related_kwd, "related_kwd", 1000);

  let result = true;
  let errorLog = "";

  try {
    await withDatabase("Keyword", async (conn) => {
      await conn.query("INSERT INTO cp_kwd (kwd, related_kwd) VALUES (?, ?)", [
        safeKeyword,
        safeRelatedKeyword,
      ]);
    });
  } catch (error) {
    errorLog = error instanceof Error ? error.message : String(error);
    result = false;
  }

  if (errorLog.includes("PRIMARY")) {
    try {
      await withDatabase("Keyword", async (conn) => {
        await conn.query("UPDATE cp_kwd SET related_kwd = ? WHERE kwd = ?", [safeRelatedKeyword, safeKeyword]);
      });
      errorLog = "update";
      result = true;
    } catch (error) {
      errorLog = error instanceof Error ? error.message : String(error);
      result = false;
    }
  }

  return { result, errorLog };
};

export const downloadKeyword = async ({
  savePath,
}: DownloadRequest): Promise<{ result: boolean; errorLog: string }> => {
  const safeSavePath = sanitizeRequiredText(savePath, "savePath", 1024);

  let result = true;
  let errorLog = "";

  try {
    const rows = await withDatabase("Keyword", async (conn) => {
      return conn.query("SELECT kwd, related_kwd FROM cp_kwd");
    });

    exportWorksheet(safeSavePath, "kwd", rows);
  } catch (error) {
    result = false;
    errorLog = error instanceof Error ? error.message : String(error);
  }

  return { result, errorLog };
};
