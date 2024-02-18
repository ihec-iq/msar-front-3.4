<script setup lang="ts">
interface TableItem {
  [key: string]: any;
}

const props = defineProps({
  headers: {
    type: Array as () => string[],
    required: true,
  },
  items: {
    type: Array as () => TableItem[],
    required: true,
  },
});

import { defineProps, defineEmits } from "vue";

// defineProps(["headers", "items"]);
const emits = defineEmits(["updateClick"]);

const handleUpdateClick = (id: number) => {
  emits("updateClick", id);
};
</script>
<template>
  <slot name="tableBar"></slot>
  <div
    v-motion
    :initial="{ opacity: 0, y: -15 }"
    :enter="{ opacity: 1, y: 0 }"
    :variants="{ custom: { scale: 2 } }"
    :delay="200"
    v-if="items.length > 0"
  >
    <table class="min-w-full text-center">
      <thead class="dark:bg-tableHead bg-LightTableHead shadow">
        <tr>
          <th
            class="text-lg font-medium text-gray-800 dark:text-white px-6 py-4"
            v-for="(header, index) in headers"
            :key="index"
          >
            {{ header }}
          </th>
          <th
            class="text-lg font-medium text-gray-800 dark:text-white px-6 py-4"
          >
            Activity
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="dark:hover:bg-tableBodyHover bg-gray-100 dark:bg-tableBody hover:bg-gray-300 duration-300 border-t border-gray-400 dark:border-gray-900"
          v-for="(item, index) in items"
          :key="index"
        >
          <td
            class="text-sm font-light px-6 py-4 whitespace-nowrap"
            v-for="(header, index) in headers"
            :key="index"
          >
            {{ item[header] }}
          </td>
          <td>
            <slot name="buttons"></slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
