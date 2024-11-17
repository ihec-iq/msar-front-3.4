<script setup lang="ts">
import { computed } from "vue";
import { string } from "yup";

const props = defineProps({
    cols: {
        type: [String, Number],
        default: 12,
    },
    xl: {
        type: [String, Number],
        default: null,
    },
    lg: {
        type: [String, Number],
        default: null,
    },
    md: {
        type: [String, Number],
        default: null,
    },
    sm: {
        type: [String, Number],
        default: null,
    },
    xs: {
        type: [String, Number],
        default: null,
    },
    debug: {
        type: Boolean,
        default: false,
    },
});

const colClass = computed(() => {
    const classes: string[] = [];

    // Convert column numbers to tailwind width classes
    const getWidthClass = (cols: string | number) => {
        const width = Math.floor((Number(cols) / 12) * 100);
        return `w-[${width}%]`;
    };

    // Base columns
    classes.push(getWidthClass(props.cols));

    // Responsive breakpoints
    if (props.xl) classes.push(`xl:${getWidthClass(props.xl)}`);
    if (props.lg) classes.push(`lg:${getWidthClass(props.lg)}`);
    if (props.md) classes.push(`md:${getWidthClass(props.md)}`);
    if (props.sm) classes.push(`sm:${getWidthClass(props.sm)}`);
    if (props.xs) classes.push(`xs:${getWidthClass(props.xs)}`);

    return classes.join(' ');
});

const debugClass = computed(() => {
    if (props.debug) return `border border-1 border-red-500`;
    return "";
});
</script>

<template>
    <div :class="[colClass, debugClass]">
        <div v-if="debug" class="text-xs">{{ colClass }}</div>
        <slot></slot>
    </div>
</template>