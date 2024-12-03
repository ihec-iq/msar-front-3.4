<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBonusStore } from "../bonusStore";
import { useSectionStore } from "@/project/section/sectionStore";

import { storeToRefs } from "pinia";

import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utilities/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import type { IBonus, IBonusEmployeeChecker, IBonusFilter } from "../IBonus";
import { usePermissionsStore } from "@/project/core/permissionStore";
const { checkPermissionAccessArray } = usePermissionsStore();
const isLoading = ref(false);
const { Bonus } = storeToRefs(useBonusStore());
const { sections } = storeToRefs(useSectionStore());

const IdPage = "BonusChecker";
const data = ref<Array<IBonusEmployeeChecker>>([]);
const dataPage = ref();
const dataBase = ref<Array<IBonusEmployeeChecker>>([]);
const { get_checkBonus, calculateBonus } = useBonusStore();

import { limits } from "@/utilities/defaultParams";
import IButton from "@/components/ihec/IButton.vue";
import ISelect from "@/components/inputs/ISelect.vue";
import { EnumPermission, EnumSetting } from "@/utilities/EnumSystem";
import type { ITableHeader } from "@/types/core/components/ITable";
import IPage from "@/components/ihec/IPage.vue";
import { IEmployee } from "@/project/employee/IEmployee";
import ICheckbox from "@/components/inputs/ICheckbox.vue";
import { useSettingStore } from "@/project/core/settingStore";
import { ISetting } from "@/project/core/ISetting";
import ITable from "@/components/ihec/ITable.vue";
import IDropdown from "@/components/ihec/IDropdown.vue";
import { getError } from "@/utilities/helpers";
import Swal from "sweetalert2";
import IInput from "@/components/inputs/IInput.vue";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";
import ISearchBar from "@/components/ihec/ISearchBar.vue";
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
const filterByIDName = (Bonus: IBonus) => {
  if (Bonus.Employee.name.includes(fastSearch.value)) {
    return true;
  } else return false;
};
const makeFastSearch = () => {
  return;
  // eslint-disable-next-line no-self-assign
  // if (fastSearch.value == "") data.value = dataBase.value;
  // else {
  //   data.value = dataBase.value.filter(filterByIDName);
  // }
};
//#endregion
//#region Search
const SettingStore = useSettingStore();
const SettingNumberDayesAlertBonus = ref<ISetting>({
  id: 0,
  key: EnumSetting.SettingNumberDayesAlertBonus,
});
const searchFilter = ref<IBonusFilter>({
  employeeName: "",
  limit: 10,
  title: "",
  isBound: true,
  bound: 0,
});
const printAll = () => {
  printWindow();
  return;
};
const printWindow = () => {
  // Pass the element id here
  //paperize();

  const prtHtml = document.getElementById("printMe")?.innerHTML;
  // Get all stylesheets HTML
  let stylesHtml = "";
  for (const node of [
    ...document.querySelectorAll('link[rel="stylesheet"], style'),
  ]) {
    stylesHtml += node.outerHTML;
  }
  // Open the print window
  const WinPrint = window.open(
    "",
    "",
    "left=0,top=0, toolbar=0,scrollbars=0,status=0"
  );

  WinPrint?.document.write(`<!DOCTYPE html>
<html>
  <head>
    ${stylesHtml}
    <style>
         body {
         -webkit-print-color-adjust: exact; /*Chrome,Safari,Edge*/
         color-adjust: exact;              /* firefox*/
         }
    </style>
  </head>
  <body style="background-color: white">
    ${prtHtml}
  </body>
</html>`);
  var options = {
    silent: false,
    printBackground: true,
    color: false,
    margin: {
      marginType: "printableArea",
    },
    landscape: true,
    pagesPerSheet: 1,
    collate: false,
    copies: 1,
    header: "Header of the Page",
    footer: "Footer of the Page",
  };
  setTimeout(function () {
    // wait until all resources loaded
    WinPrint?.document.close(); // necessary for IE >= 10
    WinPrint?.focus(); // necessary for IE >= 10
    WinPrint?.print(); // change window to winPrint
    WinPrint?.close(); // change window to winPrint
  }, 250);
};
const getFilterData = async (page = 1) => {
  localStorage.setItem("index" + IdPage, page.toString());
  isLoading.value = true;
  searchFilter.value.employeeName = fastSearch.value;
  searchFilter.value.bound =
    searchFilter.value.bound == 0 ? 0 : searchFilter.value.bound;
  await get_checkBonus(searchFilter.value, page)
    .then((response) => {
      if (response.status == 200) {
        dataPage.value = response.data.data;
        data.value = response.data.data.data;
        dataBase.value = response.data.data.data;
      }
    })
    .catch((error) => {
      let errors = getError(error);
      Swal.fire({
        icon: "error",
        title: "create new data fails!!!",
        text: errors,
        footer: "",
      });
      console.log(error);
    });
  isLoading.value = false;
};
//#endregion
const update = (id: number) => {
  router.push({
    name: "employeeUpdate",
    params: { id: id },
  });
};
const addBound = (employeeId: number) => {
  router.push({
    name: "bonusAddByEmployee",
    params: { employeeId: employeeId },
  });
};
const recheck = async () => {
  isLoading.value = true;
  await calculateBonus(searchFilter.value);
  await getFilterData(1);
  isLoading.value = false;
};
//#region Pagination
//#endregion
onMounted(async () => {
  isLoading.value = true;
  checkPermissionAccessArray([EnumPermission.ShowEmployees]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  await SettingStore.showByKey(SettingNumberDayesAlertBonus.value.key).then(
    (response) => {
      Object.assign(SettingNumberDayesAlertBonus.value, response);
      if (SettingNumberDayesAlertBonus.value.valInt == 0) {
        SettingNumberDayesAlertBonus.value.valInt = 30;
      } else if (SettingNumberDayesAlertBonus.value.valInt === undefined) {
        location.reload();
      }
      searchFilter.value.bound = SettingNumberDayesAlertBonus.value.valInt;
    }
  );
  let check = await localStorage.getItem("check" + IdPage);
  if (check != undefined)
    searchFilter.value.isBound = check == "1" ? true : false;

  let index = 1;

  if (localStorage.getItem("index" + IdPage) != undefined)
    index = Number(localStorage.getItem("index" + IdPage));
  await getFilterData(index);
  //isLoading.value = false;
});
const changeCheck = () => {
  localStorage.setItem(
    "check" + IdPage,
    searchFilter.value.isBound ? "1" : "0"
  );
};
const headers = ref<Array<ITableHeader>>([
  { caption: t("#"), value: "checkId" },
  { caption: t("Employee.Title"), value: "name" },
  { caption: t("Details"), value: "actions" },
  { caption: t("Bonus.dateLastBonus"), value: "dateLastBonus" },
  { caption: t("Bonus.difNextBonusDate"), value: "difNextBonusDate" },
  { caption: t("Bonus.dateNextBonus"), value: "dateNextBonus" },
  { caption: t("Bonus.Study"), value: "study" },
  { caption: t("Bonus.Certificate"), value: "certificate" },
  { caption: t("Bonus.DegreeStage"), value: "degreeStage" },
  { caption: t("Bonus.Add"), value: "btnAddBound" },
]);
</script>
<template>
  <IPage :HeaderTitle="t('Bonus.Alert')" :is-loading="isLoading">
    <template #HeaderButtons>
      <IButton width="28" :onClick="recheck" :text="t('Bonus.ReCalculate')" />
    </template>
    <IPageContent>
      <IRow :col="1" :col-md="1" :col-lg="1" class="scroll-auto">
        <ISearchBar :getDataButton="getFilterData">
          <ICol :span-lg="3" :span-md="3" :span="2" :span-sm="4">
            <IInput :placeholder="t('SearchForUser')" v-model="fastSearch" :type="EnumInputType.Text"
              :OnKeyEnter="getFilterData" />
          </ICol>
          <!-- date -->
          <!-- <ICol :span-lg="1" :span-md="2" :span="1">
            <ISelect :label="t('BonusSection')" v-model="searchFilter.sectionId"
              :options="sections" :IsRequire="true" @onChange="getFilterData()" />
          </ICol> -->
          <ICol :span-lg="3" :span-md="3" :span="1" class="flex items-center justify-center">
            <ICheckbox :label="t('Bonus.IsBoundFilter') + ' ' + t('Days')" v-model="searchFilter.isBound"
              :IsRequire="true" @Change="
                getFilterData();
              changeCheck();
              " class="flex items-center justify-center" />
            <IInput v-model="searchFilter.bound" :disabled="!searchFilter.isBound" :type="EnumInputType.Number"
              class="w-[100px]" @keyup.enter="getFilterData" />
          </ICol>
          <ICol :span-lg="3" :span-md="3" :span="1" class="flex items-center justify-center">
            <IButton :onClick="printAll" :text="t('Print')" />
          </ICol>
        </ISearchBar>

      </IRow>
      <IRow id="PrintArea hidden">
        <div id="printMe" class="[print-color-adjust:exact] p-1 hidden">
          <div class="overflow-auto">
            <div
              class="flex items-center content-center justify-center text-md font-bold w-[1040px] border-black border-x-2 border-t-2">
              استحقاق العلاوة السنوية لموظفي كادر مكتب انتخابات كربلاء
            </div>
            <table class="table-fixed text-sm w-[1040px]" dir="rtl">
              <thead>
                <tr class="bg-gray-300">
                  <th class="tdborderx w-[30px]">ت</th>
                  <th class="tdborderx">الاسم</th>
                  <th class="tdborderx">المكتب</th>
                  <th class="tdborderx">القسم</th>
                  <th class="tdborderx">التحصيل الدراسي</th>
                  <th class="tdborderx">الشهادة الدراسية</th>
                  <th class="tdborderx">العنوان الوظيفي</th>
                  <th class="tdborderx w-[330px]">
                    <table class="text-sm">
                      <thead>
                        <tr>
                          <th>الاستحقاق السابق</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="p-0 m-0">
                            <table>
                              <thead>
                                <tr class="border-t-2 border-black">
                                  <th class="border-black border-l-2 border-solid w-[70px]">
                                    تاريخ الاستحقاق
                                  </th>
                                  <th
                                    class="border-black border-r-2 border-solid w-[24px] [writing-mode:vertical-lr] rotate-180">
                                    الدرجة
                                  </th>
                                  <th
                                    class="border-black border-r-2 border-solid w-[24px] [writing-mode:vertical-lr] rotate-180">
                                    المرحلة
                                  </th>
                                  <th class="border-black border-r-2 border-solid w-[44px]">
                                    مقدار الراتب
                                  </th>
                                  <th class="border-black border-r-2 border-solid">
                                    كتب الشكر والتقدير والعقوبات والغيابات
                                    والاجازات
                                  </th>
                                </tr>
                              </thead>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </th>
                  <th class="tdborderx w-[330px]">
                    <table>
                      <thead>
                        <tr>
                          <th>الاستحقاق الجديد</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="p-0 m-0">
                            <table>
                              <thead class="text-sm">
                                <tr class="border-t-2 border-black">
                                  <th class="border-black border-l-2 border-solid w-[70px]">
                                    تاريخ الاستحقاق
                                  </th>
                                  <th
                                    class="border-black border-r-2 border-solid w-[24px] [writing-mode:vertical-lr] rotate-180">
                                    الدرجة
                                  </th>
                                  <th
                                    class="border-black border-r-2 border-solid w-[24px] [writing-mode:vertical-lr] rotate-180">
                                    المرحلة
                                  </th>
                                  <th class="border-black border-r-2 border-solid w-[44px]">
                                    مقدار الراتب
                                  </th>
                                  <th class="border-black border-r-2 border-solid w-[164px]">
                                    كتب الشكر والتقدير والعقوبات والغيابات
                                    والاجازات
                                  </th>
                                </tr>
                              </thead>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </th>
                </tr>
              </thead>
              <tbody class="text-[12px]">
                <tr v-for="row in data" :key="row.id" class="border-2 border-black text-[12px] text-center">
                  <td class="tdborderx">{{ row.id }}</td>
                  <td class="tdborderx">{{ row.name }}</td>
                  <td class="tdborderx">مكتب انتخابات كربلاء</td>
                  <td class="tdborderx">{{ row.employeeDepartment }}</td>
                  <td class="tdborderx">{{ row.study }}</td>
                  <td class="tdborderx">{{ row.certificate }}</td>
                  <td class="tdborderx">{{ row.bonusJobTitle }}</td>
                  <td class="tdborderx p-0 m-0 align-top">
                    <div class="inline-block p-0 m-0 text-center align-top h-full">
                      <div class="inline-block p-0 m-0 text-wrap w-[69px]">
                        <span class="flex mx-0 px-0 border-black border-l-2 border-b-2 border-solid">
                          <span class="border-l-2 border-black !w-[30px]">{{ row.dateLastBonus?.slice(0, 4) }}</span>
                          <span class="border-l-2 border-black !w-[20px]">{{ row.dateLastBonus?.slice(5, 7) }}</span>
                          <span class="!w-[21px]">{{ row.dateLastBonus?.slice(8, 10) }}</span>
                        </span>
                      </div>
                      <div
                        class="inline-block p-0 m-0 text-wrap w-[24px] align-top h-full  border-l-2 border-b-2  border-black">
                        {{ row.degree }}
                      </div>
                      <div
                        class="inline-block p-0 m-0 text-wrap w-[24px] align-top h-full  border-l-2 border-b-2  border-black">
                        {{ row.stage }}
                      </div>
                      <div class="inline-block p-0 m-0 text-wrap w-[44px] align-top h-full    border-b-2  border-black">
                        {{ row.salary }}
                      </div>
                    </div>
                    <div class="inline-block w-[165px] align-top h-full border-r-2  border-b-2 border-black">
                      {{ row.lastBonus.notes }}
                    </div>


                  </td>
                  <td class="p-0 m-0 align-top">
                    <div class="inline-block p-0 m-0 text-center align-top h-full">
                      <div class="inline-block p-0 m-0 text-wrap w-[69px]">
                        <span class="flex mx-0 px-0 border-black border-l-2 border-b-2 border-solid">
                          <span class="border-l-2 border-black !w-[30px]">{{ row.dateNextBonus?.slice(0, 4) }}</span>
                          <span class="border-l-2 border-black !w-[20px]">{{ row.dateNextBonus?.slice(5, 7) }}</span>
                          <span class="!w-[21px]">{{ row.dateNextBonus?.slice(8, 10) }}</span>
                        </span>
                      </div>
                      <div
                        class="inline-block p-0 m-0 text-wrap w-[24px] align-top h-full  border-l-2 border-b-2  border-black">
                        {{ row.degreeNext }}
                      </div>
                      <div
                        class="inline-block p-0 m-0 text-wrap w-[24px] align-top h-full  border-l-2 border-b-2  border-black">
                        {{ row.stageNext }}
                      </div>
                      <div class="inline-block p-0 m-0 text-wrap w-[44px] align-top h-full    border-b-2  border-black">
                        {{ row.salaryNext }}
                      </div>
                    </div>
                    <div class="inline-block w-[165px] align-top h-full border-r-2  border-b-2 border-black">
                      {{ row.notesNext }}
                    </div>
                  </td>


                  <!-- <td class="relative text-wrap">                     
                    <div class=" absolute top-0 right-0 flex mx-0 px-0 border-black border-l-2 border-solid h-full !w-[71px]">
                        <span class="border-l-2 border-black !w-[30px]">{{ row.dateNextBonus?.slice(0,4) }}</span>
                        <span class="border-l-2 border-black !w-[20px]">{{ row.dateNextBonus?.slice(5,7) }}</span>
                        <span class="!w-[21px]">{{ row.dateNextBonus?.slice(8,10) }}</span>
                      </div>
                    <div class="absolute top-0 right-[71px] border-black border-l-2 border-solid w-[24px] text-center h-full">
                      {{ row.degreeNext }}
                    </div>
                    <div class="absolute top-0 right-[95px] border-black border-l-2 border-solid w-[24px] text-center h-full">
                      {{ row.stageNext }}
                    </div>
                    <div
                      class="absolute top-0 right-[119px] border-black border-l-2 border-solid w-[44px] text-center h-full">
                      {{ row.salaryNext }}
                    </div>
                    <div class="absolute top-0 right-[164px] w-[164px] text-center text-wrap z-0 h-full">
                      {{ row.notesNext }}
                    </div>
                  </td> -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </IRow>
      <IRow>
        <ITable :items="data" :headers="headers">
          <template v-slot:checkId="{ row }">
            <input type="checkbox" :value="row.checked" />
          </template>
          <template v-slot:difNextBonusDate="{ row }">
            <span>{{ row.difNextBonusDate + " " + t("Day") }} </span>
          </template>
          <template v-slot:actions="{ row }">
            <IDropdown>
              <li>
                <EditButton title="Employee.Info" class="p-0 m-0" @click="update(row.id)" />
              </li>
            </IDropdown>
          </template>
          <template v-slot:btnAddBound="{ row }">
            <IButton @click="addBound(row.id)" icon="mdi-bookmark-plus" type="outlined" :text="t('Bonus.Add')" />
          </template>
        </ITable>
        <IRow v-if="data.length > 0">
          <!-- <IPagination
            :data="data"
            :data-page="dataPage"
            :limits="limits"
            :get-filter-data="getFilterData"
            :searchFilter="searchFilter"
          ></IPagination> -->
          <div class="w-full flex flex-row">
            <div class="basis-4/5 overflow-auto">
              <TailwindPagination class="flex justify-center mt-6" :data="dataPage"
                @pagination-change-page="getFilterData" :limit="searchFilter.limit" />
            </div>
            <div class="basis-1/5" v-if="data.length >= limits[0].id">
              <ISelect name="limit" :label="t('Limit')" v-model="searchFilter.limit" :options="limits" :IsRequire="true"
                @onChange="getFilterData()" />
            </div>
          </div>
          <SimpleLoading v-if="isLoading">.</SimpleLoading>
        </IRow>
        <SimpleLoading v-if="isLoading">.</SimpleLoading>
      </IRow>

      <IRow>
        <div id="PageDataEnd"></div>
      </IRow>
    </IPageContent>
    <IFooterCrud :is-add="true" :show-add="false"> </IFooterCrud>
  </IPage>
</template>
<style scoped>
.tdborderx {
  @apply border-2 border-black border-x-2 border-solid;
}
</style>
