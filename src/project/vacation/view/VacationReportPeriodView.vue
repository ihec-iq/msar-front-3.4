<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEmployeeStore } from "@/project/employee/employeeStore";
import { useSectionStore } from "@/project/section/sectionStore";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { usePermissionsStore } from "@/project/core/permissionStore";

import type {
  IVacationTime,
  IVacationTimeFilter,
} from "../vacationTime/IVacationTime";
import type {
  IVacationDaily,
  IVacationDailyFilter,
} from "../vacationDaily/IVacationDaily";
import type { IVacationSick } from "../vacationSick/IVacationSick";

//#region Stores
import { useVacationTimeStore } from "../vacationTime/vacationTimeStore";
import { useVacationDailyStore } from "../vacationDaily/vacationDailyStore";
import { useVacationSickStore } from "../vacationSick/vacationSickStore";

//endregion

//#region Data
import { limits } from "@/utilities/defaultParams";
import { TailwindPagination } from "laravel-vue-pagination";
import { EnumPermission } from "@/utilities/EnumSystem";
import { t } from "@/utilities/I18nPlugin";
import type { ITableHeader } from "@/types/core/components/ITable";
import IRow from "@/components/ihec/IRow.vue";
import ICol from "@/components/ihec/ICol.vue";
import IPage from "@/components/ihec/IPage.vue";
import IInput from "@/components/inputs/IInput.vue";
import ILabel from "@/components/ihec/ILabel.vue";
import ITable from "@/components/ihec/ITable.vue";
import type { IVacationFilter } from "../IVacation";
//#region Vars
const { checkPermissionAccessArray } = usePermissionsStore();
const namePage = ref("");
const route = useRoute();
const id = ref(Number(route.params.id));
const rtlStore = useRtlStore();
const isIn = ref(false);

const employeeStore = useEmployeeStore();
const { employee } = storeToRefs(useEmployeeStore());
const sectionStore = useSectionStore();
const { sections } = storeToRefs(useSectionStore());

const Loading = ref(false);

const router = useRouter();
const errors = ref<String | null>();
//#endregion
const limit = ref(10);
const dataVacationTime = ref<Array<IVacationTime>>([]);
const dataVacationDaily = ref<Array<IVacationDaily>>([]);
const dataVacationSick = ref<Array<IVacationSick>>([]);
const dataPageVacationTime = ref();
const dataPageVacationDaily = ref();
const dataPageVacationSick = ref();

const isLoadingTime = ref(false);
const isLoadingDaily = ref(false);
const isLoadingSick = ref(false);

//#endregion
//#region Functions
const fastSearch = ref("");

const searchFilter = ref<IVacationFilter>({
  employeeName: "",
  limit: 10,
  hasDate: true,
  dayFrom: new Date(Date.now() - 86400000).toISOString().split("T")[0],
  dayTo: new Date().toISOString().split("T")[0],
});
const getFilterData = async (page: number = 1) => {
  searchFilter.value.employeeName = fastSearch.value;
  searchFilter.value.limit = 1990;
  await getDataDaily(searchFilter.value);
  //await getDataTime(searchFilter.value);
};
const getDataTime = async (searchFilter: IVacationFilter, page: number = 1) => {
  isLoadingTime.value = true;
  await useVacationTimeStore()
    .get_filter(searchFilter, page)
    .then((response) => {
      if (response.status == 200) {
        dataPageVacationTime.value = response.data.data;
        dataVacationTime.value = response.data.data.data;
        console.log(dataPageVacationTime.value);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  isLoadingTime.value = false;
};
const getDataDaily = async (
  searchFilter: IVacationFilter,
  page: number = 1
) => {
  isLoadingTime.value = true;
  await useVacationDailyStore()
    .get_filter(searchFilter, page)
    .then((response) => {
      if (response.status == 200) {
        dataPageVacationDaily.value = response.data.data;
        dataVacationDaily.value = response.data.data.data;
        console.log(dataPageVacationDaily.value);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  isLoadingTime.value = false;
};
//#endregion

//region"Drag and Drop"

//#endregion

//#region CURD

const OpenVacationTime = (id: number) => {
  router.push({
    name: "vacationTimeUpdate",
    params: { id: id },
  });
};
const OpenVacationDaily = (id: number) => {
  router.push({
    name: "vacationDailyUpdate",
    params: { id: id },
  });
};
const OpenVacationSick = (id: number) => {
  router.push({
    name: "vacationSickUpdate",
    params: { id: id },
  });
};
onMounted(async () => {
  //console.log(can("show employees1"));
  checkPermissionAccessArray([EnumPermission.VacationReport]);
  await getFilterData();
});
const headersTime = ref<Array<ITableHeader>>([
  { caption: t("Employee.Title"), value: "name" },
  { caption: t("Vacation.Record"), value: "record" },
  { caption: t("VacationTime.TimeFrom"), value: "timeFrom" },
  { caption: t("VacationTime.TimeTo"), value: "timeTo" },
  { caption: t("VacationTime.Date"), value: "date" },
  { caption: t("Details"), value: "actions" },
]);
const headersDaily = ref<Array<ITableHeader>>([
  { caption: t("Employee.Title"), value: "name" },
  { caption: t("Vacation.Record"), value: "record" },
  { caption: t("Vacation.DayFrom"), value: "dayFrom" },
  { caption: t("Vacation.DayTo"), value: "dayTo" },
  { caption: t("Vacation.Date"), value: "date" },
  { caption: t("Details"), value: "actions" },
]);
const headersSick = ref<Array<ITableHeader>>([
  { caption: t("Employee.Title"), value: "name" },
  { caption: t("Vacation.Record"), value: "record" },
  { caption: t("Vacation.DayFrom"), value: "dayFrom" },
  { caption: t("Vacation.DayTo"), value: "dayTo" },
  { caption: t("Vacation.Date"), value: "date" },
  { caption: t("Details"), value: "actions" },
]);
</script>
<template>
  <IPage
    :HeaderTitle="t('Employee.VacationReport')"
    :is-loading="isLoadingDaily && isLoadingTime && isLoadingSick"
  >
    <IPageContent>
      <IRow :col="5" :col-md="2" :col-lg="4">
        <ISearchBar :getDataButton="getFilterData">
          <ICol :span-lg="1" :span-md="2" :span="1" :span-sm="4">
            <IInput
              :label="t('Title')"
              :placeholder="t('SearchForArchive')"
              v-model="fastSearch"
              type="text"
            />
          </ICol>
          <!-- date -->
          <ICol :span-lg="1" :span-md="2">
            <input
              id="default-checkbox"
              type="checkbox"
              v-model="searchFilter.hasDate"
              value=""
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              for="default-checkbox"
              class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {{ t("SearhFilter.enableDateFilter") }}</label
            >
          </ICol>
          <ICol :span-lg="1" :span-md="2" :span="1">
            <IInput
              :label="t('DateFrom')"
              v-model="searchFilter.dayFrom"
              name="issueDateFrom"
              type="date"
              :disabled="!searchFilter.hasDate"
            />
          </ICol>
          <ICol :span-lg="1" :span-md="2" :span="1">
            <IInput
              :label="t('DateTo')"
              v-model="searchFilter.dayTo"
              name="issueDateTo"
              type="date"
              :disabled="!searchFilter.hasDate"
            />
          </ICol>
        </ISearchBar>
      </IRow>

      <IRow>
        <ITable
          :items="dataVacationTime"
          :headers="headersTime"
          :title="t('VacationTime.Title')"
        >
          <template v-slot:name="{ row }">
            {{ row.Vacation.Employee.name }}
          </template>
          <template v-slot:actions="{ row }">
            <IDropdown>
              <li>
                <EditButton title="Open" @click="OpenVacationTime(row.id)" />
              </li>
            </IDropdown>
          </template>
        </ITable>
        <SimpleLoading v-if="isLoadingTime">.</SimpleLoading>
      </IRow>
      <IRow class="p-0">
        <ITable
          :items="dataVacationDaily"
          :headers="headersDaily"
          :title="t('VacationDaily.Title')"
        >
          <template v-slot:name="{ row }">
            {{ row.Vacation.Employee.name }}
          </template>
          <template v-slot:actions="{ row }">
            <IDropdown>
              <li>
                <EditButton title="Open" @click="OpenVacationDaily(row.id)" />
              </li>
            </IDropdown>
          </template>
        </ITable>
        <SimpleLoading v-if="isLoadingDaily">.</SimpleLoading>
      </IRow>
      <IRow>
        <ITable
          :items="dataVacationSick"
          :headers="headersSick"
          :title="t('VacationSick.Title')"
        >
          <template v-slot:name="{ row }">
            {{ row.Vacation.Employee.name }}
          </template>
          <template v-slot:actions="{ row }">
            <IDropdown>
              <li>
                <EditButton title="Open" @click="OpenVacationSick(row.id)" />
              </li>
            </IDropdown>
          </template>
        </ITable>
        <SimpleLoading v-if="isLoadingSick">.</SimpleLoading>
      </IRow>
      <IRow>
        <div id="PageDataEnd"></div>
      </IRow>
    </IPageContent>
    <IFooterCrud :is-add="true" :show-add="false"> </IFooterCrud>
  </IPage>
</template>
