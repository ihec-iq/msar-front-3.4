// ─────────────────────────────────────────────────────────────────────────────
// File: useExportExcel.ts
// Lazy-load xlsx and build a worksheet from either visible columns or all.
// ─────────────────────────────────────────────────────────────────────────────
import type { ITableHeader, ITableItem } from "./ITable.types";

export async function exportToExcel(params: {
  headers: ITableHeader[];
  items: ITableItem[];
  sortedItems: ITableItem[];
  filename: string;
  onlyVisible: boolean;
  visibleColumns: string[];
  title: string;
}) {
  const XLSX = await import("xlsx");
  const source = params.onlyVisible ? params.sortedItems : params.items;
  const columnKeys = params.onlyVisible
    ? params.visibleColumns
    : params.headers.map((h) => h.value);

  const data = source.map((row) => {
    const r: Record<string, unknown> = {};
    columnKeys.forEach((key) => {
      const h = params.headers.find((x) => x.value === key);
      const caption = h?.caption || key;
      r[caption] = key
        .split(".")
        .reduce<any>((acc: any, part) => acc?.[part], row);
    });
    return r;
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, params.title || "Sheet1");
  XLSX.writeFile(wb, params.filename);
}
