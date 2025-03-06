<script setup lang="ts">
import { onMounted, ref, onUnmounted, computed, watch } from "vue";
const modelValue = defineModel<any>();
const emits = defineEmits<{
  (e: "onChange"): void;
  (e: "onFocus"): void;
  (e: "onBlur"): void;
}>();
const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
  options: { type: Array<any>, required: true },
  IsRequire: { type: Boolean, default: false },
  IsDisabled: { type: Boolean, default: false },
  autoFocus: { type: Boolean, default: false },
});

const containerRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLDivElement | null>(null);
const dropdownOpen = ref(false);
const hasFocus = ref(false);
const wasTabbed = ref(false);
const highlightedIndex = ref(-1);
const optionRefs = ref<HTMLElement[]>([]);

// Selected option display text
const selectedText = computed(() => {
  if (!modelValue.value) return '';
  const selected = props.options.find(opt => opt.id === modelValue.value);
  return selected ? selected.name : '';
});

// Initialize option highlighting when dropdown opens
watch(dropdownOpen, (isOpen) => {
  if (isOpen) {
    // Find the currently selected option index
    const selectedIndex = props.options.findIndex(opt => opt.id === modelValue.value);
    highlightedIndex.value = selectedIndex >= 0 ? selectedIndex : 0;
    
    // Wait for DOM update, then scroll to highlighted option
    setTimeout(() => {
      if (highlightedIndex.value >= 0 && optionRefs.value[highlightedIndex.value]) {
        optionRefs.value[highlightedIndex.value].scrollIntoView({ block: 'nearest' });
      }
    }, 0);
  }
});

// Handle document key events
const handleDocumentKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Tab') {
    wasTabbed.value = true;
    // Clear flag after a short delay
    setTimeout(() => {
      wasTabbed.value = false;
    }, 200);
  }
};

// Handle key navigation within the component
const handleKeyDown = (e: KeyboardEvent) => {
  if (props.IsDisabled) return;
  
  switch (e.key) {
    case 'Escape':
      if (dropdownOpen.value) {
        e.preventDefault();
        dropdownOpen.value = false;
        inputRef.value?.focus();
      }
      break;
    
    case 'Enter':
      if (dropdownOpen.value && highlightedIndex.value >= 0) {
        e.preventDefault();
        // Select the currently highlighted option
        selectOption(props.options[highlightedIndex.value]);
      } else {
        e.preventDefault();
        // Open dropdown if closed
        dropdownOpen.value = true;
      }
      break;
    
    case ' ': // Space key
      if (!dropdownOpen.value) {
        e.preventDefault();
        dropdownOpen.value = true;
      }
      break;
    
    case 'ArrowDown':
      e.preventDefault();
      if (dropdownOpen.value) {
        // Move highlight down
        highlightedIndex.value = Math.min(highlightedIndex.value + 1, props.options.length - 1);
        
        // Scroll to highlighted option if needed
        if (optionRefs.value[highlightedIndex.value]) {
          optionRefs.value[highlightedIndex.value].scrollIntoView({ block: 'nearest' });
        }
      } else {
        // Open dropdown if closed
        dropdownOpen.value = true;
      }
      break;
    
    case 'ArrowUp':
      e.preventDefault();
      if (dropdownOpen.value) {
        // Move highlight up
        highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0);
        
        // Scroll to highlighted option if needed
        if (optionRefs.value[highlightedIndex.value]) {
          optionRefs.value[highlightedIndex.value].scrollIntoView({ block: 'nearest' });
        }
      } else {
        // Open dropdown if closed
        dropdownOpen.value = true;
      }
      break;
  }
};

// Store option element references
const setOptionRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    optionRefs.value[index] = el;
  }
};

// Handle focus event
const handleFocus = () => {
  hasFocus.value = true;
  emits("onFocus");
  
  // If focus happened via Tab key, open dropdown automatically
  if (wasTabbed.value) {
    dropdownOpen.value = true;
    wasTabbed.value = false;
  }
};

// Handle blur event
const handleBlur = (e: FocusEvent) => {
  // Don't close dropdown if focus moved to dropdown options
  if (containerRef.value?.contains(e.relatedTarget as Node)) {
    return;
  }
  
  hasFocus.value = false;
  dropdownOpen.value = false;
  emits("onBlur");
  checkRequired();
};

// Toggle dropdown
const toggleDropdown = () => {
  if (!props.IsDisabled) {
    dropdownOpen.value = !dropdownOpen.value;
  }
};

// Handle option selection
const selectOption = (option: any) => {
  modelValue.value = option.id;
  dropdownOpen.value = false;
  emits("onChange");
  inputRef.value?.focus();
};

// Handle document click to close dropdown
const handleDocumentClick = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false;
  }
};

const inputClasses = ref("_input");
const checkRequired = () => {
  if (!props.IsRequire) return;
  if (modelValue.value) {
    inputClasses.value = "_input";
  } else {
    inputClasses.value = "_input border border-red-500";
  }
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('keydown', handleDocumentKeyDown);
  document.addEventListener('click', handleDocumentClick);
  
  if (props.autoFocus && inputRef.value) {
    inputRef.value.focus();
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleDocumentKeyDown);
  document.removeEventListener('click', handleDocumentClick);
});
</script>

<template>
  <div ref="containerRef" class="mb-2 mx-1 relative" :class="{ 'opacity-40 pointer-events-none': IsDisabled }">
    <label class="_inputLabel" :for="name">
      <span v-if="IsRequire" class="text-red-600">*</span> {{ label }}
    </label>
    
    <!-- Custom select input -->
    <div
      ref="inputRef"
      :id="name"
      :class="[
        inputClasses,
        hasFocus ? 'border-gray-900' : 'border-gray-300 dark:border-gray-800',
        dropdownOpen ? 'border-gray-900' : ''
      ]"
      class="flex items-center justify-between cursor-pointer h-10 px-3 py-2 border-[1px] focus:outline-none dark:bg-input text-text dark:text-textLight"
      tabindex="0"
      role="combobox"
      :aria-required="IsRequire"
      :aria-label="label"
      @click="toggleDropdown"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeyDown"
    >
      <span class="truncate">{{ selectedText || ' ' }}</span>
      <svg 
        :class="{ 'transform rotate-180': dropdownOpen }"
        class="transition-transform w-4 h-4" 
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </div>
    
    <!-- Dropdown menu -->
    <div 
      v-if="dropdownOpen" 
      class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg max-h-60 overflow-y-auto"
    >
      <div 
        v-for="(option, index) in options" 
        :key="index"
        :ref="el => setOptionRef(el as HTMLElement, index)"
        class="px-3 py-2 cursor-pointer"
        :class="{ 
          'bg-gray-50 dark:bg-gray-700': option.id === modelValue,
          'bg-blue-100 dark:bg-blue-800': index === highlightedIndex && option.id !== modelValue,
          'bg-blue-200 dark:bg-blue-700': index === highlightedIndex && option.id === modelValue
        }"
        @click="selectOption(option)"
        @mouseenter="highlightedIndex = index"
        @mousedown.prevent
        tabindex="-1"
        role="option"
        :aria-selected="option.id === modelValue"
      >
        {{ option.name }}
      </div>
    </div>
    
    <!-- Hidden native select for form submission if needed -->
    <select :name="name" v-model="modelValue" class="hidden">
      <option v-for="(option, index) in options" :key="index" :value="option.id">
        {{ option.name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
</style>