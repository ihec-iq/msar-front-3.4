import exportFromJSON from "export-from-json";

export function excelParser(
  data: any,
  newFileName: string,
  fileExportType: string
) {
  if (!data) return;
  try {
    const fileName = newFileName || "exported-data";
    const exportType = (fileExportType as string) || "xls";

    exportFromJSON({ data, fileName, exportType });
  } catch (e) {
    throw new Error("Parsing failed!");
  }
}
