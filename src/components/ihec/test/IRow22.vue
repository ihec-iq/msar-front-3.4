<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps({
    span: {
        type: Number,
        required: true,
    },
    spanLg: {
        type: Number,
        default: null,
    },
    spanMd: {
        type: Number,
        default: null,
    },
    spanSm: {
        type: Number,
        default: null,
    },
    
});

function getClassNames(): string {
    let classNames = `grid grid-cols-${props.span}`;
    if (props.spanLg !== null) {
        classNames += ` lg:grid-cols-${props.spanLg}`;
    }
    if (props.spanMd !== null) {
        classNames += ` md:grid-cols-${props.spanMd}`;
    }
    if (props.spanSm !== null) {
        classNames += ` sm:grid-cols-${props.spanSm}`;
    }
    return classNames;
}
</script>

<template>
    <div :class="getClassNames()">
        <slot></slot> 
    </div>
</template>
