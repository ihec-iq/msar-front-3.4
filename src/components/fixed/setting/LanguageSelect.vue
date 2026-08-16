<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { Icon } from "@iconify/vue";
import { Languages, setLocale, currentLocale } from "@/utilities/I18nPlugin";
import type { ILanguage } from "@/stores/i18n/useI18n";

// فتح/إغلاق
const open = ref(false);
const btnRef = ref<HTMLButtonElement | null>(null);
const panelRef = ref<HTMLDivElement | null>(null);

const toggle = async () => {
  open.value = !open.value;
  await nextTick();
  if (open.value) panelRef.value?.focus();
};

const close = () => (open.value = false);

// إغلاق عند الضغط خارج العنصر
const onDocClick = (e: MouseEvent) => {
  const t = e.target as Node;
  if (!btnRef.value || !panelRef.value) return;
  if (btnRef.value.contains(t) || panelRef.value.contains(t)) return;
  close();
};

// إغلاق بـ Escape
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") close();
};

onMounted(() => {
  document.addEventListener("click", onDocClick);
  document.addEventListener("keydown", onKeydown);
});
onUnmounted(() => {
  document.removeEventListener("click", onDocClick);
  document.removeEventListener("keydown", onKeydown);
});

// اختيار لغة
const choose = (lang: ILanguage) => {
  setLocale(lang);
  close();
};

// مساعد لتمييز المختار
const isActive = (code: string) => code === currentLocale.value.code;
</script>

<template>
  <div class="relative inline-block text-left">
    <!-- الزر -->
    <button
      ref="btnRef"
      type="button"
      @click="toggle"
      class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-sky-400/70 bg-white dark:bg-[#2e3145] text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#373b54] transition"
      aria-haspopup="listbox"
      :aria-expanded="open"
    >
      <Icon icon="mdi:web" class="text-lg" />
      <span class="text-sm font-medium">{{ currentLocale.name }}</span>
      <Icon
        :icon="open ? 'mdi:chevron-up' : 'mdi:chevron-down'"
        class="text-xl opacity-80"
      />
    </button>

    <!-- اللوحة -->
    <div
      v-show="open"
      ref="panelRef"
      tabindex="-1"
      class="absolute z-[1000] mt-2 min-w-[10rem] max-h-72 overflow-auto rounded-xl bg-white dark:bg-[#2e3145] shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-1 ltr:right-0 rtl:left-0"
      role="listbox"
    >
      <button
        v-for="lang in Languages"
        :key="lang.code"
        @click="choose(lang)"
        role="option"
        :aria-selected="isActive(lang.code)"
        class="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100/80 dark:hover:bg-white/10 transition"
        :class="isActive(lang.code) ? 'bg-sky-100/70 dark:bg-white/10' : ''"
      >
        <div class="flex items-center gap-2">
          <Icon icon="mdi:translate" class="opacity-70" />
          <span class="font-medium">{{ lang.name }}</span>
        </div>

        <!-- علامة اختيار -->
        <Icon
          v-if="isActive(lang.code)"
          icon="mdi:check-circle"
          class="text-sky-600 dark:text-sky-400 text-lg"
        />
      </button>
    </div>
  </div>
</template>
