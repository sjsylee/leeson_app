import type { SearchRequest } from "../../types/settings";
import { withDatabase } from "../../db/client";
import { sanitizeSearchQuery } from "../validation";

type HsCodeRow = {
  cat_code: number;
  cp_cat_ref: string;
  [key: string]: unknown;
};

export const searchHsCodes = async ({ q }: SearchRequest): Promise<{
  result: Array<Record<string, unknown>>;
}> => {
  const safeQuery = sanitizeSearchQuery(q);

  const result = await withDatabase("Category", async (conn) => {
    const rows = (await conn.query(
      `SELECT cat_code, tax_cat, hs_code, gov_cat, big_cat, name_high, name_mid, name_low, name_detail,
              code_high, code_mid, code_low, code_detail, cp_cat_ref
         FROM hs_code
        WHERE cp_cat_ref LIKE ?
        LIMIT 100`,
      [`%${safeQuery}%`]
    )) as HsCodeRow[];

    return rows.map((row) => ({
      key: row.cat_code,
      value: row.cat_code,
      label: row.cp_cat_ref.replace(/\n/g, ""),
      ...row,
    }));
  });

  return { result };
};
