<script setup lang="ts">
import type { ITableItem, ITableHeader } from "@/types/core/components/ITable";

defineProps({
  headers: {
    type: Array as () => ITableHeader[],
    required: true,
  },
  items: {
    type: Array as () => ITableItem[],
    required: true,
  },
});
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
      <thead class="dark:bg-tableHead bg-[#7192AD] text-[#fff] shadow">
        <tr>
          <th
            class="text-lg font-medium text-gray-50 dark:text-white px-2 py-2"
            v-for="(header, index) in headers"
            :key="index"
          >
            {{ header.caption }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="dark:hover:bg-tableBodyHover bg-gray-100 dark:bg-tableBody hover:bg-gray-300 duration-300 border-t border-gray-400 dark:border-gray-900"
          v-for="(row, rowIndex) in items"
          :key="rowIndex"
        >
          <td
            class="text-sm font-light px-3 py-0 whitespace-nowrap"
            dir="auto"
            v-for="(header, index) in headers"
            :key="index"
          >
            <slot
              :name="header.value"
              :row="row"
              :cell="row[index]"
              :rowIndex="rowIndex"
              :cellIndex="index"
            >
              {{ row[header.value] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<!-- Example -->
<!-- 
  <ITableNew :items="items" :headers="headers">
      <template v-slot:actions="{ row }"> {{ row.id }} </template>
  </ITableNew>
 -->
