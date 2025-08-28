<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue';

type GenericItem = Record<string, any>;
type FetchResult = { items: GenericItem[]; nextPage?: number | null };

// Helpers
function getByPath(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}
function includesCaseInsensitive(hay: string, needle: string) {
  return hay.toLowerCase().includes(needle.toLowerCase());
}

const props = withDefaults(
  defineProps<{
    modelValue?: GenericItem | null;
    options?: GenericItem[];                           // بيانات أساسية من الخارج
    trackBy: string;
    labelKey?: string;                                 // يدعم dot-path: Item.name
    placeholder?: string;
    searchPlaceholder?: string;
    async?: boolean;                                   // إن false: فلترة محليّة من options
    fetchFunction?: (query: string, page?: number) => Promise<FetchResult>;
    debounceMs?: number;
    dialogTitle?: string;
    noResultsText?: string;
    loadingText?: string;
    disabled?: boolean;
    teleportTo?: string;
    clearable?: boolean;
    showSearchButton?: boolean;
    dialogZIndex?: number;                             // علو الدايـلوك
  }>(),
  {
    modelValue: null,
    options: () => [],
    labelKey: 'name',
    placeholder: 'اختر عنصرًا',
    searchPlaceholder: 'ابحث هنا...',
    async: true,
    debounceMs: 300,
    dialogTitle: 'البحث',
    noResultsText: 'لا توجد نتائج مطابقة',
    loadingText: 'جاري التحميل...',
    disabled: false,
    teleportTo: 'body',
    clearable: true,
    showSearchButton: true,
    dialogZIndex: 9999,
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: GenericItem | null): void;
  (e: 'open'): void;
  (e: 'close'): void;
  (e: 'error', message: string): void;
  (e: 'search', query: string): void;
  (e: 'select', item: GenericItem): void;
  (e: 'clear'): void;
}>();

// حالة المكوّن
const isDialogOpen = ref(false);
const searchQuery = ref('');
const searchResults = ref<GenericItem[]>([]);
const isLoading = ref(false);
const isFetchingMore = ref(false);
const hasError = ref(false);
const errorMessage = ref('');
const nextPageNumber = ref<number | null>(null);
const highlightedIndex = ref(-1);

// DOM
const resultsContainerElement = ref<HTMLElement | null>(null);
const searchInputElement = ref<HTMLInputElement | null>(null);

// تايمر
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

// اللابل المعروض
const selectedLabel = computed(() => {
  if (!props.modelValue) return '';
  const val = getByPath(props.modelValue, props.labelKey);
  return val != null ? String(val) : '';
});

// فتح/إغلاق
function openDialog() {
  if (props.disabled) return;
  isDialogOpen.value = true;
  emit('open');
  document.documentElement.style.overflow = 'hidden';
  searchQuery.value = '';
  nextTick(() => {
    searchInputElement.value?.focus();
    searchInputElement.value?.select();
  });
  // أول فتح: إما نجيب من السيرفر أو نظهر options
  runSearch('');
}

function closeDialog() {
  isDialogOpen.value = false;
  emit('close');
  document.documentElement.style.overflow = '';
  highlightedIndex.value = -1;
}

// فلترة محلية من options
function runLocalFilter(query: string) {
  const q = query.trim();
  if (!q) {
    searchResults.value = [...(props.options || [])];
  } else {
    searchResults.value = (props.options || []).filter((item) => {
      const label = String(getByPath(item, props.labelKey) ?? '');
      // فلترة بسيطة على اللابل (تقدر توسعها لاحقًا)
      return includesCaseInsensitive(label, q);
    });
  }
  nextPageNumber.value = null;
  hasError.value = false;
  errorMessage.value = '';
}

// تغيير نص البحث مع Debounce
function onSearchInputChanged() {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    runSearch(searchQuery.value.trim());
  }, props.debounceMs);
}

// تنفيذ البحث (شبكي أو محلي)
async function runSearch(query: string) {
  emit('search', query);
  highlightedIndex.value = -1;

  // إذا async=false أو ماكو fetchFunction → فلترة محلية
  if (!props.async || typeof props.fetchFunction !== 'function') {
    isLoading.value = false;
    runLocalFilter(query);
    return;
  }

  // بحث شبكي
  try {
    isLoading.value = true;
    hasError.value = false;
    errorMessage.value = '';
    nextPageNumber.value = null;

    const result = await props.fetchFunction(query, 1);
    console.log(result)
    searchResults.value = Array.isArray(result.items) ? result.items : [];
    nextPageNumber.value = result.nextPage ?? null;
  } catch (err: any) {
    hasError.value = true;
    errorMessage.value = err?.message || 'تعذّر جلب النتائج';
    emit('error', errorMessage.value);
    searchResults.value = [];
    nextPageNumber.value = null;
  } finally {
    isLoading.value = false;
  }
}

// تحميل المزيد (شبكي فقط)
async function fetchNextPage() {
  if (!nextPageNumber.value || isFetchingMore.value) return;
  if (!props.async || typeof props.fetchFunction !== 'function') return;
  isFetchingMore.value = true;
  try {
    const result = await props.fetchFunction(searchQuery.value.trim(), nextPageNumber.value);
    const newItems = Array.isArray(result.items) ? result.items : [];
    searchResults.value = [...searchResults.value, ...newItems];
    nextPageNumber.value = result.nextPage ?? null;
  } catch (err: any) {
    emit('error', err?.message || 'تعذّر تحميل المزيد');
  } finally {
    isFetchingMore.value = false;
  }
}

// Scroll near end → load more
function onResultsScroll() {
  const el = resultsContainerElement.value;
  if (!el || isLoading.value || isFetchingMore.value) return;
  const threshold = 120;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - threshold) {
    fetchNextPage();
  }
}

// اختيار عنصر
function selectItem(item: GenericItem) {
  emit('update:modelValue', item);
  emit('select', item);
  closeDialog();
}

// مسح
function clearSelection() {
  emit('update:modelValue', null);
  emit('clear');
}

// كيبورد
function onDialogKeydown(event: KeyboardEvent) {
  if (!isDialogOpen.value) return;
  const total = searchResults.value.length;

  if (event.key === 'Escape') {
    event.preventDefault();
    closeDialog();
    return;
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (total === 0) return;
    highlightedIndex.value = (highlightedIndex.value + 1) % total;
    scrollHighlightedIntoView();
    return;
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (total === 0) return;
    highlightedIndex.value = (highlightedIndex.value - 1 + total) % total;
    scrollHighlightedIntoView();
    return;
  }
  if (event.key === 'Enter') {
    if (highlightedIndex.value >= 0 && highlightedIndex.value < total) {
      event.preventDefault();
      selectItem(searchResults.value[highlightedIndex.value]);
    }
  }
}

function scrollHighlightedIntoView() {
  const el = resultsContainerElement.value;
  if (!el) return;
  const items = el.querySelectorAll<HTMLElement>('[data-result-item="true"]');
  if (highlightedIndex.value >= 0 && highlightedIndex.value < items.length) {
    const node = items[highlightedIndex.value];
    const nodeTop = node.offsetTop;
    const nodeBottom = nodeTop + node.offsetHeight;
    if (nodeTop < el.scrollTop) {
      el.scrollTop = nodeTop;
    } else if (nodeBottom > el.scrollTop + el.clientHeight) {
      el.scrollTop = nodeBottom - el.clientHeight;
    }
  }
}

// لو تغيّرت options من خارج، نحدّث النتائج لو الدايـلوك مفتوح
watch(
  () => props.options,
  () => {
    if (isDialogOpen.value && (!props.async || typeof props.fetchFunction !== 'function')) {
      runLocalFilter(searchQuery.value);
    }
  },
  { deep: true }
);

// إدارة الاستماع
watch(isDialogOpen, (open) => {
  if (open) {
    window.addEventListener('keydown', onDialogKeydown);
  } else {
    window.removeEventListener('keydown', onDialogKeydown);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onDialogKeydown);
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
});
</script>

<template>
  <div class="combo-search">
    <!-- الحقل الأساسي -->
    <div class="input-wrapper" :class="{ disabled: disabled }">
      <slot name="leading"></slot>

      <input
        class="display-input"
        :placeholder="placeholder"
        :value="selectedLabel"
        readonly
        :aria-label="placeholder"
      />

      <div class="actions">
        <button
          v-if="clearable && modelValue"
          type="button"
          class="clear-button"
          aria-label="مسح الاختيار"
          @click="clearSelection"
        >
          ×
        </button>

        <button
          v-if="showSearchButton"
          type="button"
          class="search-button"
          :disabled="disabled"
          @click="openDialog"
        >
          بحث
        </button>
      </div>

      <slot name="trailing"></slot>
    </div>

    <!-- الدايـلوك فل سكرين (أعلى كل شي) -->
    <teleport :to="teleportTo">
      <transition name="fade">
        <div
          v-if="isDialogOpen"
          class="dialog-overlay"
          @click.self="closeDialog"
          :style="{ zIndex: String(dialogZIndex) }"
        >
          <div class="dialog-container" role="dialog" aria-modal="true">
            <header class="dialog-header">
              <div class="dialog-title">{{ dialogTitle }}</div>
              <button class="dialog-close" aria-label="إغلاق" @click="closeDialog">✕</button>
            </header>

            <div class="dialog-body">
              <div class="search-input-row">
                <input
                  ref="searchInputElement"
                  v-model="searchQuery"
                  :placeholder="searchPlaceholder"
                  class="search-input"
                  type="text"
                  @input="onSearchInputChanged"
                />
                <button class="search-refresh" @click="runSearch(searchQuery.trim())">بحث</button>
              </div>

              <div
                ref="resultsContainerElement"
                class="results-list"
                @scroll.passive="onResultsScroll"
              >
                <div v-if="isLoading" class="loading-state">
                  <span class="spinner" aria-hidden="true"></span>
                  <span class="loading-text">{{ loadingText }}</span>
                </div>

                <div v-else-if="hasError" class="error-state">
                  <div class="error-text">{{ errorMessage }}</div>
                  <button class="retry-button" @click="runSearch(searchQuery.trim())">
                    إعادة المحاولة
                  </button>
                </div>

                <template v-else>
                  <template v-if="searchResults.length === 0">
                    <slot name="empty">
                      <div class="empty-state">{{ noResultsText }}</div>
                    </slot>
                  </template>

                  <ul v-else class="items">
                    <li
                      v-for="(item, index) in searchResults"
                      :key="item[trackBy] ?? index"
                      class="item"
                      :class="{ highlighted: index === highlightedIndex }"
                      data-result-item="true"
                      @mouseenter="highlightedIndex = index"
                      @mouseleave="highlightedIndex = -1"
                      @click="selectItem(item)"
                    >
                      <slot name="item" :item="item">
                        <div class="item-default">
                          <div class="item-label">
                            {{ getByPath(item, labelKey) ?? '—' }}
                          </div>
                          <div class="item-sub" v-if="item[trackBy]">#{{ item[trackBy] }}</div>
                        </div>
                      </slot>
                    </li>
                  </ul>

                  <div v-if="isFetchingMore" class="loading-more">
                    <span class="spinner" aria-hidden="true"></span>
                    <span>تحميل المزيد...</span>
                  </div>

                  <slot name="footer"></slot>
                </template>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style scoped>
.combo-search { display: block; width: 100%; }

/* الإنبت الرئيسي */
.input-wrapper {
  display: flex; align-items: center; gap: 8px;
  border: 1px solid var(--cs-border, #cfcfcf);
  border-radius: 10px; padding: 8px 10px; background: var(--cs-bg, #fff);
}
.input-wrapper.disabled { opacity: 0.6; pointer-events: none; }
.display-input { flex: 1; border: none; outline: none; background: transparent; font-size: 14px; }
.actions { display: flex; gap: 6px; }
.search-button, .clear-button, .search-refresh, .retry-button, .dialog-close {
  border: 1px solid #d0d0d0; background: #f9f9f9; padding: 6px 10px; border-radius: 8px; cursor: pointer;
}
.search-button:hover, .search-refresh:hover, .retry-button:hover, .dialog-close:hover { background: #f1f1f1; }

/* الدايـلوك */
.dialog-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.40); display: flex; }
.dialog-container { background: #fff; width: 100%; height: 100%; display: flex; flex-direction: column; }
.dialog-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border-bottom: 1px solid #eee; }
.dialog-title { font-weight: 600; font-size: 16px; }
.dialog-body { flex: 1; display: flex; flex-direction: column; gap: 12px; padding: 12px; min-height: 0; }
.search-input-row { display: flex; gap: 8px; }
.search-input { flex: 1; border: 1px solid #ddd; border-radius: 10px; padding: 10px 12px; font-size: 14px; }
.results-list { flex: 1; overflow: auto; border: 1px solid #eee; border-radius: 10px; padding: 8px; background: #fff; }

.loading-state, .error-state, .empty-state, .loading-more {
  display: flex; align-items: center; justify-content: center; padding: 16px; color: #666; gap: 8px;
}

.items { list-style: none; margin: 0; padding: 0; }
.item { padding: 10px 12px; border-radius: 8px; cursor: pointer; }
.item:hover, .item.highlighted { background: #f5f7ff; }

.item-default { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.item-label { font-size: 14px; }
.item-sub { font-size: 12px; color: #999; }

.spinner { width: 16px; height: 16px; border: 2px solid #ccc; border-top-color: #777; border-radius: 50%; display: inline-block; animation: spin 1s linear infinite; }
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
