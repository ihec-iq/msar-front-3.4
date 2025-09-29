<script setup lang="ts">
import { ref, nextTick } from "vue";

type PageSize = "A4" | "A5";
type Orientation = "portrait" | "landscape";

interface PrintOption {
  label: string;
  elementId: string;
}

const props = defineProps<{
  printOptions: PrintOption[];
  header?: string;
  footer?: string;
  defaultPageSize?: PageSize;
  defaultOrientation?: Orientation;
  defaultIncludeHeader?: boolean;
  defaultIncludeFooter?: boolean;
  defaultIncludePageNumbers?: boolean;
}>();

const selectedElementId = ref<string>("");
const includeHeader = ref(props.defaultIncludeHeader ?? true);
const includeFooter = ref(props.defaultIncludeFooter ?? true);
const includePageNumbers = ref(props.defaultIncludePageNumbers ?? true);
const pageSize = ref<PageSize>(props.defaultPageSize ?? "A4");
const orientation = ref<Orientation>(props.defaultOrientation ?? "portrait");

function getStylesHtml(): string {
  return Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((node) => (node as HTMLElement).outerHTML)
    .join("\n");
}

function buildPrintHtml(contentHtml: string, headerHtml?: string, footerHtml?: string) {
  const stylesHtml = getStylesHtml();
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
${stylesHtml}
<style>
  @page { size: ${pageSize.value} ${orientation.value}; margin: 15mm; }
  html, body { height: 100%; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: sans-serif; }
  .print-header { position: fixed; top: 0; left: 0; right: 0; text-align: center; padding: 8px 0; }
  .print-footer { position: fixed; bottom: 0; left: 0; right: 0; text-align: center; padding: 8px 0; }
  .print-content { margin-top: ${includeHeader.value && headerHtml ? "60px" : "0"}; margin-bottom: ${includeFooter.value && footerHtml ? "60px" : "0"}; }
  .page-break { page-break-after: always; }
  @media print {
    .page-counter::after { content: counter(page) " / " counter(pages); }
  }
</style>
</head>
<body>
  ${includeHeader.value && headerHtml ? `<div class="print-header">${headerHtml}</div>` : ""}
  <div class="print-content">${contentHtml}</div>
  ${includeFooter.value && footerHtml ? `<div class="print-footer">${footerHtml}${includePageNumbers.value ? ' — <span class="page-counter"></span>' : ""}</div>` : ""}
</body>
</html>`;
}

async function printWithIframe(elementId: string, override?: {
  header?: string; footer?: string;
  pageSize?: PageSize; orientation?: Orientation;
  includeHeader?: boolean; includeFooter?: boolean; includePageNumbers?: boolean;
}) {
  const target = document.getElementById(elementId);
  if (!target) {
    console.warn("PrintCombo: elementId غير موجود:", elementId);
    return;
  }

  // تطبيق Overrides إن وُجدت
  const old = {
    pageSize: pageSize.value, orientation: orientation.value,
    includeHeader: includeHeader.value, includeFooter: includeFooter.value, includePageNumbers: includePageNumbers.value,
  };
  if (override?.pageSize) pageSize.value = override.pageSize;
  if (override?.orientation) orientation.value = override.orientation;
  if (typeof override?.includeHeader === "boolean") includeHeader.value = override.includeHeader;
  if (typeof override?.includeFooter === "boolean") includeFooter.value = override.includeFooter;
  if (typeof override?.includePageNumbers === "boolean") includePageNumbers.value = override.includePageNumbers;

  const html = buildPrintHtml(target.innerHTML, override?.header ?? props.header, override?.footer ?? props.footer);

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const frameDoc = iframe.contentDocument;
  if (!frameDoc) {
    console.warn("PrintCombo: لا يمكن الوصول إلى مستند الـ iframe");
    document.body.removeChild(iframe);
    return;
  }

  frameDoc.open();
  frameDoc.write(html);
  frameDoc.close();

  await nextTick();

  const frameWin = iframe.contentWindow;
  if (!frameWin) {
    console.warn("PrintCombo: لا يمكن الوصول إلى نافذة الـ iframe");
    document.body.removeChild(iframe);
    return;
  }

  // طباعة بعد جاهزية التخطيط
  frameWin.focus();
  try {
    frameWin.onafterprint = () => {
      document.body.removeChild(iframe);
      // استرجاع الإعدادات القديمة
      pageSize.value = old.pageSize;
      orientation.value = old.orientation;
      includeHeader.value = old.includeHeader;
      includeFooter.value = old.includeFooter;
      includePageNumbers.value = old.includePageNumbers;
    };
    frameWin.print();
  } catch (e) {
    console.error("PrintCombo: فشل استدعاء print()", e);
    document.body.removeChild(iframe);
  }
}

function printSelected() {
  if (!selectedElementId.value) {
    console.warn("PrintCombo: اختر عنصرًا للطباعة أولًا");
    return;
  }
  void printWithIframe(selectedElementId.value);
}

// إتاحة استدعاء الطباعة من زر خارجي في الأب
defineExpose({
  printNow: (args?: {
    elementId?: string;
    header?: string; footer?: string;
    pageSize?: PageSize; orientation?: Orientation;
    includeHeader?: boolean; includeFooter?: boolean; includePageNumbers?: boolean;
  }) => {
    const id = args?.elementId ?? selectedElementId.value;
    if (!id) {
      console.warn("PrintCombo: elementId مفقود");
      return;
    }
    void printWithIframe(id, args);
  },
});
</script>

<template>
  <div class="print-combo">
    <label>اختر الجزء المراد طباعته:</label>
    <select v-model="selectedElementId">
      <option disabled value="">-- اختر --</option>
      <option v-for="option in printOptions" :key="option.elementId" :value="option.elementId">
        {{ option.label }}
      </option>
    </select>

    <div class="print-settings" style="margin-top:8px;">
      <label><input type="checkbox" v-model="includeHeader" /> طباعة الهيدر</label>
      <label><input type="checkbox" v-model="includeFooter" /> طباعة الفوتر</label>
      <label><input type="checkbox" v-model="includePageNumbers" /> ترقيم الصفحات</label>

      <div style="margin-top:6px;">
        <label>الحجم:</label>
        <select v-model="pageSize">
          <option value="A4">A4</option>
          <option value="A5">A5</option>
        </select>
        <label style="margin-left:8px;">الاتجاه:</label>
        <select v-model="orientation">
          <option value="portrait">طولي</option>
          <option value="landscape">عرضي</option>
        </select>
      </div>
    </div>

    <button :disabled="!selectedElementId" @click="printSelected" style="margin-top:10px;">
      طباعة
    </button>
  </div>
</template>
