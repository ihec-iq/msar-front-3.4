<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import { Icon } from "@iconify/vue";
import { useLocalStorage } from "@/compositions/uselocalStorage";

type PageSize = "A4" | "A5";
type Orientation = "portrait" | "landscape";
type FooterAlign = "left" | "center" | "right";

interface PrintOption {
  label: string;
  elementId: string;
}

const props = defineProps<{
  printOptions: PrintOption[];
  headerHtml?: string;
  pageFooterHtml?: string;
  reportFooterHtml?: string;
  reportFooterNewPage?: boolean;
  footerAlign?: FooterAlign;
  defaultPageSize?: PageSize;
  defaultOrientation?: Orientation;
  defaultMarginMm?: number;
}>();

/* الحالة */
const selectedElementId = ref<string>("");
const includeHeader = ref(true);
const includePageFooter = ref(true);
const includePageNumbers = ref(true);
const pageSize = ref<PageSize>(props.defaultPageSize ?? "A4");
const orientation = ref<Orientation>(props.defaultOrientation ?? "portrait");
const marginMm = ref<number>(props.defaultMarginMm ?? 15);
const footerAlign = ref<FooterAlign>(props.footerAlign ?? "center");
const showSettings = ref(false);

/* أول شيت + استرجاع الإعدادات */
onMounted(() => {
  selectedElementId.value = props.printOptions[0]?.elementId || "";
});

/* حفظ الإعدادات */
watch(
  [includeHeader, includePageFooter, includePageNumbers, pageSize, orientation, footerAlign, marginMm, selectedElementId],
  () => {
    useLocalStorage().set({
      key: "printComboSettings",   
      value: JSON.stringify({
        includeHeader: includeHeader.value,
        includePageFooter: includePageFooter.value,
        includePageNumbers: includePageNumbers.value,
        pageSize: pageSize.value,
        orientation: orientation.value,
        footerAlign: footerAlign.value,
        marginMm: marginMm.value,
        selectedElementId: selectedElementId.value,
      }),
      withEncrypt: false,
    });
  }
);

/* الأدوات */
const PX_PER_MM = 96 / 25.4;
const mmToPx = (mm: number) => Math.round(mm * PX_PER_MM);

function pagePixelSize(): { width: number; height: number } {
  const mmMap: Record<PageSize, { w: number; h: number }> = {
    A4: { w: 210, h: 297 },
    A5: { w: 148, h: 210 },
  };
  const m = mmMap[pageSize.value];
  const wmm = orientation.value === "portrait" ? m.w : m.h;
  const hmm = orientation.value === "portrait" ? m.h : m.w;
  return { width: mmToPx(wmm), height: mmToPx(hmm) };
}

function copyStyles(): string {
  return Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((n) => (n as HTMLElement).outerHTML)
    .join("\n");
}

/* تقسيم الجدول صفاً صفاً */
function splitTable(tableEl: HTMLTableElement, maxRows: number): string[] {
  const thead = tableEl.tHead ? tableEl.tHead.outerHTML : "";
  const rows = Array.from(tableEl.tBodies).flatMap(tb => Array.from(tb.rows));
  const chunks: string[] = [];

  for (let i = 0; i < rows.length; i += maxRows) {
    const slice = rows.slice(i, i + maxRows).map(r => r.outerHTML).join("");
    chunks.push(`<table border="1" style="border-collapse:collapse;width:100%;">${thead}<tbody>${slice}</tbody></table>`);
  }
  return chunks;
}

/* Auto paginate */
function autoPaginate(sourceEl: HTMLElement): string[] {
  const pages: string[] = [];
  const tables = Array.from(sourceEl.querySelectorAll("table"));

  if (tables.length) {
    tables.forEach(table => {
      const parts = splitTable(table, 25); // 25 صف لكل صفحة A4 تقريباً
      parts.forEach(p => pages.push(p));
    });
  } else {
    pages.push(sourceEl.innerHTML);
  }

  return pages;
}

/* تغليف صفحة */
function wrapPage(contentHtml: string, pageNum: number, total: number): string {
  return `<section class="pg">
    ${includeHeader.value && props.headerHtml ? `<header class="pg-h">${props.headerHtml}</header>` : ""}
    <main class="pg-c">${contentHtml}</main>
    ${includePageFooter.value && props.pageFooterHtml ? `
      <footer class="pg-f" style="text-align:${footerAlign.value}">
        ${props.pageFooterHtml}${includePageNumbers.value ? ` — صفحة ${pageNum} / ${total}` : ""}
      </footer>` : ""}
  </section>`;
}

/* بناء مستند الطباعة */
function buildPrintDoc(pages: string[], total: number) {
  const styles = copyStyles();
  const body = pages.map((p, i) => wrapPage(p, i + 1, total)).join(`<div class="break"></div>`);

  const reportFooter = props.reportFooterHtml
    ? (props.reportFooterNewPage ? `<div class="break"></div>` : "") +
    `<div class="report-footer" style="text-align:${footerAlign.value}">${props.reportFooterHtml}</div>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
${styles}
<style>
  @page { size: ${pageSize.value} ${orientation.value}; margin: ${marginMm.value}mm; }
  body { font-family: sans-serif; margin:0; padding:0; }
  .break { page-break-after: always; }
  .pg { display: grid; grid-template-rows: auto 1fr auto; min-height:100%; }
  .pg-h { border-bottom:1px solid #ccc; padding:6px 0; text-align:center; }
  .pg-c { }
  .pg-f { border-top:1px solid #ccc; padding:6px 0; font-size:12px; }
  .report-footer { border-top:2px solid #000; padding:10px; font-weight:bold; margin-top:12px; }
</style>
</head>
<body>
${body}
${reportFooter}
</body>
</html>`;
}

/* طباعة */
async function printSelected() {
  if (!selectedElementId.value) return;
  const src = document.getElementById(selectedElementId.value);
  if (!src) return;

  await nextTick();
  const pages = autoPaginate(src);
  const html = buildPrintDoc(pages, pages.length);

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.width = "0"; iframe.style.height = "0"; iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) return;
  doc.open(); doc.write(html); doc.close();

  iframe.onload = () => {
    const w = iframe.contentWindow;
    if (w) {
      w.focus();
      setTimeout(() => { w.print(); document.body.removeChild(iframe); }, 300);
    }
  };
}
</script>

<template>
  <div style="display:flex; align-items:center; gap:8px; position:relative;">
    <button @click="printSelected"
      style="background:#2563eb; color:white; border:none; padding:6px 14px; border-radius:6px; cursor:pointer;">
      طباعة
    </button>

    <div style="position:relative;">
      <button @click="showSettings = !showSettings"
        style="background:#f3f4f6; border:1px solid #ccc; border-radius:6px; padding:6px; cursor:pointer;">
        <Icon icon="mdi:dots-vertical" width="20" />
      </button>

      <transition name="fade-slide">
        <div v-if="showSettings"
          style="position:absolute; right:0; margin-top:4px; background:#fff; border:1px solid #ddd; border-radius:8px; padding:10px; box-shadow:0 2px 6px rgba(0,0,0,.2); z-index:999; min-width:240px;">
          <strong>الشيتات</strong>
          <div v-for="opt in props.printOptions" :key="opt.elementId" style="margin:6px 0;">
            <label><input type="radio" v-model="selectedElementId" :value="opt.elementId" /> {{ opt.label }}</label>
          </div>

          <hr style="margin:8px 0;" />
          <label><input type="checkbox" v-model="includeHeader" /> هيدر</label><br />
          <label><input type="checkbox" v-model="includePageFooter" /> فوتر الصفحة</label><br />
          <label><input type="checkbox" v-model="includePageNumbers" /> ترقيم</label><br />

          <div style="margin-top:8px;">
            <label>محاذاة الفوتر:</label>
            <select v-model="footerAlign" style="width:100%;">
              <option value="left">يسار</option>
              <option value="center">وسط</option>
              <option value="right">يمين</option>
            </select>
          </div>

          <div style="margin-top:8px; display:flex; gap:6px;">
            <div style="flex:1">
              <label>الحجم:</label>
              <select v-model="pageSize" style="width:100%;">
                <option value="A4">A4</option>
                <option value="A5">A5</option>
              </select>
            </div>
            <div style="flex:1">
              <label>الاتجاه:</label>
              <select v-model="orientation" style="width:100%;">
                <option value="portrait">طولي</option>
                <option value="landscape">عرضي</option>
              </select>
            </div>
          </div>

          <div style="margin-top:8px;">
            <label>الهامش (mm):</label>
            <input type="number" v-model.number="marginMm" min="5" max="30" style="width:100%;" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all .2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
