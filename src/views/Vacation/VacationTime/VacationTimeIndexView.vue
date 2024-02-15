<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useVacationTimeStore } from "@/stores/vacations/vacationTimeStore";
import PageTitle from "@/components/general/namePage.vue";
import { TailwindPagination } from "laravel-vue-pagination";
import { useI18n } from "@/stores/i18n/useI18n";
import SimpleLoading from "@/components/general/loading.vue";
import EditButton from "@/components/dropDown/EditButton.vue";
import { usePermissionStore } from "@/stores/permissionStore";
const { checkPermissionAccessArray } = usePermissionStore();
import type { IVacationTime, IVacationTimeFilter } from "@/types/vacation/IVacationTime";
const { t } = useI18n();
const isLoading = ref(false);
const data = ref<Array<IVacationTime>>([]);
const dataPage = ref();
const dataBase = ref<Array<IVacationTime>>([]);
const { vacationTime } = useVacationTimeStore();

import { limits } from "@/utils/defaultParams";

const route = useRoute();
const router = useRouter();
const inputRefSearch = ref<HTMLInputElement | null>(null);

watch(
  () => route.params.search,
  async (newValue) => {
    if (route.params.search != undefined) fastSearch.value = newValue.toString() || "";
    await getFilterData(1);
  }
);
const addItem = () => {
  useVacationTimeStore().reset();
  router.push({
    name: "vacationTimeAdd",
  });
};

//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (_vacationTime: IVacationTimeFilter) => {
  if (_vacationTime.dayFrom?.toString().includes(fastSearch.value)) {
    return true;
  } else return false;
};
const makeFastSearch = () => {
  // eslint-disable-next-line no-self-assign
  if (fastSearch.value == "") data.value = dataBase.value;
  else {
    //data.value = dataBase.value.filter(filterByIDName);
  }
};
//#endregion
//#region Search
const searchFilter = ref<IVacationTimeFilter>({
  dayFrom: "",
  limit: 10,
});
const getFilterData = async (page: number = 1) => {
  isLoading.value = true;
  searchFilter.value.limit = 0;
  searchFilter.value.record = Number(fastSearch.value);
  await useVacationTimeStore()
    .get_filter(searchFilter.value, page)
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
    name: "vacationTimeUpdate",
    params: { id: id },
  });
};
const Search = async (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    await getFilterData(1);
  }
};
//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray(["show vacations time"]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  if (inputRefSearch.value) {
    inputRefSearch.value.addEventListener("keydown", Search);
  }
  await getFilterData(1);
});
</script>
<template>
  <IPage>
    <template v-slot:header>
      <IPageHeader :title="t('VacationTime')">
        <template v-slot:buttons>
          <IButton width="28" :onClick="addItem" :text="t('Add')" />
        </template>
      </IPageHeader>
    </template>
    <template v-slot:content>
      <IRow>
        <IBtnSearch
          class="p-2 mx-2"
          v-model="fastSearch"
          @get-filter-data="getFilterData()"
          @make-fast-search="makeFastSearch()"
        ></IBtnSearch>
        <!-- limit -->
        <div
          class="py-2 limit flex items-center lg:ml-10 xs:ml-3 lg:w-[10%] xs:w-[81.5%]"
        >
          <div
            class="py-3 px-4 w-full flex items-center justify-between text-sm font-medium leading-none bg-sortByLight text-text dark:text-textLight dark:bg-button cursor-pointer rounded"
          >
            <p>{{ t("Sort By") }}:</p>
            <select
              aria-label="select"
              v-model="searchFilter.limit"
              class="focus:text-indigo-600 focus:outline-none bg-transparent ml-1"
              @change="getFilterData(1)"
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
      </IRow>
      <IRow
        ><div class="flex flex-col">
          <div class="py-4 inline-block min-w-full lg:px-8">
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
                <div class="max-w-full relative">
                  <div
                    class="grid lg:grid-cols-2 md:grid-cols-2 xs:grid-cols-1 gap-10 lg:m-0 xs:mx-3"
                  >
                    <!-- card -->
                    <div
                      class="bg-cardLight dark:bg-card flex w-full p-5 rounded-lg border border-gray-600 shadow-md shadow-gray-900 duration-500 hover:border hover:border-gray-400 hover:shadow-md hover:shadow-gray-600"
                      v-for="vacation in data"
                      :key="vacation.id"
                    >
                      <div class="w-3/4 overflow-hidden">
                        <div class="ltr:ml-2 rtl:mr-2 ltr:text-left rtl:text-right">
                          <div class="text-2xl text-text dark:text-textLight mb-2">
                            {{ vacation.Vacation.Employee.name }}
                          </div>
                        </div>
                        <div class="flex justify-betweens">
                          اجازة لمدة
                          <div
                            class="text-text dark:text-red-900 border-sky-100 border-2 pl-2 pr-2 ml-2 mr-2 bg-slate-300"
                            v-html="vacation.record"
                          ></div>
                          ساعة من تاريخ
                          <div
                            class="text-text dark:text-textGray ml-2 mr-2"
                            v-html="vacation.timeFrom"
                          ></div>
                          الى
                          <div
                            class="text-text dark:text-textGray ml-2 mr-2"
                            v-html="vacation.timeTo"
                          ></div>
                        </div>
                      </div>

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
                            <EditButton @click="update(vacation.id)" />
                          </li>
                          <!-- <li>
                            <ShowButton @click="show(vacation.id)" />
                          </li> -->
                          <!-- <li><BlockButton /></li> -->
                        </ul>
                      </div>
                    </div>
                    <!-- end card -->
                  </div>
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
        </div>
      </IRow>
    </template>
  </IPage>
</template>
@/stores/vacations/vacationTimeStore@/stores/permissionStore