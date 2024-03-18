<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageTitle from "@/components/general/namePage.vue";
import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utils/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import type { IStoreItemHistory, IStoreItemFilter } from "../IStore";
import { useStoringStore } from "../storingStore";
import { useOutputVoucherStore } from "@/project/warehouse/outputVoucher/outputVoucherStore";;
import { storeToRefs } from "pinia";
import { usePermissionStore } from "@/project/user/permissionStore";
const { checkPermissionAccessArray } = usePermissionStore();

const outputVoucherStore = useOutputVoucherStore();
const { outputVoucherEmployees } = storeToRefs(useOutputVoucherStore());

const isLoading = ref(false);
const data = ref<Array<IStoreItemHistory>>([]);
const dataPage = ref();
const dataBase = ref<Array<IStoreItemHistory>>([]);

const { get_item } = useStoringStore();

import { limits } from "@/utils/defaultParams";
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
const filterByIDName = (item: IStoreItemHistory) => {
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
const searchFilter = ref<IStoreItemFilter>({
  itemId: "0",
  limit: 10,
  serialNumber: "",
  summation: true,
  isEmployee: false,
  employeeId: 0,
});
const getFilterData = async (page = 1) => {
  dataPage.value = [];
  data.value = [];
  dataBase.value = [];
  isLoading.value = true;
  searchFilter.value.serialNumber = fastSearch.value;
  searchFilter.value.itemId = route.params.id.toString();
  await get_item(searchFilter.value, page)
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
const openItem = (id: number, billType: string) => {
  if (billType == "in") {
    router.push({
      name: "inputVoucherUpdate",
      params: { id: id },
    });
  } else {
    router.push({
      name: "outputVoucherUpdate",
      params: { id: id },
    });
  }
};
//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowStorage]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.id.toString() || "";
  await outputVoucherStore.getEmployees().then(() => {});

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
        <div
          class="limit flex items-center lg:ml-10 xs:ml-3 lg:w-[10%] xs:w-[81.5%]"
        >
          <div
            class="py-3 px-4 w-full flex items-center justify-between text-sm font-medium leading-none bg-sortByLight text-text dark:text-textLight dark:bg-button cursor-pointer rounded"
          >
            <p>{{ t("Employee") }}:</p>
            <select
              aria-label="select"
              v-model="searchFilter.employeeId"
              class="focus:text-indigo-600 focus:outline-none bg-transparent ml-1"
              @change="getFilterData()"
            >
              <option
                v-for="employee in outputVoucherEmployees"
                :key="employee.id"
                :value="employee.id"
                :selected="employee.id == 1"
                class="text-sm text-indigo-800"
              >
                {{ employee.name }}
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
                    <table class="min-w-full text-center">
                      <thead class="border-b bg-[#0003] text-gray-300">
                        <tr>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            {{ t("Item") }}
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            {{ t("SerialNumber") }}
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            {{ t("BillType") }}
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            {{ t("AvailableInStock") }}
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            {{ t("Price") }}
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            {{ t("Stock") }}
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            {{ t("Actions") }}
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-[#1f2937]">
                        <tr
                          v-for="row in data"
                          :key="row.itemName"
                          class="border-b border-black h-14 text-gray-100"
                        >
                          <th>{{ row.itemName }}</th>
                          <th>{{ row.serialNumber }}</th>
                          <th>{{ row.billType }}</th>
                          <th>
                            <span
                              v-if="row.count > 0"
                              class="bg-green-100 text-blue-800 text-16 font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-800 ml-2"
                              >↑{{ row.count }}</span
                            >
                            <span
                              v-else
                              class="bg-red-100 text-blue-800 text-16 font-bold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-800 ml-2"
                              >↓{{ row.count }}</span
                            >
                          </th>
                          <th>{{ row.price }}</th>
                          <th>{{ row.stockName }}</th>
                          <th>
                            <van-button
                              class="border-none duration-500 rounded-lg bg-create hover:bg-createHover"
                              type="success"
                              is-link
                              @click="openItem(row.itemId, row.billType)"
                              >Open
                            </van-button>
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>

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
                          <div
                            class="basis-1/5"
                            v-if="data.length >= limits[0].id"
                          >
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
                      </div>
                    </div>
                    <SimpleLoading v-if="isLoading"></SimpleLoading>
                    <!-- end card -->
                  </div>
                </div>
              </div>
            </div>
            <!-- end card -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
@/project/user/permissionStore@/views/Warehouse/OutputVoucher/outputVoucherStore@/views/Warehouse/warehouse/storingStore@/views/Warehouse/storingStore@/project/warehouse/IStore