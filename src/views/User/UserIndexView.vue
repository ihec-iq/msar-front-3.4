<script setup lang="ts">
//region"Basic Import"
import SimpleLoading from "@/components/general/loading.vue";
import { useUserStore } from "@/stores/userStore";
import { useI18n } from "@/stores/i18n/useI18n";
import { usePermissionStore } from "@/stores/permission";
import type { IUser, IUserFilter } from "@/types/core/IUser";
import { TailwindPagination } from "laravel-vue-pagination";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { EnumPermission } from "@/utils/EnumSystem";
import JsonExcel from "vue-json-excel3";
//#region Vars
//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
const { t } = useI18n();
const isLoading = ref(false);
const data = ref<Array<IUser>>([]);
const dataPage = ref();
const dataBase = ref<Array<IUser>>([]);

const { user } = useUserStore();
const { get_filter } = useUserStore();
const limits = reactive([
  { name: "10", val: 10, selected: true },
  { name: "20", val: 12, selected: false },
  { name: "30", val: 24, selected: false },
  { name: "50", val: 50, selected: false },
  { name: "All", val: 999999999 },
]);

const route = useRoute();
const router = useRouter();
watch(
  () => route.params.search,
  async (newValue) => {
    if (route.params.search != undefined) fastSearch.value = newValue.toString() || "";
    await getFilterData(1);
  }
);
//#endregion

//#endregion

//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (vacation: IUser) => {
  if (vacation.Employee?.name.includes(fastSearch.value)) {
    return true;
  } else return false;
};
const makeFastSearch = () => {
  getFilterData();
  return;
  if (fastSearch.value == "") data.value = dataBase.value;
  else {
    data.value = dataBase.value.filter(filterByIDName);
  }
};
//#endregion
//#region Search
//#region Filter
const searchFilter = ref<IUserFilter>({
  limit: 6,
  name: "",
  email: "",
});
const getFilterData = async (page = 1) => {
  dataPage.value = [];
  data.value = [];
  dataBase.value = [];
  isLoading.value = true;
  searchFilter.value.name = fastSearch.value;
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
//#endregion

//#endregion
const update = (id: number) => {
  router.push({
    name: "userUpdate",
    params: { id: id },
  });
};
const add = () => {
  router.push({
    name: "userAdd",
  });
};
//#region Search by Enter Key
const inputRefSearch = ref<HTMLInputElement | null>(null);
const Search = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    await getFilterData(1);
  }
};
const makeExcel = (data: any) => {};
const ExportExcel = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    await getFilterData(1);
  }
};
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowUsers]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  await getFilterData(1);
  if (inputRefSearch.value) {
    inputRefSearch.value.addEventListener("keydown", Search);
  }
});
</script>
<template>
  <IPage>
    <template v-slot:header>
      <IPageHeader :title="t('UserIndex')">
        <template v-slot:buttons>
          <IButton width="28" :onClick="add" :text="t('Add')" />
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
        <div class="limit flex items-center lg:ml-10 xs:ml-3 lg:w-[10%] xs:w-[81.5%]">
          <div
            class="py-3 px-4 w-full flex items-center justify-between text-sm font-medium leading-none bg-sortByLight text-text dark:text-textLight dark:bg-button cursor-pointer rounded"
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
        </div>
        <div class="ml-4 lg:mt-0 xs:mt-2">
          <button
            @click="getFilterData()"
            class="bg-create hover:bg-createHover duration-500 h-10 w-32 rounded-lg text-white"
          >
            {{ t("VacationSearch") }}
          </button>
        </div>
        <div class="ml-4 lg:mt-0 xs:mt-2">
          <button
            @click="getFilterData()"
            class="bg-create hover:bg-createHover duration-500 h-10 w-32 rounded-lg text-white"
          >
            <JsonExcel :data="data" type="xlsx" name="filename.xls">
              Download Excel
            </JsonExcel>
          </button>
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
                    class="sticky top-0 font-semibold font-Tajawal_bold dark:bg-tableHeaderNew text-text dark:text-blue-300 bg-blue-300"
                  >
                    <tr>
                      <th scope="col" class="text-sm font-medium px-6 py-4">
                        {{ t("Name") }}
                      </th>
                      <th scope="col" class="text-sm font-medium px-6 py-4">
                        {{ t("Email") }}
                      </th>
                      <th scope="col" class="text-sm font-medium px-6 py-4">
                        {{ t("Role") }}
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
                      <th style="direction: ltr">{{ row.email }}</th>
                      <th>
                        <p
                          v-for="role in row.roles.slice(0, 3)"
                          :key="role.id"
                          class="text-sm leading-none text-text dark:text-textLight ml-2"
                        >
                          {{ role.name }},
                        </p>
                      </th>
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
</template>
<style></style>
