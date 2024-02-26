<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEmployeeStore } from "@/stores/employeeStore";
import { useSectionStore } from "@/stores/sectionStore";

import { storeToRefs } from "pinia";

import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utils/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import type { IEmployee, IEmployeeFilter } from "@/types/IEmployee";
import { usePermissionStore } from "@/stores/permissionStore";
const { checkPermissionAccessArray } = usePermissionStore();
const isLoading = ref(false);
const { employee } = storeToRefs(useEmployeeStore());
const { sections } = storeToRefs(useSectionStore());
const namePage = ref(t("EmployeeIndex"));

const data = ref<Array<IEmployee>>([]);
const dataPage = ref();
const dataBase = ref<Array<IEmployee>>([]);
const { get_filter } = useEmployeeStore();

import { limits } from "@/utils/defaultParams";
import IButton from "@/components/ihec/IButton.vue";
import ISelect from "@/components/inputs/ISelect.vue";
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
            <IInput :label="t('SearchForUser')" :placeholder="t('SearchForUser')" v-model="fastSearch" type="text" />
          </ICol>
          <!-- date -->
          <ICol :span-lg="1" :span-md="2" :span="1">
            <ISelect :label="t('EmployeeSection')" v-model="searchFilter.sectionId" name="archiveTypeId"
              :options="sections" :IsRequire="true" @onChange="getFilterData()" />
          </ICol>
        </ISearchBar>
      </IRow>
      <IRow>
        <div class="rounded-xl" v-if="isLoading == false">
          <div v-motion :initial="{ opacity: 0, y: -15 }" :enter="{ opacity: 1, y: 0 }"
            :variants="{ custom: { scale: 2 } }" :delay="200" v-if="data.length > 0">
            <div class="w-12/12 mx-2 overflow-x-auto font-Tajawal">
              <div class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"></div>
              <table
                class="min-w-full w-full text-center text-text dark:text-textLight shadow-md shadow-gray-400 dark:shadow-gray-800">
                <thead
                  class="sticky top-0 font-semibold font-Tajawal_bold dark:bg-tableNew text-text dark:text-blue-300 bg-blue-300">
                  <tr>
                    <th scope="col" class="text-sm font-medium px-6 py-4">
                      {{ t("Name") }}
                    </th>
                    <th scope="col" class="text-sm font-medium px-6 py-4">
                      {{ t("Section") }}
                    </th>

                    <th scope="col" class="text-sm font-medium px-6 py-4">
                      {{ t("Details") }}
                    </th>
                  </tr>
                </thead>
                <tbody class="dark:bg-designTableHead bg-white print:bg-white print:dark:bg-white mt-10 overflow-auto">
                  <tr v-for="row in data" :key="row.id"
                    class="print:text-text print:dark:text-text text-text dark:text-textLight print:bg-white print:dark:bg-white dark:hover:bg-tableBodyHover bg-white dark:bg-tableNew h-16 duration-300 border-gray-500 border-t">
                    <th>{{ row.name }}</th>
                    <th style="direction: ltr">{{ row.Section.name }}</th>
                    <IDropdown>
                      <li>
                        <EditButton @click="update(row.id)" />
                      </li>
                    </IDropdown>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="w-full flex flex-row">
              <div class="basis-4/5 hidden">
                <TailwindPagination class="flex justify-center mt-6" :data="dataPage"
                  @pagination-change-page="getFilterData" :limit="searchFilter.limit" />
              </div>
              <div class="basis-1/5" v-if="searchFilter.limit > limits[0].id">
                <ISelect :label="t('Limit')" v-model="searchFilter.limit" name="archiveTypeId" :options="limits"
                  :IsRequire="true" @onChange="getFilterData()" />
              </div>
            </div>
          </div>
        </div>
        <SimpleLoading v-if="isLoading">.</SimpleLoading>
      </IRow>
      <IRow>
        <div id="PageDataEnd"></div>
      </IRow>
    </IPageContent>
  </IPage>
</template>
