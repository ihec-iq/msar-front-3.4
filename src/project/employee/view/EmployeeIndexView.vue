<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEmployeeStore } from "../employeeStore";
import { useSectionStore } from "@/project/section/sectionStore";

import { storeToRefs } from "pinia";

import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utilities/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import type { IEmployee, IEmployeeFilter } from "../IEmployee";
import { usePermissionsStore } from "@/project/core/permissionStore";
const { checkPermissionAccessArray } = usePermissionsStore();
const isLoading = ref(false);
const { employee } = storeToRefs(useEmployeeStore());
const { sections } = storeToRefs(useSectionStore());

const data = ref<Array<IEmployee>>([]);
const dataPage = ref();
const dataBase = ref<Array<IEmployee>>([]);
const { get_filter } = useEmployeeStore();

import { limits } from "@/utilities/defaultParams";
import IButton from "@/components/ihec/IButton.vue";
import ISelect from "@/components/inputs/ISelect.vue";
import { EnumPermission } from "@/utilities/EnumSystem";
import type { ITableHeader } from "@/types/core/components/ITable";
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
const addItem = () => {
  employee.value.id = 0;
  employee.value.name = "";
  employee.value.Section = { name: "", id: 0 };
  employee.value.isPerson = 0;
  router.push({
    name: "employeeAdd",
  });
};

//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (employee: IEmployee) => {
  if (employee.name.includes(fastSearch.value)) {
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
const searchFilter = ref<IEmployeeFilter>({
  name: "",
  sectionId: 1,
  limit: 10,
});
const getFilterData = async (page = 1) => {
  isLoading.value = true;
  searchFilter.value.name = fastSearch.value;
  await get_filter(searchFilter.value, page)
    .then((response) => {
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
    name: "employeeUpdate",
    params: { id: id },
  });
};
const history = (id: number) => {
  router.push({
    name: "employeeHistory",
    params: { id: id },
  });
};
//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowEmployees]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  await useSectionStore().get_sections();

  await getFilterData(1);
});

const headers = ref<Array<ITableHeader>>([
  { caption: t("Employee.Title"), value: "name" },
  { caption: t("Details"), value: "actions" },
  { caption: t("Section"), value: "section" },
  { caption: t("Employee.Position"), value: "position" },
  { caption: t("Employee.Type"), value: "type" },
]);
</script>
<template>
  <IPage :HeaderTitle="t('EmployeeIndex')">
    <template #HeaderButtons>
      <IButton width="28" :onClick="addItem" :text="t('Add')" />
    </template>
    <IPageContent>
      <IRow :col="3" :col-md="2" :col-lg="3">
        <ISearchBar :getDataButton="getFilterData">
          <ICol :span-lg="2" :span-md="2" :span="2" :span-sm="4">
            <IInput
              :label="t('SearchForUser')"
              :placeholder="t('SearchForUser')"
              v-model="fastSearch"
              type="text"
              :OnKeyEnter="getFilterData"
            />
          </ICol>
          <!-- date -->
          <ICol :span-lg="1" :span-md="2" :span="1">
            <ISelect
              :label="t('EmployeeSection')"
              v-model="searchFilter.sectionId"
              name="archiveTypeId"
              :options="sections"
              :IsRequire="true"
              @onChange="getFilterData()"
            />
          </ICol>
        </ISearchBar>
      </IRow>
      <IRow>
        <ITable :items="data" :headers="headers">
          <template v-slot:section="{ row }">
            <span>{{ row.Section.name }}</span>
          </template>
          <template v-slot:position="{ row }">
            <span>{{ row.Position.name }}</span>
          </template>
          <template v-slot:type="{ row }">
            <span>{{ row.Type.name }}</span>
          </template>
          <template v-slot:actions="{ row }">
            <IDropdown>
              <li>
                <EditButton @click="update(row.id)" />
              </li>
              <li>
                <EditButton
                  title="'Employee.HistoryReport'"
                  @click="history(row.id)"
                />
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
              <TailwindPagination
                class="flex justify-center mt-6"
                :data="dataPage"
                @pagination-change-page="getFilterData"
                :limit="searchFilter.limit"
              />
            </div>
            <div class="basis-1/5" v-if="data.length >= limits[0].id">
              <ISelect
                name="limit"
                :label="t('Limit')"
                v-model="searchFilter.limit"
                :options="limits"
                :IsRequire="true"
                @onChange="getFilterData()"
              />
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
@/utilities/I18nPlugin@/utilities/defaultParams@/utilities/EnumSystem
