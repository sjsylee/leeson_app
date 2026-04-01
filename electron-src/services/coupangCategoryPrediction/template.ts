import XLSX from "xlsx-js-style";

export const createCoupangCategoryTemplate = (savePath: string): void => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([
    ["sourceCategory", "productDescription", "brand"],
  ]);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, savePath);
};
