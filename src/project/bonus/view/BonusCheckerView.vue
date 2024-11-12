<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBonusStore } from "../bonusStore";
import { useSectionStore } from "@/project/section/sectionStore";

import { storeToRefs } from "pinia";

import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utilities/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import type { IBonus, IBonusFilter } from "../IBonus";
import { usePermissionsStore } from "@/project/core/permissionStore";
const { checkPermissionAccessArray } = usePermissionsStore();
const isLoading = ref(false);
const { Bonus } = storeToRefs(useBonusStore());
const { sections } = storeToRefs(useSectionStore());

const data = ref<Array<IEmployee>>([]);
const dataPage = ref();
const dataBase = ref<Array<IEmployee>>([]);
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
  bound: 0
});
const getFilterData = async (page = 1) => {
  localStorage.setItem("checkBonus", page.toString());
  isLoading.value = true;
  searchFilter.value.employeeName = fastSearch.value;
  searchFilter.value.bound = searchFilter.value.bound == 0 ? 0 : searchFilter.value.bound;
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
  await SettingStore.showByKey(SettingNumberDayesAlertBonus.value.key).then((response) => {
    Object.assign(SettingNumberDayesAlertBonus.value, response);
    if (SettingNumberDayesAlertBonus.value.valInt == 0) {
      SettingNumberDayesAlertBonus.value.valInt = 30;
    } else if (SettingNumberDayesAlertBonus.value.valInt === undefined) {
      location.reload();
    }
    searchFilter.value.bound = SettingNumberDayesAlertBonus.value.valInt;
  })
  let index = 1;

  if (localStorage.getItem("checkBonus") != undefined)
    index = Number(localStorage.getItem("checkBonus"));
  await getFilterData(index);
  //isLoading.value = false;
});

const headers = ref<Array<ITableHeader>>([
  { caption: t("Employee.Title"), value: "name" },
  { caption: t("Details"), value: "actions" },
  { caption: t("Bonus.dateLastBonus"), value: "dateLastBonus" },
  { caption: t("Bonus.difNextDate"), value: "difNextDateShow" },
  { caption: t("Bonus.dateNextBonus"), value: "dateNextBonus" },
  { caption: t("Bonus.Study"), value: "bonusStudy" },
  { caption: t("Bonus.DegreeStage"), value: "bonusDegreeStage" },
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
            <IInput   :placeholder="t('SearchForUser')" v-model="fastSearch"
              :type="EnumInputType.Text" :OnKeyEnter="getFilterData" />
          </ICol>
          <!-- date -->
          <!-- <ICol :span-lg="1" :span-md="2" :span="1">
            <ISelect :label="t('BonusSection')" v-model="searchFilter.sectionId"
              :options="sections" :IsRequire="true" @onChange="getFilterData()" />
          </ICol> -->
          <ICol :span-lg="3" :span-md="3" :span="1" class="flex items-center justify-center">
            <ICheckbox :label="t('Bonus.IsBoundFilter') + ' ' + t('Days')" v-model="searchFilter.isBound"
              :IsRequire="true" @onChange="getFilterData()" class="flex items-center justify-center" />
            <IInput v-model="searchFilter.bound" :disabled="!searchFilter.isBound" :type="EnumInputType.Number" class="w-[100px]" @keyup.enter="getFilterData" />
          </ICol>
        </ISearchBar>
      </IRow>
      <IRow>
        <ITable :items="data" :headers="headers">
          <template v-slot:difNextDateShow="{ row }">
            <span>{{ row.difNextDate + " " + t('Day') }} </span>
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