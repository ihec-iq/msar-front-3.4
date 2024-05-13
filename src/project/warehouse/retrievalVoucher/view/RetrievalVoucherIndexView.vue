<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utilities/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import { usePermissionsStore } from "@/project/core/permissionStore";
const { checkPermissionAccessArray } = usePermissionsStore();
import type {
  IRetrievalVoucher,
  IRetrievalVoucherFilter,
} from "../IRetrievalVoucher";
import { useRetrievalVoucherStore } from "@/project/warehouse/retrievalVoucher/retrievalVoucherStore";
const isLoading = ref(false);
const data = ref<Array<IRetrievalVoucher>>([]);
const dataPage = ref();
const dataBase = ref<Array<IRetrievalVoucher>>([]);
const { retrievalVoucher, get_filter } = useRetrievalVoucherStore();

import { limits } from "@/utilities/defaultParams";
import { EnumPermission } from "@/utilities/EnumSystem";
import CardRetrievalVoucherIndex from "./CardRetrievalVoucherIndex.vue";
import IPage from "@/components/ihec/IPage.vue";

const route = useRoute();
const router = useRouter();
watch(
  () => route.params.search,
  async (newValue) => {
    if (route.params.search != undefined)
      fastSearch.value = newValue.toString() || "";
    await getFilterData(1);
  }
);
const addItem = () => {
  retrievalVoucher.id = 0;
  retrievalVoucher.number = "";
  retrievalVoucher.date = "";
  retrievalVoucher.notes = "";
  retrievalVoucher.Items = [];
  retrievalVoucher.signaturePerson = "";
  router.push({
    name: "retrievalVoucherAdd",
  });
};

//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (item: IRetrievalVoucher) => {
  if (
    item.number.includes(fastSearch.value) ||
    item.notes.includes(fastSearch.value)
  ) {
    return true;
  } else return false;
};
const makeFastSearch = () => {
  if (fastSearch.value == "") data.value = dataBase.value;
  else {
    data.value = dataBase.value.filter(filterByIDName);
  }
};
//#endregion
//#region Search
const searchFilter = ref<IRetrievalVoucherFilter>({
  name: "",
  limit: 10,
  description: "",
});
const getFilterData = async (page = 1) => {
  isLoading.value = true;
  searchFilter.value.name = fastSearch.value;
  await get_filter(searchFilter.value, page)
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
    name: "retrievalVoucherUpdate",
    params: { id: id },
  });
};

//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowRetrievalVouchers]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  await getFilterData(1);
});
</script>
<template>
  <IPage :HeaderTitle="t('RetrievalVoucher.Index')" :is-loading="isLoading">
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
              :OnKeyEnter="getFilterData"
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
          <CardRetrievalVoucherIndex :item="item" />
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
    <IFooterCrud :is-add="true" :show-add="false"> </IFooterCrud>
  </IPage>
</template>
