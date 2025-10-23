// ─────────────────────────────────────────────────────────────────────────────
// File: usePrintTable.ts
// Print helper that removes columns with print:false before printing.
// ─────────────────────────────────────────────────────────────────────────────
import type { ITableHeader } from './ITable.types'

export async function printTable(hostId: string, headers: ITableHeader[], opts: { showRowNumber: boolean, selectable: boolean, title?: string, caption?: string }) {
  const host = document.getElementById(hostId)
  if (!host) return
  const clone = host.cloneNode(true) as HTMLElement

  const hiddenIdx: number[] = []
  headers.forEach((h, i) => {
    if (h.print === false) hiddenIdx.push(i + (opts.showRowNumber ? 1 : 0) + (opts.selectable ? 1 : 0))
  })

  const headerRow = clone.querySelector('thead tr')
  if (headerRow) [...hiddenIdx].reverse().forEach(i => headerRow.children[i]?.remove())
  const bodyRows = clone.querySelectorAll('tbody tr')
  bodyRows.forEach(r => [...hiddenIdx].reverse().forEach(i => r.children[i]?.remove()))

  const popup = window.open('', '_blank')
  if (!popup) return
  popup.document.write(`<!doctype html><html><head><title>${opts.title || 'Table'}</title>
    <style>
      body{font-family:Arial,sans-serif;margin:20px}
      .print-caption{text-align:center;font-weight:700;margin-bottom:12px}
      table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #333;padding:8px;text-align:left}
      th{background:#f5f5f5}
      tr:nth-child(even){background:#fafafa}
      @media print{body{margin:0}}
    </style></head><body>
    ${opts.caption || opts.title ? `<div class="print-caption">${opts.caption || opts.title}</div>` : ''}
    ${clone.outerHTML}
  </body></html>`)
  popup.document.close()
  popup.focus()
  setTimeout(() => { popup.print(); popup.close() }, 200)
}