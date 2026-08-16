<script setup lang="ts">
// NOTE: this component has no live call sites — every <IPagination> in
// src/ is commented out. It now exposes searchFilter as a model, so any
// revived usage must bind v-model:searchFilter, not :searchFilter.
// Delete this file if pagination is not coming back.
import { t } from "@/utilities/I18nPlugin";
import { TailwindPagination } from "laravel-vue-pagination";

const searchFilter = defineModel("searchFilter", {
  type: Object,
  required: true,
});

defineProps({
  data: {
    type: Object,
    required: true,
  },
  dataPage: {
    type: Object,
    required: true,
  },
  limits: {
    type: Object,
    required: true,
  },
  getFilterData: {
    type: Function,
    default: () => {},
  },
});
</script>

<template>
  <div class="w-full flex flex-row">
    <div class="basis-4/5 overflow-auto">
      <TailwindPagination
        class="flex justify-center mt-6"
        :data="dataPage"
        @pagination-change-page="getFilterData()"
        :limit="searchFilter.limit"
      />
    </div>
    <div class="basis-1/5" v-if="data.length >= limits[0].id">
      <ISelect
        :label="t('Limit')"
        v-model="searchFilter.limit"
        :options="limits"
        :IsRequire="true"
        @onChange="getFilterData()"
      />
    </div>
  </div>
</template>
@/utilities/I18nPlugin
