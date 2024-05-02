<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useVacationDailyStore } from "../vacationDailyStore";
import { TailwindPagination } from "laravel-vue-pagination";
import { useI18n } from "@/stores/i18n/useI18n";
import SimpleLoading from "@/components/general/loading.vue";
import { usePermissionStore } from "@/project/user/permissionStore";
const { checkPermissionAccessArray } = usePermissionStore();
import type { IVacationDaily, IVacationDailyFilter } from "../IVacationDaily";
const { t } = useI18n();
const isLoading = ref(false);
const data = ref<Array<IVacationDaily>>([]);
const dataBase = ref<Array<IVacationDaily>>([]);
const dataPage = ref();
import IPage from "@/components/ihec/IPage.vue";
import IRow from "@/components/ihec/IRow.vue";
import IButton from "@/components/ihec/IButton.vue";

const { vacationDaily } = useVacationDailyStore();

import { limits } from "@/utilities/defaultParams";
import { EnumPermission } from "@/utilities/EnumSystem";
import IFooterCrud from "@/components/ihec/IFooterCrud.vue";
import IInput from "@/components/inputs/IInput.vue";
import CardVacationDailyIndex from "./CardVacationDailyIndex.vue";

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
  useVacationDailyStore().resetData();
  router.push({
    name: "vacationDailyAdd",
  });
};
const Search = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    console.log(fastSearch.value);
    await getFilterData(1);
  }
};
//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (_vacationDaily: IVacationDailyFilter) => {
  if (_vacationDaily.dayFrom?.toString().includes(fastSearch.value)) {
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
const searchFilter = ref<IVacationDailyFilter>({
  dayFrom: "",
  limit: 10,
  employeeName: "",
});
const getFilterData = async (page: number = 1) => {
  localStorage.setItem("indexVacationDaily", page.toString());

  isLoading.value = true;
  searchFilter.value.employeeName = fastSearch.value;
  await useVacationDailyStore()
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
    name: "vacationDailyUpdate",
    params: { id: id },
  });
};

//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowVacationsDaily]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  let index = 1;

  if (localStorage.getItem("indexVacationDaily") != undefined)
    index = Number(localStorage.getItem("indexVacationDaily"));

  // must to wait fastSearch to get init value from localStorage.getItem
  await fastSearch.value;
  await getFilterData(index);
});
</script>
<template>
  <IPage :HeaderTitle="t('VacationDaily')" :is-loading="isLoading">
    <template #HeaderButtons>
      <IButton width="28" :onClick="addItem" :text="t('Add')" />
    </template>
    <IPageContent>
      <IRow :col="5" :col-md="2" :col-lg="4">
        <ISearchBar :getDataButton="getFilterData">
          <ICol :span-lg="1" :span-md="2" :span="1" :span-sm="4">
            <IInput
              :label="t('Search')"
              :placeholder="t('Search')"
              v-model="fastSearch"
              type="text"
              :OnKeyEnter="getFilterData"
              :cached="true"
              cached-name="searchVacationDaily"
            />
          </ICol>
        </ISearchBar>
      </IRow>
      <IRow :col="2" :col-lg="2" :col-md="2">
        <ICol
          :span="1"
          :span-lg="1"
          :span-md="1"
          v-for="item in data"
          :key="item.id"
        >
          <!-- card -->
          <CardVacationDailyIndex :item="item" />
          <!-- end card -->
        </ICol>
      </IRow>
      <IRow v-if="data.length > 0">
        <div class="w-full flex flex-row">
          <div class="basis-4/5 overflow-auto">
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
