import XLSX, { ColInfo, WorkSheet } from "xlsx-js-style";

function autoFitColumns(worksheet: WorkSheet): void {
  const reference = worksheet["!ref"];

  if (!reference) {
    return;
  }

  const [firstCol, lastCol] = reference.replace(/\d/, "").split(":");
  const numRegexp = new RegExp(/\d+$/g);
  const firstColIndex = firstCol.charCodeAt(0);
  const lastColIndex = lastCol.charCodeAt(0);
  const rows = Number(numRegexp.exec(lastCol)?.[0] ?? 0);
  const objectMaxLength: ColInfo[] = [];

  for (let colIndex = firstColIndex; colIndex <= lastColIndex; colIndex += 1) {
    const col = String.fromCharCode(colIndex);
    let maxCellLength = 0;

    for (let row = 1; row <= rows; row += 1) {
      try {
        const cellLength = String(worksheet[`${col}${row}`].v).length + 1;

        if (cellLength > maxCellLength) {
          maxCellLength = cellLength;
        }
      } catch {
        continue;
      }
    }

    objectMaxLength.push({ width: maxCellLength });
  }

  worksheet["!cols"] = objectMaxLength;
}

export function exportWorksheet(fileName: string, target: "cat" | "kwd", json: unknown[]): void {
  const workbook = XLSX.utils.book_new();
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

  const categoryHeader = [
    [
      {
        v: "name",
        t: "s",
        s: {
          font: { sz: "13", color: { rgb: "FFFFFF" }, bold: true },
          fill: { fgColor: { rgb: "141E46" }, bold: true },
          alignment: { horizontal: "center" },
          border: {
            right: { style: "thin", color: "000000" },
            left: { style: "thin", color: "000000" },
            top: { style: "thin", color: "000000" },
            bottom: { style: "thin", color: "000000" },
          },
        },
      },
      {
        v: "displayCategoryCode",
        t: "s",
        s: {
          font: { sz: "13", color: { rgb: "FFFFFF" }, bold: true },
          fill: { fgColor: { rgb: "141E46" }, bold: true },
          alignment: { horizontal: "center" },
          border: {
            right: { style: "thin", color: "000000" },
            left: { style: "thin", color: "000000" },
            top: { style: "thin", color: "000000" },
            bottom: { style: "thin", color: "000000" },
          },
        },
      },
    ],
  ];

  const keywordHeader = [
    [
      {
        v: "kwd",
        t: "s",
        s: {
          font: { sz: "13", color: { rgb: "FFFFFF" }, bold: true },
          fill: { fgColor: { rgb: "141E46" }, bold: true },
          alignment: { horizontal: "center" },
          border: {
            right: { style: "thin", color: "000000" },
            left: { style: "thin", color: "000000" },
            top: { style: "thin", color: "000000" },
            bottom: { style: "thin", color: "000000" },
          },
        },
      },
      {
        v: "related_kwd",
        t: "s",
        s: {
          font: { sz: "13", color: { rgb: "FFFFFF" }, bold: true },
          fill: { fgColor: { rgb: "141E46" }, bold: true },
          alignment: { horizontal: "center" },
          border: {
            right: { style: "thin", color: "000000" },
            left: { style: "thin", color: "000000" },
            top: { style: "thin", color: "000000" },
            bottom: { style: "thin", color: "000000" },
          },
        },
      },
    ],
  ];

  const header = target === "cat" ? categoryHeader : keywordHeader;

  XLSX.utils.sheet_add_aoa(worksheet, header);
  XLSX.utils.sheet_add_json(worksheet, json as object[], {
    origin: "A2",
    skipHeader: true,
  });
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  autoFitColumns(worksheet);
  XLSX.writeFile(workbook, fileName);
}
