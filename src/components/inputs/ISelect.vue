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
  isRequire: { type: Boolean, default: false },
  isDisabled: { type: Boolean, default: false },
  autoFocus: { type: Boolean, default: false },
  isSearchable: { type: Boolean, default: false },
  isClearable: { type: Boolean, default: false },
});

const containerRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLDivElement | null>(null);
const dropdownOpen = ref(false);
const hasFocus = ref(false);
const wasTabbed = ref(false);
const highlightedIndex = ref(-1);
const optionRefs = ref<HTMLElement[]>([]);
const searchTerm = ref("");

// Selected option display text
const selectedText = computed(() => {
  const currentValue = modelValue.value;

  // Explicitly check for null or undefined. Allow 0 as a valid ID.
  if (currentValue === null || currentValue === undefined) {
    return ""; // Return empty string if no value is set
  }
  // Find the option where the stringified ID matches the stringified current value
  const selected = props.options.find(
    (opt) => String(opt.id) === String(currentValue)
  );
  // Return the name if found, otherwise return an empty string
  return selected ? selected.name : "";
});

// Filtered options based on search term
const filteredOptions = computed(() => {
  if (!props.isSearchable || !searchTerm.value) return props.options;
  return props.options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Initialize option highlighting when dropdown opens
watch(dropdownOpen, (isOpen) => {
  if (isOpen) {
    const value = String(modelValue.value);
    const selectedIndex = filteredOptions.value.findIndex(
      (opt) => String(opt.id) === value
    );
    highlightedIndex.value = selectedIndex >= 0 ? selectedIndex : 0;
    setTimeout(() => {
      if (
        highlightedIndex.value >= 0 &&
        optionRefs.value[highlightedIndex.value]
      ) {
        optionRefs.value[highlightedIndex.value].scrollIntoView({
          block: "nearest",
        });
      }
    }, 0);
  } else {
    searchTerm.value = "";
  }
});

// Handle document key events
const handleDocumentKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Tab") {
    wasTabbed.value = true;
    setTimeout(() => {
      wasTabbed.value = false;
    }, 200);
  }
};

// Handle key navigation within the component
const handleKeyDown = (e: KeyboardEvent) => {
  if (props.isDisabled) return;

  if (
    props.isSearchable &&
    dropdownOpen.value &&
    e.key.length === 1 &&
    !e.ctrlKey &&
    !e.metaKey &&
    !e.altKey
  ) {
    searchTerm.value += e.key;
    return;
  }

  switch (e.key) {
    case "Backspace":
      if (props.isSearchable && searchTerm.value) {
        searchTerm.value = searchTerm.value.slice(0, -1);
        return;
      }
      break;
    case "Escape":
      if (dropdownOpen.value) {
        e.preventDefault();
        dropdownOpen.value = false;
        searchTerm.value = "";
        inputRef.value?.focus();
      }
      break;
    case "Enter":
      if (dropdownOpen.value && highlightedIndex.value >= 0) {
        e.preventDefault();
        selectOption(filteredOptions.value[highlightedIndex.value]);
      } else {
        e.preventDefault();
        dropdownOpen.value = true;
      }
      break;
    case " ":
      if (!dropdownOpen.value) {
        e.preventDefault();
        dropdownOpen.value = true;
      }
      break;
    case "ArrowDown":
      e.preventDefault();
      if (dropdownOpen.value) {
        highlightedIndex.value = Math.min(
          highlightedIndex.value + 1,
          filteredOptions.value.length - 1
        );
        if (optionRefs.value[highlightedIndex.value]) {
          optionRefs.value[highlightedIndex.value].scrollIntoView({
            block: "nearest",
          });
        }
      } else {
        dropdownOpen.value = true;
      }
      break;
    case "ArrowUp":
      e.preventDefault();
      if (dropdownOpen.value) {
        highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0);
        if (optionRefs.value[highlightedIndex.value]) {
          optionRefs.value[highlightedIndex.value].scrollIntoView({
            block: "nearest",
          });
        }
      } else {
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
  if (wasTabbed.value) {
    dropdownOpen.value = true;
    wasTabbed.value = false;
  }
};

// Handle blur event
const handleBlur = (e: FocusEvent) => {
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
  if (!props.isDisabled) {
    dropdownOpen.value = !dropdownOpen.value;
  }
};

// Handle option selection
const selectOption = (option: any) => {
  if (option && option.id !== undefined) {
    // Ensure option and option.id exist
    modelValue.value = option.id;
    // Removed console.log statements
    dropdownOpen.value = false;
    searchTerm.value = "";
    emits("onChange");
    inputRef.value?.focus();
  } else {
    console.error("Invalid option selected:", option); // Keep error handling
  }
};

// Handle document click to close dropdown
const handleDocumentClick = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false;
  }
};

const inputClasses = ref("_input");
const checkRequired = () => {
  if (!props.isRequire) return;
  if (modelValue.value) {
    inputClasses.value = "_input";
  } else {
    inputClasses.value = "_input border border-red-500";
  }
};

// Clear selection handler
const clearSelection = (e: Event) => {
  e.stopPropagation();
  // Set to first item if available, else null
  if (props.options.length > 0) {
    modelValue.value = null;
  } else {
    modelValue.value = null; // Set to null instead of 0
  }
  dropdownOpen.value = true;
  searchTerm.value = "";
  //emits("onChange");
  inputRef.value?.focus();
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener("keydown", handleDocumentKeyDown);
  document.addEventListener("click", handleDocumentClick);

  if (props.autoFocus && inputRef.value) {
    inputRef.value.focus();
  }
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleDocumentKeyDown);
  document.removeEventListener("click", handleDocumentClick);
});
</script>

<template>
  <div
    ref="containerRef"
    class="mb-2 mx-1 relative"
    :class="{ 'opacity-40 pointer-events-none': isDisabled }"
  >
    <!-- Removed {{ modelValue }} debug output -->
    <slot name="header"></slot>
    <label class="_inputLabel" :for="name">
      <span v-if="isRequire" class="text-red-600">*</span> {{ label }}
    </label>
    <div
      ref="inputRef"
      :id="name"
      :class="[
        inputClasses,
        hasFocus ? 'border-gray-900' : 'border-gray-300 dark:border-gray-800',
        dropdownOpen ? 'border-gray-900' : '',
      ]"
      class="flex items-center justify-between cursor-pointer h-10 px-3 py-2 border-[1px] focus:outline-none dark:bg-input text-text dark:text-textLight"
      tabindex="0"
      role="combobox"
      :aria-required="isRequire"
      :aria-label="label"
      @click="toggleDropdown" 
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeyDown"
    >
      <span class="truncate flex-grow">
        <input
          v-if="isSearchable && dropdownOpen"
          v-model="searchTerm"
          class="w-full bg-transparent outline-none border-none"
          :placeholder="selectedText || label"
          @click.stop
          @keydown.stop
          autofocus
        />
        <!-- Use a direct span for the display when dropdown is closed -->
        <span v-else>{{ selectedText || "&nbsp;" }}</span>
      </span>
      <div class="flex items-center">
        <!-- v-if condition for clear button already checks for null/undefined -->
        <button
          v-if="isClearable && modelValue !== null && modelValue !== undefined"
          type="button"
          class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full mr-1"
          @click="clearSelection"
          @mousedown.prevent
          aria-label="Clear selection"
        >
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <svg
          :class="{ 'transform rotate-180': dropdownOpen }"
          class="transition-transform w-4 h-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
    <div
      v-if="dropdownOpen"
      class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg max-h-60 overflow-y-auto"
    >
      <div
        v-for="(option, index) in filteredOptions"
        :key="option.id"
        :ref="(el) => setOptionRef(el as HTMLElement, index)"
        class="px-3 py-2 cursor-pointer"
        :class="{
          'bg-gray-50 dark:bg-gray-700':
            String(option.id) === String(modelValue), // Use modelValue directly here for comparison
          'bg-blue-100 dark:bg-blue-800':
            index === highlightedIndex &&
            String(option.id) !== String(modelValue),
          'bg-blue-200 dark:bg-blue-700':
            index === highlightedIndex &&
            String(option.id) === String(modelValue),
        }"
        @click="selectOption(option)"
        @mouseenter="highlightedIndex = index"
        @mousedown.prevent
        tabindex="-1"
        role="option"
        :aria-selected="String(option.id) === String(modelValue)"
      >
        {{ option.name }}
      </div>
      <div
        v-if="isSearchable && filteredOptions.length === 0"
        class="px-3 py-2 text-gray-500 dark:text-gray-400"
      >
        No results found
      </div>
    </div>
    <select :name="name" :value="modelValue" class="hidden">
      <option
        v-for="(option, index) in options"
        :key="option.id"
        :value="option.id"
      >
        {{ option.name }}
      </option>
    </select>
  </div>
</template>

<style scoped></style>
