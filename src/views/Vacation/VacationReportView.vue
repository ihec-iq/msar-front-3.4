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
    if (route.params.search != undefined)
      fastSearch.value = newValue.toString() || "";
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
  <IPage :HeaderTitle="t('VacationIndex')">
    <template #HeaderButtons>
      <button
        @click="getFilterData()"
        class="bg-create hover:bg-createHover duration-500 h-10 w-32 rounded-lg text-white"
      >
        <JsonExcel :data="data" type="xlsx" name="filename.xls">
          Download Excel
        </JsonExcel>
      </button>
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
            />
          </ICol>
        </ISearchBar>
      </IRow>
      <IRow
        ><div class="flex flex-col">
          <div class="inline-block min-w-full">
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
                <div class="mb-5">
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
                            {{
                              ToNumberShow(
                                ToNumber(row.sumTime / 7) + row.sumDaily
                              )
                            }}
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
                                ToNumber(row.newRecordSick) +
                                  ToNumber(row.sumSick)
                              )
                            }}
                          </th>
                          <th>
                            {{
                              ToNumberShow(
                                row.oldRecordSick -
                                  ToNumber(
                                    ToNumber(row.newRecordSick) +
                                      ToNumber(row.sumSick)
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
        </div></IRow
      >
    </IPageContent>
  </IPage>
  <div class="flex">
    <div class="lg:w-[95%] mb-12 lg:ml-[5%] xs:w-full md:mr-[2%]">
      <div class="w-full"></div>
    </div>
  </div>
</template>
