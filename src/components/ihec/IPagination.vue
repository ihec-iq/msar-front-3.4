<script setup lang="ts">
import { t } from "@/utilities/I18nPlugin";
import { TailwindPagination } from "laravel-vue-pagination";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  dataPage: {
    type: Object,
    required: true,
  },
  searchFilter: {
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
        :limit="props.searchFilter.limit"
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
</template>@/utilities/I18nPlugin
