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
    let classNames = `col-span-${props.span}`;
  
    if (props.spanLg !== null) {
        classNames += ` lg:col-span-${props.spanLg}`;
    }
    if (props.spanMd !== null) {
        classNames += ` md:col-span-${props.spanMd}`;
    }
      if (props.spanSm !== null) {
        classNames += ` sm:col-span-${props.spanSm}`;
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
