<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStockStore } from "../stockStore";
import type { IStock } from "../IStock";
import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utilities/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import { usePermissionsStore } from "@/project/core/permissionStore";
const { checkPermissionAccessArray } = usePermissionsStore();

const isLoading = ref(false);
const data = ref<Array<IStock>>([]);
const dataPage = ref();
const dataBase = ref<Array<IStock>>([]);
const { stock } = useStockStore();
const StockStore = useStockStore();
import CardStockIndex from "./CardItemStockIndex.vue";

import { limits } from "@/utilities/defaultParams";
import { EnumPermission } from "@/utilities/EnumSystem";
import IPage from "@/components/ihec/IPage.vue";
import IInput from "@/components/inputs/IInput.vue";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";

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
  stock.id = 0;
  stock.name = "";
  router.push({
    name: "StockAdd",
  });
};

//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (item: IStock) => {
  if (item.name.includes(fastSearch.value)) {
    return true;
  } else return false;
};
const makeFastSearch = () => {
  // eslint-disable-next-line no-self-assign
  if (fastSearch.value == "") data.value = dataBase.value;
  else {
    data.value = dataBase.value.filter(filterByIDName);
  }
};
//#endregion
//#region Search
 
const getFilterData = async (page: number = 1) => {
  isLoading.value = true;
   await StockStore
    .get()
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
    name: "StockUpdate",
    params: { id: id },
  });
};

//#region Pagination
//#endregion
onMounted(async () => {
  isLoading.value = true;
  checkPermissionAccessArray([EnumPermission.ShowCategoriesItem]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  await getFilterData(1);
  isLoading.value = false;
});
</script>
<template>
  <IPage :HeaderTitle="t('Item.Category')" :is-loading="isLoading">
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
              :type="EnumInputType.Text"
              :OnKeyEnter="getFilterData"
            />
          </ICol>
        </ISearchBar>
      </IRow>
      <IRow :col="2" :colMd="2" :colLg="2">
        <ICol class="p-3" :span="2" v-for="item in data" :key="item.id">
          <CardStockIndex :item="item" />
          <SimpleLoading v-if="isLoading"></SimpleLoading>
        </ICol>
      </IRow> 
    </IPageContent>
    <IFooterCrud :is-add="true" :show-add="false"/>
  </IPage>
</template>
