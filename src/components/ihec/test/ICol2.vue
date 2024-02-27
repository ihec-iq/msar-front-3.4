<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps({
    col: {
        type: Number,
        required: true,
    },
     colLg: {
        type: Number,
        default: null,
    },
     colMd: {
        type: Number,
        default: null,
    },
    colSm: {
        type: Number,
        default: null,
    },
   
});

function getClassNames(): string {
    let classNames = `col-span-${props.col}`;
  
    if (props.colLg !== null) {
        classNames += ` lg:col-span-${props.colLg}`;
    }
    if (props.colMd !== null) {
        classNames += ` md:col-span-${props.colMd}`;
    }
      if (props.colSm !== null) {
        classNames += ` sm:col-span-${props.colSm}`;
    }
    return classNames;
}
</script>

<template>
    <div :class="getClassNames()">
        <slot></slot>
        {{ getClassNames() }}
    </div>
</template>
