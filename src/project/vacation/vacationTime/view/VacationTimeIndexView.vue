<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useVacationTimeStore } from "../vacationTimeStore";
import { TailwindPagination } from "laravel-vue-pagination";
import { useI18n } from "@/stores/i18n/useI18n";
import SimpleLoading from "@/components/general/loading.vue";
import { usePermissionsStore } from "@/project/core/permissionStore";
const { checkPermissionAccessArray } = usePermissionsStore();
import type { IVacationTime, IVacationTimeFilter } from "../IVacationTime";
const { t } = useI18n();
const isLoading = ref(false);
const data = ref<Array<IVacationTime>>([]);
const dataPage = ref();
const dataBase = ref<Array<IVacationTime>>([]);
const { vacationTime } = useVacationTimeStore();

import { limits } from "@/utilities/defaultParams";
import { EnumPermission } from "@/utilities/EnumSystem";
import CardVactionTimeIndex from "./CardVactionTimeIndex.vue";
import IPage from "@/components/ihec/IPage.vue";

const route = useRoute();
const router = useRouter();
const inputRefSearch = ref<HTMLInputElement | null>(null);

watch(
  () => route.params.search,
  async (newValue) => {
    if (route.params.search != undefined)
      fastSearch.value = newValue.toString() || "";
    await getFilterData(1);
  }
);
const addItem = () => {
  useVacationTimeStore().resetData();
  router.push({
    name: "vacationTimeAdd",
  });
};

//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (_vacationTime: IVacationTimeFilter) => {
  if (_vacationTime.dayFrom?.toString().includes(fastSearch.value)) {
    return true;
  } else return false;
};
const makeFastSearch = () => {
  // eslint-disable-next-line no-self-assign
  if (fastSearch.value == "") data.value = dataBase.value;
  else {
    //data.value = dataBase.value.filter(filterByIDName);
  }
};
//#endregion
//#region Search
const searchFilter = ref<IVacationTimeFilter>({
  dayFrom: "",
  limit: 10,
  employeeName: "",
});
const getFilterData = async (page: number = 1) => {
    localStorage.setItem("indexVacationTime", page.toString());

  isLoading.value = true;
  searchFilter.value.employeeName = fastSearch.value;
  await useVacationTimeStore()
    .get_filter(searchFilter.value, page)
    .then((response) => {
      if (response.status == 200) {
        dataPage.value = response.data.data;
        data.value = response.data.data.data;
        dataBase.value = response.data.data.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  isLoading.value = false;
};
//#endregion
const update = (id: number) => {
  router.push({
    name: "vacationTimeUpdate",
    params: { id: id },
  });
};
//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowVacationsTime]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  let index = 1;
  if (await localStorage.getItem("indexVacationTime") != undefined) index = Number(localStorage.getItem("indexVacationTime"));

  // must to wait fastSearch to get init value from localStorage.getItem
  await fastSearch.value;
  await getFilterData(index);
});
</script>
<template>
  <IPage :HeaderTitle="t('VacationTime')" :is-loading="isLoading">
    <template #HeaderButtons>
      <IButton width="28" :onClick="addItem" :text="t('Add')" />
    </template>
    <IPageContent>
      <IRow :col="2" :col-md="2" :col-lg="2" :sm="1">
        <ISearchBar :getDataButton="getFilterData">
          <ICol :span-lg="1" :span-md="2" :span="1" :span-sm="4">
            <IInput
              :label="t('Search')"
              :placeholder="t('Search')"
              v-model="fastSearch"
              type="text"
              :OnKeyEnter="getFilterData"
              :cached="true"
              cached-name="searchVacationTime"
            />
          </ICol>
        </ISearchBar>
      </IRow>
      <IRow :col="2" :col-lg="2" :col-md="2" :col-sm="1" :col-xs="1">
        <ICol
          :span="1"
          :span-lg="1"
          :span-md="1"
          v-for="item in data"
          :key="item.id"
        >
          <!-- card -->
          <CardVactionTimeIndex :item="item" />
          <!-- end card -->
        </ICol>
      </IRow>
      <!-- Pagination -->
      <IRow v-if="data.length > 0">
        <div class="w-full flex flex-row">
          <div class="basis-4/5">
            <TailwindPagination
              class="flex justify-center mt-6"
              :data="dataPage"
              @pagination-change-page="getFilterData"
              :limit="searchFilter.limit"
            />
          </div>
          <div class="basis-1/5" v-if="data.length >= limits[0].id">
            <ISelect
              :label="t('Limit')"
              v-model="searchFilter.limit"
              name="archiveTypeId"
              :options="limits"
              :IsRequire="true"
              @onChange="getFilterData()"
            />
          </div>
        </div>
        <SimpleLoading v-if="isLoading">.</SimpleLoading>
      </IRow>
    </IPageContent>
    <IFooterCrud :is-add="true" :show-add="false"> </IFooterCrud>
  </IPage>
</template>
@/project/vacation/vacationTime/vacationTimeStore@/project/vacation/vacationSick/IVacationTime
@/project/user/permissionStore@/utilities/defaultParams@/utilities/EnumSystem
