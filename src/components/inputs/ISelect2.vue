<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, type PropType } from 'vue';
import axios, { CancelTokenSource } from 'axios';

// Props
const props = defineProps({
  modelValue: {
    type: Object as PropType<Record<string, any> | null>,
    required: true,
  },
  labelKey: {
    type: String,
    default: 'name',
  },
  trackBy: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: 'اختر عنصرًا',
  },
  noResultsText: {
    type: String,
    default: 'لا توجد نتائج مطابقة',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  async: {
    type: Boolean,
    default: false,
  },
  fetchFunction: {
    type: Function as PropType<(query: string) => Promise<Record<string, any>[]>>,
    required: false,
  },
});

const emit = defineEmits(['update:modelValue']);

// State
const isOpen = ref(false);
const inputTerm = ref('');
const filteredOptions = ref<Record<string, any>[]>([]);
const loading = ref(false);
const selectContainer = ref<HTMLDivElement | null>(null);
const highlightedIndex = ref(-1);
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
let cancelToken: CancelTokenSource | null = null;

// Helpers
const resolveNestedProperty = (obj: Record<string, any>, path: string): any => {
  try {
    return path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : null), obj);
  } catch {
    return null;
  }
};

// Fetch async results
const fetchAsyncResults = async (query: string) => {
  if (!props.fetchFunction) return;

  if (cancelToken) cancelToken.cancel();
  cancelToken = axios.CancelToken.source();
  loading.value = true;

  try {
    const results = await props.fetchFunction(query);
    // Vue reactive safe update
    filteredOptions.value.splice(0, filteredOptions.value.length, ...(results || []));
  } catch (err) {
    if (!axios.isCancel(err)) {
      console.error('API Error:', err);
      filteredOptions.value = [];
    }
  } finally {
    loading.value = false;
  }
};

// Watch inputTerm with debounce
watch(inputTerm, (val) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(async () => {
    if (props.async && props.fetchFunction) {
      await fetchAsyncResults(val);
    }
  }, 300);
});

// Input
const handleInput = () => {
  if (!isOpen.value) openDropdown();
};

// Actions
const openDropdown = () => {
  if (props.disabled) return;
  isOpen.value = true;
  highlightedIndex.value = -1;
};

const closeDropdown = () => {
  isOpen.value = false;
  highlightedIndex.value = -1;
};

const selectOption = (option: Record<string, any>) => {
  emit('update:modelValue', option);
  inputTerm.value = resolveNestedProperty(option, props.labelKey) || '';
  closeDropdown();
};

const clearSelection = () => {
  emit('update:modelValue', null);
  inputTerm.value = '';
};

// Keyboard
const highlightNext = () => {
  if (highlightedIndex.value < filteredOptions.value.length - 1) highlightedIndex.value++;
};

const highlightPrevious = () => {
  if (highlightedIndex.value > 0) highlightedIndex.value--;
};

const selectHighlighted = () => {
  if (highlightedIndex.value >= 0) {
    selectOption(filteredOptions.value[highlightedIndex.value]);
  }
};

// Outside Click
const handleClickOutside = (event: MouseEvent) => {
  if (selectContainer.value && !selectContainer.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

watch(isOpen, (val) => {
  if (!val && props.modelValue) {
    inputTerm.value = resolveNestedProperty(props.modelValue, props.labelKey) || '';
  }
});
</script>

<template>
  <div class="relative w-full" ref="selectContainer">
    <div class="relative">
      <input
        type="text"
        v-model="inputTerm"
        @input="handleInput"
        @focus="openDropdown"
        @keydown.down.prevent="highlightNext"
        @keydown.up.prevent="highlightPrevious"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.esc="closeDropdown"
        :placeholder="placeholder"
        :disabled="disabled"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="isOpen ? 'true' : 'false'"
        aria-haspopup="listbox"
        :aria-activedescendant="highlightedIndex >= 0 && filteredOptions.length > 0 ? `option-${highlightedIndex}` : undefined"
        class="w-full px-4 py-2 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <button
        v-if="modelValue"
        @click.stop="clearSelection"
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3 group"
        aria-label="Clear selection"
      >
        <svg
          class="w-5 h-5 text-gray-400 group-hover:text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Dropdown -->
    <ul
      v-if="isOpen && (loading || filteredOptions.length > 0 || inputTerm)"
      class="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg max-h-60"
      role="listbox"
    >
      <li v-if="loading" class="px-4 py-2 text-gray-500 text-center select-none">
        جاري التحميل...
      </li>

      <template v-if="filteredOptions.length > 0">
        <li
          v-for="(option, index) in filteredOptions"
          :key="resolveNestedProperty(option, trackBy)"
          :id="`option-${index}`"
          role="option"
          :class="[
            'px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white',
            { 'bg-blue-500 text-white': index === highlightedIndex },
          ]"
          @click="selectOption(option)"
        >
          <slot name="item" :option="option">
            {{ resolveNestedProperty(option, labelKey) }}
          </slot>
        </li>
      </template>

      <li
        v-else-if="!loading && inputTerm"
        class="px-4 py-2 text-gray-500 text-center select-none"
      >
        {{ noResultsText }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Custom styling */
</style>
