export interface ITableItem { [key: string]: unknown }


export interface ITableHeader {
caption: string
value: string // column key (supports dot.path)
visible?: boolean // default: true
sortable?: boolean // default: true
sortKey?: string // if provided, use this key for sorting
print?: boolean // default: true (set false to hide when printing)
width?: string // e.g. "160px" or "12rem"
align?: "left" | "center" | "right"
// Optional logical formatter when you do not want to use a slot
format?: (row: ITableItem, cellValue: unknown) => string | number | import('vue').VNode
}


export type RowKey = string | number


export interface SortState {
key: string
asc: boolean
}