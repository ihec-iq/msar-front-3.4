<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { Icon } from "@iconify/vue";

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
}>();

const selectedElementId = ref<string>("");
const includeHeader = ref(true);
const includeFooter = ref(true);
const includePageNumbers = ref(true);
const pageSize = ref<PageSize>("A4");
const orientation = ref<Orientation>("portrait");

const showSettings = ref(false);

// استرجاع الإعدادات من localStorage
onMounted(() => {
  const cached = localStorage.getItem("printComboSettings");
  if (cached) {
    const parsed = JSON.parse(cached);
    includeHeader.value = parsed.includeHeader;
    includeFooter.value = parsed.includeFooter;
    includePageNumbers.value = parsed.includePageNumbers;
    pageSize.value = parsed.pageSize;
    orientation.value = parsed.orientation;
    selectedElementId.value =
      parsed.selectedElementId || props.printOptions[0]?.elementId || "";
  } else {
    selectedElementId.value = props.printOptions[0]?.elementId || "";
  }
});

// حفظ الإعدادات
watch(
  [includeHeader, includeFooter, includePageNumbers, pageSize, orientation, selectedElementId],
  () => {
    localStorage.setItem(
      "printComboSettings",
      JSON.stringify({
        includeHeader: includeHeader.value,
        includeFooter: includeFooter.value,
        includePageNumbers: includePageNumbers.value,
        pageSize: pageSize.value,
        orientation: orientation.value,
        selectedElementId: selectedElementId.value,
      })
    );
  },
  { deep: true }
);

function getStylesHtml(): string {
  return Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((node) => (node as HTMLElement).outerHTML)
    .join("\n");
}
function measureHeight(html: string): number {
  const temp = document.createElement("div");
  temp.style.position = "absolute";
  temp.style.visibility = "hidden";
  temp.style.width = "100%";
  temp.innerHTML = html;
  document.body.appendChild(temp);
  const height = temp.offsetHeight;
  document.body.removeChild(temp);
  return height;
}

function buildPrintHtml(contentHtml: string, headerHtml?: string, footerHtml?: string) {
  const stylesHtml = getStylesHtml();

  const headerHeight = headerHtml && includeHeader.value ? measureHeight(headerHtml) : 0;
  const footerHeight = footerHtml && includeFooter.value ? measureHeight(footerHtml) : 0;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
${stylesHtml}
<style>
  @page { size: ${pageSize.value} ${orientation.value}; margin: 15mm; }
  body {
    font-family: sans-serif;
    margin:0;
    padding-top:${headerHeight}px;
    padding-bottom:${footerHeight}px;
  }
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    text-align: center;
    background: white;
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    background: white;
  }
  @media print {
    .page-counter::after { content: counter(page) " / " counter(pages); }
  }
</style>
</head>
<body>
  ${includeHeader.value && headerHtml ? `<div class="header">${headerHtml}</div>` : ""}
  ${contentHtml}
  ${
    includeFooter.value && footerHtml
      ? `<div class="footer">${footerHtml}${includePageNumbers.value ? ' — <span class="page-counter"></span>' : ""}</div>`
      : ""
  }
</body>
</html>`;
}



function printWithIframe(elementId: string) {
  const target = document.getElementById(elementId);
  if (!target) return;

  const html = buildPrintHtml(target.innerHTML, props.header, props.footer);

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const frameDoc = iframe.contentDocument;
  if (!frameDoc) return;

  frameDoc.open();
  frameDoc.write(html);
  frameDoc.close();

  iframe.onload = () => {
    const frameWin = iframe.contentWindow;
    if (frameWin) {
      frameWin.focus();
      setTimeout(() => {
        frameWin.print();
        document.body.removeChild(iframe);
      }, 300);
    }
  };
}

function printSelected() {
  if (!selectedElementId.value) {
    alert("اختر شيت للطباعة");
    return;
  }
  printWithIframe(selectedElementId.value);
}
</script>

<template>
  <div class="print-combo" style="display:flex; align-items:center; gap:8px; position:relative;">
    <!-- زر الطباعة -->
    <button
      @click="printSelected"
      style="background:#2563eb; color:white; border:none; padding:6px 14px; border-radius:6px; cursor:pointer;"
    >
      طباعة
    </button>

    <!-- زر الإعدادات -->
    <div style="position:relative;">
      <button
        @click="showSettings = !showSettings"
        style="background:#f3f4f6; border:1px solid #ccc; border-radius:6px; padding:6px; cursor:pointer;"
      >
        <Icon icon="mdi:dots-vertical" width="20" />
      </button>

      <!-- نافذة الإعدادات مع transition -->
      <transition name="fade-slide">
        <div
          v-if="showSettings"
          style="position:absolute; right:0; margin-top:4px; background:white; border:1px solid #ddd; border-radius:6px; padding:10px; box-shadow:0 2px 6px rgba(0,0,0,0.2); z-index:999; min-width:200px;"
        >
          <strong>الشيتات:</strong>
          <div v-for="option in props.printOptions" :key="option.elementId" style="margin:4px 0;">
            <label>
              <input type="radio" v-model="selectedElementId" :value="option.elementId" />
              {{ option.label }}
            </label>
          </div>

          <hr style="margin:8px 0;" />

          <label><input type="checkbox" v-model="includeHeader" /> طباعة الهيدر</label><br />
          <label><input type="checkbox" v-model="includeFooter" /> طباعة الفوتر</label><br />
          <label><input type="checkbox" v-model="includePageNumbers" /> ترقيم الصفحات</label><br />

          <div style="margin-top:8px;">
            <label>الحجم:</label>
            <select v-model="pageSize" style="width:100%;">
              <option value="A4">A4</option>
              <option value="A5">A5</option>
            </select>
          </div>

          <div style="margin-top:8px;">
            <label>الاتجاه:</label>
            <select v-model="orientation" style="width:100%;">
              <option value="portrait">طولي</option>
              <option value="landscape">عرضي</option>
            </select>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-5px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
