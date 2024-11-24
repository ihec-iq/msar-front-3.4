<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
    title: {
        type: [String],
        default: "",
    },
    debug: {
        type: Boolean,
        default: false,
    },
    gap: {
        type: [Number, String],
        default: 2,
    }
});

const rowClass = computed(() => {
    return `flex flex-wrap gap-${props.gap}`;
});

const debugClass = computed(() => {
    if (props.debug) return `border border-2 border-blue-500 bg-blue-500`;
    return "";
});
</script>

<template>
    <div :class="[rowClass, debugClass]" class="w-full">
        <div v-if="title"
            class="hover:text-gray-300 w-full dark:hover:text-gray-700 duration-300 text-lg font-bold header-title text-blue-700 dark:text-blue-300 py-2 w-full basis-full px-2 bg-gray-200 dark:bg-gray-800">
            {{ title }}
        </div>
        <slot></slot>
    </div>
</template>