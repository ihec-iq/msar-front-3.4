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
const getFilterData = async (page: number = 1) => {
  await getDataDaily();
  await getDataTime();
};
const getDataTime = async (page: number = 1) => {
  isLoadingTime.value = true;
  const searchFilter = ref<IVacationTimeFilter>({
    limit: limit.value,
    employeeId: employee.value.id,
  });
  await useVacationTimeStore()
    .get_filter(searchFilter.value, page)
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
const getDataDaily = async (page: number = 1) => {
  isLoadingTime.value = true;
  const searchFilter = ref<IVacationDailyFilter>({
    limit: limit.value,
    employeeId: employee.value.id,
  });
  await useVacationDailyStore()
    .get_filter(searchFilter.value, page)
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
const showData = async () => {
  Loading.value = true;
  await employeeStore
    .show(id.value)
    .then((response) => {
      if (response.status == 200) {
        if (response.data.data == undefined || response.data.data == null)
          window.location.reload();
        console.log(response.data);
        employee.value.id = response.data.data.id;
        employee.value.name = response.data.data.name;
        employee.value.Section.id = response.data.data.Section.id;
        employee.value.Section.name = response.data.data.Section.name;
        employee.value.isPerson = response.data.data.isPerson;
        isIn.value = response.data.data.isPerson == 0 ? false : true;
      }
    })
    .catch((errors) => {
      console.log(errors);
      Swal.fire({
        icon: "warning",
        title: "Your employee file not exist !!!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        router.go(-1);
      });
    });
  Loading.value = false;
};
//#endregion
const back = () => {
  router.back();
};
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
  await sectionStore.get_sections();
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = t("EmployeeAdd");
    employee.value.id = 0;
  } else {
    await showData();
    await getFilterData();
    employee.value.id = id.value;
    namePage.value = t("EmployeeUpdate");
  }
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
      <IRow :col="3" :col-md="2" :col-lg="3">
        <ICol :span-lg="1" :span-md="1" :span="1" :span-sm="1">
          <IInput
            :disabled="true"
            :label="t('Employee.Title')"
            v-model="employee.name"
          />
        </ICol>
        <ICol :span-lg="1" :span-md="1" :span="1" :span-sm="1">
          <IInput
            :disabled="true"
            :label="t('Employee.Section')"
            v-model="employee.Section.name"
          />
        </ICol>
      </IRow>
      <IRow>
        <ITable :items="dataVacationTime" :headers="headersTime">
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
      <IRow>
        <ITable :items="dataVacationDaily" :headers="headersDaily">
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
        <ITable :items="dataVacationSick" :headers="headersSick">
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
