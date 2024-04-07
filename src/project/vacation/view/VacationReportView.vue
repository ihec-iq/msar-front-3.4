<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TailwindPagination } from "laravel-vue-pagination";
import { useI18n } from "@/stores/i18n/useI18n";
import SimpleLoading from "@/components/general/loading.vue";
import { useVacationStore } from "../vacationStore";
import type { IVacationFilter, IVacation } from "../IVacation";
import { usePermissionStore } from "@/project/user/permissionStore";
import { isNumber } from "@/utilities/tools";
const { checkPermissionAccessArray } = usePermissionStore();
import JsonExcel from "vue-json-excel3";

const { t } = useI18n();
const isLoading = ref(false);
const data = ref<Array<IVacation>>([]);
const dataPage = ref();
const dataBase = ref<Array<IVacation>>([]);

const { get_filter } = useVacationStore();

import { limits } from "@/utilities/defaultParams";
import type { ITableHeader } from "@/types/core/components/ITable";
import { EnumPermission } from "@/utilities/EnumSystem";
import ITable from "@/components/ihec/ITable.vue";
import IDropdown from "@/components/ihec/IDropdown.vue";
import ShowButton from "@/components/dropDown/ShowButton.vue";

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
  checkPermissionAccessArray([EnumPermission.VacationReport]);
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

const headers = ref<Array<ITableHeader>>([
  { caption: t("Employee.Title"), value: "name" },
  { caption: "الرصيد المستحق", value: "deservedRecord" },
  { caption: "مجموع المستنفذ", value: "totalTaken" },
  { caption: "الرصيد المتبقي", value: "remaining" },
  { caption: "اجازات هذه السنة", value: "currentYearVacations" },
  { caption: t("VacationSumTimeReport"), value: "currentYearTimeVacations" },
  { caption: t("VacationSumDailyReport"), value: "currentYearDailyVacations" },
  { caption: "رصيد المرضية", value: "deservedSickRecord" },
  { caption: "مستنفذ المرضية", value: "takenSick" },
  { caption: "متبقي المرضية", value: "remainingSick" },
  { caption: t("Details"), value: "actions" },
]);
const headersExcel = {
  الاسم: "name",
  "الرصيد المستحق": "deservedRecord",
  "مجموع المستنفذ": "totalTaken",
  "الرصيد المتبقي": "remaining",
  "اجازات هذه السنة": "currentYearVacations",
  "الاجزات الزمنية": "currentYearTimeVacations",
  "الاجازات الاعتيادية": "currentYearDailyVacations",
  "رصيد المرضية": "deservedSickRecord",
  "مستنفذ المرضية": "takenSick",
  "متبقي المرضية": "remainingSick",
};
</script>
<template>
  <IPage :HeaderTitle="t('VacationIndex')">
    <template #HeaderButtons>
      <button
        @click="getFilterData()"
        class="bg-create hover:bg-createHover duration-500 h-10 w-32 rounded-lg text-white"
      >
        <JsonExcel
          :data="data"
          :fields="headersExcel"
          type="xlsx"
          name="filename.xlsx"
        >
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
              :OnKeyEnter="getFilterData"
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
                  <ITable :items="data" :headers="headers">
                    <template v-slot:name="{ row }">
                      <span>{{ row.Employee.name }}</span>
                    </template>
                    <template v-slot:deservedRecord="{ row }">
                      <span> {{ ToNumberShow(row.deservedRecord) }}</span>
                    </template>
                    <template v-slot:totalTaken="{ row }">
                      <span> {{ ToNumberShow(row.totalTaken) }}</span>
                    </template>
                    <template v-slot:remaining="{ row }">
                      <span> {{ ToNumberShow(row.remaining) }}</span>
                    </template>
                    <template v-slot:currentYearVacations="{ row }">
                      <span> {{ ToNumberShow(row.currentYearVacations) }}</span>
                    </template>
                    <template v-slot:currentYearTimeVacations="{ row }">
                      <span> {{ row.currentYearTimeVacations }}</span>
                    </template>
                    <template v-slot:currentYearDailyVacations="{ row }">
                      <span>
                        {{ ToNumberShow(row.currentYearDailyVacations) }}</span
                      >
                    </template>
                    <template v-slot:deservedSickRecord="{ row }">
                      <span> {{ ToNumberShow(row.deservedSickRecord) }}</span>
                    </template>
                    <template v-slot:takenSick="{ row }">
                      <span> {{ ToNumberShow(row.takenSick) }}</span>
                    </template>
                    <template v-slot:remainingSick="{ row }">
                      <span> {{ ToNumberShow(row.remainingSick) }}</span>
                    </template>
                    <template v-slot:actions="{ row }">
                      <IDropdown>
                        <li>
                          <ShowButton @click="openItem(row.id)" />
                        </li>
                      </IDropdown>
                    </template>
                  </ITable>
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
@/project/vacation/vacationStore@/project/vacation/IVacation@/project/user/permissionStore@/utilities/tools@/utilities/defaultParams@/utilities/EnumSystem
