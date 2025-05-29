
export interface ITableItem {
  [key: string]: any;
}
export interface ITableHeader {
  caption: string;
  value: any;
  visible?: boolean;
  sortable?: boolean;
  sortKey?: string;
  sortAsc?: boolean;
  print?: boolean; // Default: true
  width?: string;
}
