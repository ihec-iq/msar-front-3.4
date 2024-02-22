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
</script>
<template>
  <IPage :HeaderTitle="t('StoreIndex')">
    <IPageContent>
      <IRow :col="3" :col-md="2" :col-lg="3">
        <ISearchBar :getDataButton="getFilterData">
          <ICol :span-lg="2" :span-md="2" :span="2" :span-sm="4">
            <IInput
              :label="t('Title')"
              :placeholder="t('SearchForItem')"
              v-model="fastSearch"
              type="text"
            />
          </ICol>
          <!-- date -->
          <ICol :span-lg="1" :span-md="2" :span="1">
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
      <IRow
        ><div class="rounded-xl" v-if="isLoading == false">
          <div
            v-motion
            :initial="{ opacity: 0, y: -15 }"
            :enter="{ opacity: 1, y: 0 }"
            :variants="{ custom: { scale: 2 } }"
            :delay="200"
            v-if="data.length > 0"
          >
            <div class="max-w-full relative">
              <table
                class="min-w-full w-full text-center text-text dark:text-textLight shadow-md shadow-gray-400 dark:shadow-gray-800"
              >
                <thead
                  class="sticky top-0 font-semibold font-Tajawal_bold dark:bg-tableHeaderNew text-text dark:text-blue-300 bg-blue-300"
                >
                  <tr>
                    <th scope="col" class="text-sm font-medium px-6 py-4">
                      {{ t("Item") }}
                    </th>
                    <th scope="col" class="text-sm font-medium px-6 py-4">
                      {{ t("SerialNumber") }}
                    </th>
                    <th scope="col" class="text-sm font-medium px-6 py-4">
                      {{ t("AvailableInStock") }}
                    </th>
                    <th scope="col" class="text-sm font-medium px-6 py-4">
                      {{ t("Out") }}
                    </th>
                    <th scope="col" class="text-sm font-medium px-6 py-4">
                      {{ t("In") }}
                    </th>
                    <th scope="col" class="text-sm font-medium px-6 py-4">
                      {{ t("Stock") }}
                    </th>
                    <th scope="col" class="text-sm font-medium px-6 py-4">
                      {{ t("Employee") }}
                    </th>
                    <th scope="col" class="text-sm font-medium px-6 py-4">
                      {{ t("Actions") }}
                    </th>
                  </tr>
                </thead>
                <tbody
                  class="dark:bg-designTableHead bg-white print:bg-white print:dark:bg-white mt-10 overflow-auto"
                >
                  <tr
                    v-for="row in data"
                    :key="row.itemName"
                    class="print:text-text print:dark:text-text text-text dark:text-textLight print:bg-white print:dark:bg-white dark:hover:bg-tableBodyHover bg-white dark:bg-tableNew h-16 duration-300 border-gray-500 border-t"
                  >
                    <th>{{ row.itemName }}</th>
                    <th>{{ row.serialNumber }}</th>
                    <th>
                      <span
                        class="bg-blue-100 text-blue-800 text-16 font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-2"
                      >
                        {{ row.count }}
                      </span>
                    </th>
                    <th>
                      <span
                        v-if="Number(row.out) > 0"
                        class="bg-red-100 text-blue-800 text-16 font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-800 ml-2"
                        >↑{{ row.out }}</span
                      >
                    </th>
                    <th>
                      <span
                        v-if="Number(row.in) > 0"
                        class="bg-green-100 text-blue-800 text-16 font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-800 ml-2"
                        >↓{{ row.in }}</span
                      >
                    </th>
                    <th>{{ row.price }}</th>
                    <th>{{ row.stockName }}</th>
                    <th>
                      <button
                        class="duration-500 h-10 w-24 rounded-lg bg-create hover:bg-createHover text-white"
                        is-link
                        @click="openItem(row.itemId)"
                      >
                        Open
                      </button>
                    </th>
                  </tr>
                </tbody>
              </table>
              <TailwindPagination
                class="flex justify-center mt-10"
                :data="dataPage"
                @pagination-change-page="getFilterData"
                :limit="searchFilter.limit"
              />
              <ISelect
                v-if="data.length >= searchFilter.limit"
                :label="t('Limit')"
                v-model="searchFilter.limit"
                name="archiveTypeId"
                :options="limits"
                @change="getFilterData()"
              />
            </div>
          </div>
        </div>
        <SimpleLoading v-if="isLoading">.</SimpleLoading></IRow
      >
      <IRow><div id="PageDataEnd"></div></IRow>
    </IPageContent>
  </IPage>
</template>
<style></style>
