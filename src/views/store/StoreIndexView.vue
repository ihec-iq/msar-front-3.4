<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageTitle from "@/components/general/namePage.vue";
import { TailwindPagination } from "laravel-vue-pagination";
import { useI18n } from "@/stores/i18n/useI18n";
import SimpleLoading from "@/components/general/loading.vue";
import type { IStore, IStoreFilter } from "@/types/IStore";
import { useStoringStore } from "@/stores/storing";
import ToolTipComponent from "@/components/ToolTipComponent.vue";
const { t } = useI18n();
const isLoading = ref(false);
const data = ref<Array<IStore>>([]);
const dataPage = ref();
const dataBase = ref<Array<IStore>>([]);

const { get_filter, get_summation } = useStoringStore();

const limits = reactive([
  { name: "6", val: 6, selected: true },
  { name: "12", val: 12, selected: false },
  { name: "24", val: 24, selected: false },
  { name: "50", val: 50, selected: false },
  { name: "All", val: 999999999 },
]);

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
  limit: 6,
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
    name: "storeItemHistory",
    params: { id: id },
  });
};
//#region Pagination
//#endregion
onMounted(async () => {
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  await getFilterData(1);
});
</script>
<template>
  <div class="justify-between flex">
    <PageTitle> {{ t("StoreIndex") }} </PageTitle>
  </div>
  <div class="flex">
    <!-- <Nav class="w-[5%]" /> -->
    <div class="lg:w-[95%] mb-12 lg:ml-[5%] xs:w-full md:mr-[2%]">
      <div
        class="flex lg:flex-row xs:flex-col lg:justify-around xs:items-center mt-6"
      >
        <label for="table-search" class="sr-only">{{ t("Search") }}</label>
        <div class="relative flex">
          <div
            class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
          >
            <svg
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            v-model="fastSearch"
            @input="makeFastSearch()"
            class="block p-2 pl-10 w-80 text-sm text-text dark:text-textLight bg-lightInput dark:bg-input rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :placeholder="t('SearchForItem')"
          />
        </div>
        <!-- limit -->
        <div
          class="limit flex items-center lg:ml-10 xs:ml-3 lg:w-[10%] xs:w-[81.5%]"
        >
          <div
            class="py-3 px-4 w-full flex items-center justify-between text-sm font-medium leading-none bg-sortByLight text-text dark:text-textLight dark:bg-button cursor-pointer rounded"
          >
            <p>{{ t("Sort By") }}:</p>
            <select
              aria-label="select"
              v-model="searchFilter.limit"
              class="focus:text-indigo-600 focus:outline-none bg-transparent ml-1"
              @change="getFilterData()"
            >
              <option
                v-for="limit in limits"
                :key="limit.val"
                :value="limit.val"
                :selected="limit.selected == true"
                class="text-sm text-indigo-800"
              >
                {{ limit.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="ml-4 lg:mt-0 xs:mt-2">
          <label class="cursor-pointer label">
            <span
              class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
            >
              {{ t("StoreTypeReport") }} :
              {{ searchFilter.summation ? " تجميعي " : " مفصل " }}</span
            >
            <input
              type="checkbox"
              v-model="searchFilter.summation"
              class="toggle toggle-secondary"
              checked
              @change="getFilterData()"
            />
          </label>
        </div>
        <div class="ml-4 lg:mt-0 xs:mt-2">
          <button
            @click="getFilterData()"
            class="bg-create hover:bg-createHover duration-500 h-10 w-32 rounded-lg text-white"
          >
            {{ t("Search") }}
          </button>
        </div>
      </div>
      <div class="w-full">
        <div class="flex flex-col">
          <div class="py-4 inline-block min-w-full lg:px-8">
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
                <div class="mt-10 p-6">
                  <div class="w-12/12 mx-2">
                    <div
                      class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
                    ></div>
                    <table
                      class="min-w-full text-center text-text dark:text-textLight shadow-md shadow-gray-400 dark:shadow-gray-800"
                    >
                      <thead
                        class="sticky top-0 font-semibold dark:bg-tableNew bg-white"
                      >
                        <tr>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            item
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            Serial Number
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            Available in Stock
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            Out
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            IN
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            Price
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            Stock
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            Actions
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
                  </div>

                  <TailwindPagination
                    class="flex justify-center mt-10"
                    :data="dataPage"
                    @pagination-change-page="getFilterData"
                    :limit="10"
                  />
                </div>
              </div>
            </div>
            <SimpleLoading v-if="isLoading"></SimpleLoading>
            <!-- end card -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
