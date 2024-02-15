<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageTitle from "@/components/general/namePage.vue";
import { TailwindPagination } from "laravel-vue-pagination";
import { useI18n } from "@/stores/i18n/useI18n";
import SimpleLoading from "@/components/general/loading.vue";
import { useVacationStore } from "@/stores/vacations/vacationStore";
import type { IVacationFilter, IVacation } from "@/types/vacation/IVacation";
import { usePermissionStore } from "@/stores/permissionStore";
import { isNumber } from "@vueuse/core";
const { checkPermissionAccessArray } = usePermissionStore();
import JsonExcel from "vue-json-excel3";

const { t } = useI18n();
const isLoading = ref(false);
const data = ref<Array<IVacation>>([]);
const dataPage = ref();
const dataBase = ref<Array<IVacation>>([]);

const { get_filter } = useVacationStore();

import { limits } from "@/utils/defaultParams";

const route = useRoute();
const router = useRouter();
watch(
  () => route.params.search,
  async (newValue) => {
    if (route.params.search != undefined) fastSearch.value = newValue.toString() || "";
    await getFilterData(1);
  }
);
//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (vacation: IVacation) => {
  if (vacation.Employee.name.includes(fastSearch.value)) {
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
const searchFilter = ref<IVacationFilter>({
  limit: 10,
  employeeName: "",
});
const getFilterData = async (page = 1) => {
  dataPage.value = [];
  data.value = [];
  dataBase.value = [];
  isLoading.value = true;
  searchFilter.value.employeeName = fastSearch.value;
  await get_filter(searchFilter.value, page)
    .then((response) => {
      if (response.status == 200) {
        dataPage.value = response.data.data;
        data.value = dataPage.value.data;
        dataBase.value = dataPage.value.data;
        makeExcel(data.value);
      }
    })
    .catch((error) => {
      console.log(error);
    });

  isLoading.value = false;
};
const makeExcel = (data: any) => {};
//#endregion
const openItem = (id: number) => {
  router.push({
    name: "vacationReportEmployee",
    params: { id: id },
  });
};
//#region Pagination
function round(num: number, fractionDigits: number = 3): number {
  return Number(num.toFixed(fractionDigits));
}
//#endregion
//#region Search by Enter Key

const inputRefSearch = ref<HTMLInputElement | null>(null);
const Search = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    await getFilterData(1);
  }
};
const ExportExcel = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    await getFilterData(1);
  }
};
//#endregion
onMounted(async () => {
  checkPermissionAccessArray(["vacation Report"]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  await getFilterData(1);
  if (inputRefSearch.value) {
    inputRefSearch.value.addEventListener("keydown", Search);
  }
});
const ToNumber = (val: any, numericFormat: boolean = true) => {
  if (isNaN(val) || isNumber(val) == false) {
    return 0;
  } else return round(val, 2);
};
const ToNumberShow = (val: any) => {
  if (isNaN(val) || isNumber(val) == false || val == 0) return;
  else return round(val, 2);
};
</script>
<template>
  <div class="justify-between flex">
    <PageTitle> {{ t("VacationIndex") }}</PageTitle>
  </div>
  <div class="flex">
    <!-- <Nav class="w-[5%]" /> -->
    <div class="lg:w-[95%] mb-12 lg:ml-[5%] xs:w-full md:mr-[2%]">
      <div class="flex lg:flex-row xs:flex-col lg:justify-around xs:items-center mt-6">
        <label for="table-search" class="sr-only">{{ t("VacationSearch") }}</label>
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
            ref="inputRefSearch"
            v-model="fastSearch"
            @input="makeFastSearch()"
            class="block p-2 pl-10 w-80 text-sm text-text dark:text-textLight bg-lightInput dark:bg-input rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :placeholder="t('VacationSearch')"
          />
        </div>
        <!-- limit -->
        <div class="limit flex items-center lg:ml-10 xs:ml-3 lg:w-[10%] xs:w-[81.5%]">
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
          <button
            @click="getFilterData()"
            class="bg-create hover:bg-createHover duration-500 h-10 w-32 rounded-lg text-white"
          >
            {{ t("VacationSearch") }}
          </button>
        </div>
        <div class="ml-4 lg:mt-0 xs:mt-2">
          <button
            @click="getFilterData()"
            class="bg-create hover:bg-createHover duration-500 h-10 w-32 rounded-lg text-white"
          >
            <JsonExcel :data="data" type="xlsx" name="filename.xls">
              Download Excel
            </JsonExcel>
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
                  <div class="w-12/12 mx-2 overflow-x-auto font-Tajawal">
                    <div
                      class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
                    ></div>
                    <table
                      class="min-w-full w-full text-center text-text dark:text-textLight shadow-md shadow-gray-400 dark:shadow-gray-800"
                    >
                      <thead
                        class="sticky top-0 font-semibold font-Tajawal_bold dark:bg-tableHeaderNew text-text dark:text-blue-300 bg-blue-300"
                      >
                        <tr>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            {{ t("Employee") }}
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            <!-- {{ t("VacationRecordReport") }} -->
                            الرصيد المستحق
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            <!-- {{ t("VacationOldRecordReport") }} -->
                            مجموع المستنفذ
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            <!-- {{ t("VacationOldRecordReport") }} -->
                            الرصيد المتبقي
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            <!-- {{ t("VacationOldRecordReport") }} -->
                            اجازات هذه السنة
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            {{ t("VacationSumTimeReport") }}
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            {{ t("VacationSumDailyReport") }}
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            <!-- {{ t("VacationRecordReport") }} -->
                            رصيد المرضية
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            <!-- {{ t("VacationOldRecordReport") }} -->
                            مستنفذ المرضية
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            <!-- {{ t("VacationOldRecordReport") }} -->
                            متبقي المرضية
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            {{ t("VacationSumSickReport") }}
                          </th>
                          <th scope="col" class="text-sm font-medium px-6 py-4">
                            {{ t("Details") }}
                          </th>
                        </tr>
                      </thead>
                      <tbody
                        class="dark:bg-designTableHead bg-white print:bg-white print:dark:bg-white mt-10 overflow-auto"
                      >
                        <tr
                          v-for="row in data"
                          :key="row.id"
                          class="print:text-text print:dark:text-text text-text dark:text-textLight print:bg-white print:dark:bg-white dark:hover:bg-tableBodyHover bg-white dark:bg-tableNew h-16 duration-300 border-gray-500 border-t"
                        >
                          <th>{{ row.Employee.name }}</th>
                          <th>
                            {{ ToNumberShow(row.oldRecord) }}
                          </th>
                          <th>
                            {{
                              ToNumberShow(
                                ToNumber(row.newRecord) +
                                  ToNumber(row.sumTime / 7) +
                                  ToNumber(row.sumDaily)
                              )
                            }}
                          </th>
                          <th>
                            {{
                              ToNumberShow(
                                row.oldRecord -
                                  ToNumber(
                                    ToNumber(row.newRecord) +
                                      ToNumber(row.sumTime / 7) +
                                      ToNumber(row.sumDaily)
                                  )
                              )
                            }}
                          </th>
                          <th>
                            {{ ToNumberShow(ToNumber(row.sumTime / 7) + row.sumDaily) }}
                          </th>
                          <th>
                            {{
                              ToNumberShow(row.sumTime) == undefined
                                ? ""
                                : ToNumber(row.sumTime, false) + " Hours"
                            }}
                          </th>
                          <th>{{ ToNumberShow(row.sumDaily) }}</th>

                          <th>
                            {{ ToNumberShow(row.oldRecordSick) }}
                          </th>
                          <th>
                            {{
                              ToNumberShow(
                                ToNumber(row.newRecordSick) + ToNumber(row.sumSick)
                              )
                            }}
                          </th>
                          <th>
                            {{
                              ToNumberShow(
                                row.oldRecordSick -
                                  ToNumber(
                                    ToNumber(row.newRecordSick) + ToNumber(row.sumSick)
                                  )
                              )
                            }}
                          </th>

                          <th>{{ ToNumberShow(row.sumSick) }}</th>

                          <th class="p-2">
                            <button
                              class="duration-500 h-10 w-24 rounded-lg bg-create hover:bg-createHover text-white"
                              is-link
                              @click="openItem(row.id)"
                            >
                              {{ t("Details") }}
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
@/stores/vacations/vacationStore@/stores/permissionStore