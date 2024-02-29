<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useVacationSickStore } from "@/stores/vacations/vacationSickStore";
import { TailwindPagination } from "laravel-vue-pagination";
import { useI18n } from "@/stores/i18n/useI18n";
import SimpleLoading from "@/components/general/loading.vue";
import { usePermissionStore } from "@/stores/permissionStore";
const { checkPermissionAccessArray } = usePermissionStore();
import type {
  IVacationSick,
  IVacationSickFilter,
} from "@/types/vacation/IVacationSick";
import { isNumeric } from "vant/lib/utils";
const { t } = useI18n();
const isLoading = ref(false);
const data = ref<Array<IVacationSick>>([]);
const dataPage = ref();
const dataBase = ref<Array<IVacationSick>>([]);
const vacationSick = useVacationSickStore();

import { limits } from "@/utils/defaultParams";
import IRow from "@/components/ihec/IRow.vue";
import ICol from "@/components/ihec/ICol.vue";
import ISearchBar from "@/components/ihec/ISearchBar.vue";
import { EnumPermission } from "@/utils/EnumSystem";

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
  vacationSick.resetData();
  router.push({
    name: "vacationSickAdd",
  });
};

//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (_vacationSick: IVacationSickFilter) => {
  if (_vacationSick.dayFrom?.toString().includes(fastSearch.value)) {
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
const Search = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    await getFilterData(1);
  }
};
//#endregion
//#region Search
const searchFilter = ref<IVacationSickFilter>({
  dayFrom: "",
  limit: 10,
});
const CNumber = (val: any = 0): number => {
  if (isNumeric(val) == false) return 0;
  return Number(val);
};

const getFilterData = async (page: number = 1) => {
  isLoading.value = true;
  searchFilter.value.limit = 0;
  searchFilter.value.record = CNumber(fastSearch.value);
  searchFilter.value.employeeName = fastSearch.value;
  await vacationSick
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
    name: "vacationSickUpdate",
    params: { id: id },
  });
};

//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowVacationsSick]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";

  await getFilterData(1);
  if (inputRefSearch.value) {
    inputRefSearch.value.addEventListener("keydown", Search);
  }
});
</script>
<template>
  <IPage :HeaderTitle="t('VacationSick')">
    <template #HeaderButtons>
      <IButton width="28" :onClick="addItem" :text="t('Add')" />
    </template>
    <IPageContent>
      <!-- Search Bar -->
      <IRow :col="5" :col-md="2" :col-lg="4">
        <ISearchBar :getDataButton="getFilterData">
          <ICol :span-lg="1" :span-md="2" :span="1" :span-sm="4">
            <IInput
              :label="t('Search')"
              :placeholder="t('Search')"
              v-model="fastSearch"
              type="text"
            />
          </ICol>
        </ISearchBar>
      </IRow>
      <!-- Show Data -->
      <IRow :col="2" :col-lg="2" :col-md="2" :col-sm="1" :col-xs="1">
        <ICol
          :span="1"
          :span-lg="1"
          :span-md="1"
          v-for="item in data"
          :key="item.id"
        >
          <!-- card -->
          <CardVactionSickIndex :item="item" />
          <!-- end card -->
        </ICol>
      </IRow>
      <!-- Pagination -->
      <IRow v-if="data.length > 0">
        <div class="w-full flex flex-row">
          <div class="basis-4/5 hidden">
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
  </IPage>
</template>
