<script setup lang="ts">
import type { ITableItem, ITableHeader } from "@/types/core/components/ITable";
import { t } from "@/utilities/I18nPlugin";

defineProps({
  headers: {
    type: Array as () => ITableHeader[],
    required: true,
  },
  items: {
    type: Array as () => ITableItem[],
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  showNoData: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <slot name="tableBar"></slot>
  <div v-if="headers.length > 0 && items.length > 0" class="px-2">
    <IRowHeader v-if="title" :title="title" />
    <div v-motion :initial="{ opacity: 1, y: -15 }" :enter="{ opacity: 1, y: 0 }" :variants="{ custom: { scale: 5 } }"
      :delay="200" v-if="items.length > 0" class="overflow-auto">
      <table class="w-full pb-5 mb-10">
        <caption></caption>
        <thead class="dark:bg-tableHead  bg-[#23A559] text-[#fff] shadow">
          <tr>
            <th class="text-lg font-bold text-sm border-r border-gray-400 text-gray-50 dark:text-white py-2"
              v-for="(header, index) in headers" :key="index">
              {{ header.caption }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="dark:hover:bg-tableBodyHover  bg-gray-100 dark:bg-tableBody hover:bg-gray-300 duration-300 border-t border-gray-400 dark:border-gray-900"
            v-for="(row, rowIndex) in items" :key="rowIndex">
            <td class="text-sm font-light border-y border-x text-center border-gray-400 whitespace-nowrap" dir="auto"
              v-for="(header, index) in headers" :key="index">
              <slot :name="header.value" :row="row" :cell="row[index]" :rowIndex="rowIndex" :cellIndex="index" class="">
                {{ row[header.value] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else>
    <span v-if="showNoData">{{ t("noData") }}</span>
  </div>
</template>
<!-- Example -->
<!-- 
  <ITableNew :items="items" :headers="headers">
      <template v-slot:actions="{ row }"> {{ row.id }} </template>
  </ITableNew>
 -->
