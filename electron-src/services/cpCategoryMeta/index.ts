import type { CpCategoryMetaRequest } from "../../types/settings";
import { withDatabase } from "../../db/client";
import { sanitizePositiveInteger } from "../validation";

type MetaRow = {
  name: string;
  [key: string]: unknown;
};

type MetaOption = {
  attributeTypeName: unknown;
  dataType: unknown;
  inputType: string;
  inputValues: never[];
  basicUnit: unknown;
  usableUnits: string[];
  required: string;
  groupNumber: string;
  exposed: string;
};

export const getCpCategoryMeta = async ({ catCode }: CpCategoryMetaRequest): Promise<{
  status: number | undefined;
  result: MetaOption[];
  cat_title: string | undefined;
}> => {
  let status: number | undefined;
  let result: MetaOption[] = [];

  const categoryCode = sanitizePositiveInteger(catCode, "catCode");

  const { dats } = await withDatabase("Category", async (conn) => {
    const dataRows = (await conn.query(
      `SELECT name,
              option_name_1, option_name_2, option_name_3, option_name_4,
              option_d_type_1, option_d_type_2, option_d_type_3, option_d_type_4,
              option_a_unit_1, option_a_unit_2, option_a_unit_3, option_a_unit_4,
              option_b_unit_1, option_b_unit_2, option_b_unit_3, option_b_unit_4
         FROM cp_category_meta
        WHERE cat_code = ?`,
      [categoryCode]
    )) as MetaRow[];

    return {
      dats: dataRows,
    };
  });

  try {
    for (let index = 1; index <= 4; index += 1) {
      const row = dats[0];

      if (row?.[`option_name_${index}`]) {
        const usableUnits = row[`option_a_unit_${index}`];

        result.push({
          attributeTypeName: row[`option_name_${index}`],
          dataType: row[`option_d_type_${index}`],
          inputType: "INPUT",
          inputValues: [],
          basicUnit: row[`option_b_unit_${index}`],
          usableUnits: typeof usableUnits === "string" ? usableUnits.split(",") : [],
          required: "MANDATORY",
          groupNumber: "NONE",
          exposed: "EXPOSED",
        });
      }
    }
  } catch {
    status = 400;
  }

  return {
    status,
    result,
    cat_title: dats[0] ? dats[0].name : undefined,
  };
};
