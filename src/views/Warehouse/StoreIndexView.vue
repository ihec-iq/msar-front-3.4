<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utils/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import type { IStore, IStoreFilter } from "@/types/IStore";
import { useStoringStore } from "@/stores/warehouse/storingStore";
import { usePermissionStore } from "@/stores/permissionStore";
const { checkPermissionAccessArray } = usePermissionStore();
const isLoading = ref(false);
const data = ref<Array<IStore>>([]);
const dataPage = ref();
const dataBase = ref<Array<IStore>>([]);

const { get_filter, get_summation } = useStoringStore();

import { limits } from "@/utils/defaultParams";
import ICol from "@/components/ihec/ICol.vue";
import ICheckbox from "@/components/inputs/ICheckbox.vue";
import ISearchBar from "@/components/ihec/ISearchBar.vue";
import { EnumPermission } from "@/utils/EnumSystem";
import type { ITableHeader } from "@/types/core/components/ITable";
;

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
//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (item: IStore) => {
  if (
    item.itemName.includes(fastSearch.value) ||
    item.serialNumber.includes(fastSearch.value)
  ) {
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
const searchFilter = ref<IStoreFilter>({
  item: "",
  limit: 10,
  serialNumber: "",
  summation: true,
});
const getFilterData = async (page = 1) => {
  dataPage.value = [];
  data.value = [];
  dataBase.value = [];
  isLoading.value = true;
  searchFilter.value.item = fastSearch.value;
  searchFilter.value.serialNumber = fastSearch.value;

  if (searchFilter.value.summation == true) {
    await get_summation(searchFilter.value, page)
      .then((response) => {
        if (response.status == 200) {
          dataPage.value = response.data.data;
          data.value = dataPage.value.data;
          dataBase.value = dataPage.value.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    await get_filter(searchFilter.value, page)
      .then((response) => {
        if (response.status == 200) {
          dataPage.value = response.data.data;
          data.value = dataPage.value.data;
          dataBase.value = dataPage.value.data;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  isLoading.value = false;
};
//#endregion
const openItem = (id: number) => {
  router.push({
    name: "ItemHistory",
    params: { id: id },
  });
};
//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowStorage]);

  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  await getFilterData(1);
});

const headers = ref<Array<ITableHeader>>([
  { caption: t("Item"), value: "itemName" },
  { caption: t("SerialNumber"), value: "serialNumber" },
  { caption: t("In"), value: "in" },
  { caption: t("Out"), value: "out" },
  { caption: t("AvailableInStock"), value: "count" },
  { caption: t("Price"), value: "price" },
  { caption: t("Stock"), value: "stockName" },
  { caption: t("Details"), value: "actions" },
]);
</script>
<template>
  <IPage :HeaderTitle="t('StoreIndex')">
    <IPageContent>
      <IRow :col="4" :col-md="4" :col-lg="4">
        <ISearchBar :getDataButton="getFilterData">
          <ICol :span-lg="1" :span-md="1" :span="1" :span-sm="1">
            <IInput
              :label="t('Title')"
              :placeholder="t('Search')"
              v-model="fastSearch"
              type="text"
            />
          </ICol>
          <!-- report type -->
          <ICol :span-lg="1" :span-md="1" :span="1">
            <ICheckbox
              v-model="searchFilter.summation"
              :checked="searchFilter.summation"
              @change="getFilterData()"
            >
              {{ t("StoreTypeReport") }} :
              {{ searchFilter.summation ? " تجميعي " : " مفصل " }}</ICheckbox
            >
          </ICol>
        </ISearchBar>
      </IRow>
      <IRow>
        <ITable :items="data" :headers="headers">
          <template v-slot:actions="{ row }">
            <IDropdown>
              <li>
                <EditButton @click="openItem(row.itemId)" />
              </li>
            </IDropdown>
          </template>
          <template v-slot:in="{ row }">
            <span
              v-if="Number(row.in) > 0"
              class="bg-green-100 text-blue-800 text-16 font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-800 ml-2"
              >↓{{ row.in }}</span
            >
          </template>
          <template v-slot:out="{ row }">
            <span
              v-if="Number(row.out) > 0"
              class="bg-red-100 text-blue-800 text-16 font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-800 ml-2"
              >↑{{ row.out }}</span
            ></template
          >
          <template v-slot:count="{ row }">
            <span
              class="bg-blue-100 text-blue-800 text-16 font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-2"
              >{{ row.count }}</span
            ></template
          >
        </ITable>
      </IRow>
      <IRow><div id="PageDataEnd"></div></IRow>
    </IPageContent>
  </IPage>
</template>
<style></style>
