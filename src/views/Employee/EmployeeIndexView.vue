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

const route = useRoute();
const router = useRouter();
watch(
  () => route.params.search,
  async (newValue) => {
    if (route.params.search != undefined) fastSearch.value = newValue.toString() || "";
    await getFilterData(1);
  }
);
const addEmployee = () => {
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
  if (fastSearch.value == "") data.value = dataBase.value;
  else {
    data.value = dataBase.value.filter(filterByIDName);
  }
};
//#endregion
//#region Search
const searchFilter = ref<IEmployeeFilter>({
  name: "",
  sectionId: 0,
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
  checkPermissionAccessArray(["show employees"]);

  searchFilter.value.limit = 12;
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  await useSectionStore().get_sections();

  await getFilterData(1);
});
</script>
<template>
  <IPage>
    <template v-slot:header>
      <IPageHeader :title="t(namePage)">
        <template v-slot:buttons>
          <IButton width="28" :onClick="addEmployee" :text="t('Add')" />
        </template>
      </IPageHeader>
    </template>
    <template v-slot:content>
      <IRow>
        <IBtnSearch
          v-model="fastSearch"
          @get-filter-data="getFilterData()"
          @make-fast-search="makeFastSearch()"
        ></IBtnSearch>
        <div
          class="mr-2 ml-2 lg:mt-0 xs:mt-2 py-3 px-4 w-full flex items-center justify-between text-sm font-medium leading-none bg-sortByLight text-text dark:text-textLight dark:bg-button cursor-pointer rounded"
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
        <div
          class="mr-2 ml-2 lg:mt-0 xs:mt-2 py-3 px-4 w-full flex items-center justify-between text-sm font-medium leading-none bg-sortByLight text-text dark:text-textLight dark:bg-button cursor-pointer rounded"
        >
          <p>{{ t("EmployeeSection") }}:</p>
          <select
            aria-label="select"
            v-model="searchFilter.sectionId"
            class="focus:text-indigo-600 focus:outline-none bg-transparent ml-1 font-medium"
            @change="getFilterData()"
          >
            <option
              v-for="section in sections"
              :key="section.id"
              :value="section.id"
              :selected="section.id == 2"
              class="text-sm text-indigo-800 font-bold"
            >
              {{ section.name }}
            </option>
          </select>
        </div>
        <div class="mr-2 ml-2 lg:mt-0 xs:mt-2 flex items-center">
          <IButton
            :on-click="getFilterData"
            :text="t('Search')"
            color="green"
            type="outlined"
          ></IButton>
        </div>
      </IRow>
      <IRow>
        <div class="py-4 min-w-full w-full h-full lg:px-8">
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
              <div class="w-12/12 mx-2 overflow-x-auto font-Tajawal">
                <div
                  class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
                ></div>
                <table
                  class="min-w-full w-full text-center text-text dark:text-textLight shadow-md shadow-gray-400 dark:shadow-gray-800"
                >
                  <thead
                    class="sticky top-0 font-semibold font-Tajawal_bold dark:bg-tableNew text-text dark:text-blue-300 bg-blue-300"
                  >
                    <tr>
                      <th scope="col" class="text-sm font-medium px-6 py-4">
                        {{ t("Name") }}
                      </th>
                      <th scope="col" class="text-sm font-medium px-6 py-4">
                        {{ t("section") }}
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
                      <th>{{ row.name }}</th>
                      <th style="direction: ltr">{{ row.Section.name }}</th>
                      <th class="p-2 z-999">
                        <div class="dropdown">
                          <button
                            class="dropdown-toggle peer mr-45 px-6 py-2.5 text-white font-medium rounded-md text-xs leading-tight uppercase transition duration-150 ease-in-out flex items-center whitespace-nowrap"
                            type="button"
                            id="dropdownMenuButton2"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <img
                              src="https://img.icons8.com/office/344/menu--v1.png "
                              class="w-8 float-left"
                              alt=""
                            />
                          </button>

                          <ul
                            class="dropdown-menu top-8 peer-hover:block hover:block min-w-max absolute text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding border-none bg-lightDropDown dark:bg-dropDown"
                            aria-labelledby="dropdownMenuButton2"
                          >
                            <li>
                              <EditButton @click="update(row.id)" />
                            </li>
                          </ul>
                        </div>
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="w-12/12 mx-2 overflow-x-auto font-Tajawal">
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
      </IRow>
    </template>
  </IPage>
  <!-- <div class="justify-between flex">
    <PageTitle> {{ namePage }} </PageTitle>
  </div> -->

  <!-- bottom tool bar -->
  <div class="m-5 fixed bottom-0 ltr:right-0 rtl:left-0">
    <button
      @click="addEmployee()"
      class="flex p-2.5 float-right bg-create rounded-xl hover:rounded-3xl md:mr-5 lg:mr-0 transition-all duration-300 text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
  </div>
</template>
@/stores/permissionStore@/stores/sectionStore
