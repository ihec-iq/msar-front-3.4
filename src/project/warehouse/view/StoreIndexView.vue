<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utilities/I18nPlugin";
import type { IInventoryFilter, IStore, IStoreFilter } from "../IStore";
import { useStoringStore } from "../storingStore";
import { usePermissionsStore } from "@/project/core/permissionStore";
const { checkPermissionAccessArray } = usePermissionsStore();
const isLoading = ref(false);
const data = ref<Array<IStore>>([]);
const dataPage = ref();
const dataBase = ref<Array<IStore>>([]);

const { get_filter } = useStoringStore();

import { limits } from "@/utilities/defaultParams";
import ICol from "@/components/ihec/ICol.vue";
import ICheckbox from "@/components/inputs/ICheckbox.vue";
import ISearchBar from "@/components/ihec/ISearchBar.vue";
import { EnumPermission } from "@/utilities/EnumSystem";
import type { ITableHeader } from "@/types/core/components/ITable";
import IPage from "@/components/ihec/IPage.vue";
import { ConvertToMoneyFormat } from "@/utilities/tools";
import ITable from "@/components/ITable/ITable.vue";
import IInput from "@/components/inputs/IInput.vue";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";
import dropdownmenu from "../component/dropdownmenu.vue";
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
    item.description.includes(fastSearch.value)
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
const searchFilter = ref<IInventoryFilter>({
  itemName: "",
  limit: 10,
});
const getFilterData = async (page = 1) => {
  dataPage.value = [];
  data.value = [];
  dataBase.value = [];
  isLoading.value = true;
  searchFilter.value.itemName = fastSearch.value;

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

  isLoading.value = false;
};
//#endregion
const openItem = (id: number | null) => {
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
  { caption: t("Item.Name"), value: "itemName" },
  { caption: t("Details"), value: "actions" },
  { caption: t("AvailableInStock"), value: "balance" },
  { caption: t("Price"), value: "price" },
  { caption: t("Stock"), value: "stockName" },
]);
</script>
<template>
  <IPage :HeaderTitle="t('Store.Index')" :isLoading="isLoading">
    <IPageContent>
      <IRow class="z-[999999]">
        <ISearchBar :getDataButton="getFilterData" class="min-w-[500px]">
          <ICol>
            <IInput
              :label="t('Title')"
              :placeholder="t('Search')"
              v-model="fastSearch"
              :type="EnumInputType.Text"
              :OnKeyEnter="getFilterData"
            />
          </ICol>
          <ICol v-if="data.length >= limits[0].id">
            <ISelect
              :label="t('Limit')"
              v-model="searchFilter.limit"
              name="archiveTypeId"
              :options="limits"
              :IsRequire="true"
              @onChange="getFilterData()"
            />
          </ICol>
        </ISearchBar>
      </IRow>
      <IRow>
        <ITable
          :items="data"
          :headers="headers"
          :show-pagination="false"
          :is-loading="isLoading"
        >
          <template v-slot:actions="{ row }">
            <dropdownmenu :openFn="() => openItem(Number(row.itemId))" />
          </template>
          <template v-slot:in="{ row }">
            <span
              class="bg-green-100 text-blue-800 text-16 font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-800 ml-2"
              >↓{{ Number(row.countIn) + Number(row.countReIn) }}</span
            >
          </template>
          <template v-slot:price="{ row }">
            <span> {{ ConvertToMoneyFormat(row.price) }}</span>
          </template>
          <template v-slot:out="{ row }">
            <span
              class="bg-red-100 text-blue-800 text-16 font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-800 ml-2"
              >↑{{ Number(row.countOut) + Number(row.countReOut) }}</span
            ></template
          >
          <template v-slot:count="{ row }">
            <span
              class="bg-blue-100 text-blue-800 text-16 font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-2"
              >{{ Number(row.count) }}
            </span></template
          >
        </ITable>
        <div class="py-4 min-w-full w-full h-full lg:px-8">
          <!-- card -->
          <div class="rounded-xl" v-if="isLoading == false">
            <div
              v-motion
              :initial="{ opacity: 0, y: -15 }"
              :enter="{ opacity: 1, y: 0 }"
              :variants="{ custom: { scale: 2 } }"
              :delay="200"
              v-if="data.length > 0"
            >
              <div class="w-full flex flex-row">
                <div class="basis-4/5 overflow-x-auto font-Tajawal">
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
                    name="Limit"
                    :options="limits"
                    :IsRequire="true"
                    @onChange="getFilterData()"
                  />
                </div>
              </div>
            </div>
          </div>
          <SimpleLoading v-if="isLoading"></SimpleLoading>
          <!-- end card -->
        </div>
      </IRow>
      <IRow v-if="data.length > 0">
        <div class="w-full flex flex-row">
          <div class="basis-5/5 hidden">
            <TailwindPagination
              class="flex justify-center mt-6"
              :data="dataPage"
              @pagination-change-page="getFilterData"
              :limit="searchFilter.limit"
            />
          </div>
        </div>
        <SimpleLoading v-if="isLoading">.</SimpleLoading>
      </IRow>
      <IRow>
        <div id="PageDataEnd"></div>
      </IRow>
    </IPageContent>
    <IFooterCrud :is-add="true" :show-add="false" />
  </IPage>
</template>
<style></style>
