<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBonusStore } from "../bonusStore";

import { storeToRefs } from "pinia";

import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utilities/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import type { IBonus, IBonusFilter } from "../IBonus";
import { usePermissionsStore } from "@/project/core/permissionStore";
const { checkPermissionAccessArray } = usePermissionsStore();
const isLoading = ref(false);
// const { hrDocuments } = storeToRefs(useHrDocumentStore());
// const { hrDocumentTypes } = storeToRefs(useHrDocumentStore());

const data = ref<Array<IBonus>>([]);
const dataPage = ref();
const dataBase = ref<Array<IBonus>>([]);
const { get_filter } = useBonusStore();

import { limits } from "@/utilities/defaultParams";
import IButton from "@/components/ihec/IButton.vue";
import ISelect from "@/components/inputs/ISelect.vue";
import { EnumPermission } from "@/utilities/EnumSystem";
import type { ITableHeader } from "@/types/core/components/ITable";
import IPage from "@/components/ihec/IPage.vue";
import IInput from "@/components/inputs/IInput.vue";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";

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
const add = () => {
  useBonusStore().resetDataBonus();
  router.push({
    name: "bonusAdd",
  });
};

//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (bonuses: IBonus) => {
  if (bonuses.Employee.name.includes(fastSearch.value)) {
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
const searchFilter = ref<IBonusFilter>({
  title: "",
  limit: 10,
  employeeName: "",
});
const getFilterData = async (page = 1) => {
  localStorage.setItem("indexBonuses", page.toString());

  isLoading.value = true;
  searchFilter.value.employeeName = fastSearch.value.toString();
  //searchFilter.value.title = fastSearch.value.toString();
  await get_filter(searchFilter.value, page)
    .then((response) => {
      console.log(response.data.data);

      if (response.status == 200) {
        dataPage.value = response.data.data;
        data.value = response.data.data.data;
        dataBase.value = response.data.data.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  isLoading.value = false;
};
//#endregion
const update = (id: number) => {
  router.push({
    name: "bonusUpdate",
    params: { id: id },
  });
};

//#region Pagination
//#endregion
onMounted(async () => {
  isLoading.value = true;
  checkPermissionAccessArray([EnumPermission.ShowEmployees]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  //await useSectionStore().get_sections();

  let index = 1;

  if (localStorage.getItem("indexBonuses") != undefined)
    index = Number(localStorage.getItem("indexBonuses"));
  await getFilterData(index);
  isLoading.value = false;
});

const headers = ref<Array<ITableHeader>>([
  { caption: t("Bonus.number"), value: "number" },
  { caption: t("Details"), value: "actions" },
  { caption: t("Employee.Title"), value: "EmployeeName" },
  { caption: t("Date"), value: "issueDate" },
  { caption: t("Notes"), value: "notes" },
  { caption: t("Bonus.DegreeStage"), value: "DegreeStage" },
]);
</script>
<template>
  <IPage :HeaderTitle="t('Bonus.Index')" :is-loading="isLoading">
    <template #HeaderButtons>
      <IButton width="28" :onClick="add" :text="t('Bonus.Add')" />
    </template>
    <IPageContent>
      <IRow :col="3" :col-md="2" :col-lg="3">
        <ISearchBar :getDataButton="getFilterData">
          <ICol :span-lg="2" :span-md="2" :span="2" :span-sm="4">
            <IInput :label="t('SearchForUser')" :placeholder="t('SearchForUser')" v-model="fastSearch"
              :type="EnumInputType.Text" :OnKeyEnter="getFilterData" />
          </ICol>
          <!-- date -->
          <!-- <ICol :span-lg="1" :span-md="2" :span="1">
            <ISelect
              :label="t('EmployeeSection')"
              v-model="searchFilter.sectionId"
              name="archiveTypeId"
              :options="sections"
              :IsRequire="true"
              @onChange="getFilterData()"
            />
          </ICol> -->
        </ISearchBar>
      </IRow>
      <IRow>
        <ITable :items="data" :headers="headers">
          <template v-slot:EmployeeName="{ row }">
            <span>{{ row.Employee.name }}</span>
          </template>
          <template v-slot:DegreeStage="{ row }">
            <span>{{ row.DegreeStage.title }}</span>
          </template>
          <template v-slot:actions="{ row }">
            <IDropdown>
              <li>
                <OpenButton @click="update(row.id)" />
              </li>
            </IDropdown>
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
      </IRow>
      <IRow>
        <div id="PageDataEnd"></div>
      </IRow>
    </IPageContent>
    <IFooterCrud :is-add="true" :show-add="false"> </IFooterCrud>
  </IPage>
</template>
