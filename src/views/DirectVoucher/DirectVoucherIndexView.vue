<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageTitle from "@/components/general/namePage.vue";
import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utils/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import { usePermissionStore } from "@/stores/permission";
const { checkPermissionAccessArray, can } = usePermissionStore();
import type { IDirectVoucher, IDirectVoucherFilter } from "@/types/IDirectVoucher";
import { useDirectVoucherStore } from "@/stores/voucher1/directVoucher";

const isLoading = ref(false);
const data = ref<Array<IDirectVoucher>>([]);
const dataPage = ref();
const dataBase = ref<Array<IDirectVoucher>>([]);
const { directVoucher, get_filter } = useDirectVoucherStore();
import { limits } from "@/utils/defaultParams";

const route = useRoute();
const router = useRouter();
watch(
  () => route.params.search,
  async (newValue) => {
    if (route.params.search != undefined) fastSearch.value = newValue.toString() || "";
    await getFilterData(1);
  }
);
const addItem = () => {
  directVoucher.id = 0;
  directVoucher.number = "";
  directVoucher.date = "";
  directVoucher.notes = "";
  directVoucher.Items = [];
  directVoucher.signaturePerson = "";
  router.push({
    name: "directVoucherAdd",
  });
};

//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (item: IDirectVoucher) => {
  if (item.number.includes(fastSearch.value) || item.notes.includes(fastSearch.value)) {
    return true;
  } else return false;
};
const makeFastSearch = () => {
  // eslint-disable-next-line no-self-assign
  if (fastSearch.value == "") data.value = dataBase.value;
  else {
    data.value = dataBase.value.filter(filterByIDName);
  }
};
//#endregion
//#region Search
const searchFilter = ref<IDirectVoucherFilter>({
  name: "",
  limit: 10,
  description: "",
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
    name: "directVoucherUpdate",
    params: { id: id },
  });
};

//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray(["show directVouchers"]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  await getFilterData(1);
});
</script>
<template>
  <div class="justify-between flex">
    <PageTitle> {{ t("DirectVoucher") }} </PageTitle>
  </div>
  <div class="flex">
    <!-- <Nav class="w-[5%]" /> -->
    <div class="lg:w-[95%] mb-12 lg:ml-[5%] xs:w-full md:mr-[2%]">
      <div class="flex lg:flex-row xs:flex-col lg:justify-around xs:items-center mt-6">
        <label for="table-search" class="sr-only">{{ t("Search") }}</label>
        <div class="relative flex">
          <div
            class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
          >
            <svg
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            v-model="fastSearch"
            @input="makeFastSearch()"
            class="block p-2 pl-10 w-80 text-sm text-text dark:text-textLight bg-lightInput dark:bg-input rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            :placeholder="t('SearchForItem')"
          />
        </div>
        <!-- limit -->
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
            {{ t("Search") }}
          </button>
        </div>
      </div>
      <div class="w-full">
        <div class="flex flex-col">
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
                      v-for="item in data"
                      :key="item.id"
                    >
                      <div class="w-3/4 overflow-hidden">
                        <div class="ltr:ml-2 rtl:mr-2 ltr:text-left rtl:text-right">
                          <div class="text-2xl text-text dark:text-textLight mb-2">
                            {{ item.number }}
                          </div>
                          <div class="text-text dark:text-textGray mb-2 justify-between">
                            <span>{{ t("Date") }}: {{ item.date }}</span>
                            <span class="float-left flex" title="Items count">
                              {{ item.itemsCount }}
                              <svg
                                title="Items count"
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M16 20h4v-4h-4m0-2h4v-4h-4m-6-2h4V4h-4m6 4h4V4h-4m-6 10h4v-4h-4m-6 4h4v-4H4m0 10h4v-4H4m6 4h4v-4h-4M4 8h4V4H4v4Z"
                                />
                              </svg>
                            </span>
                          </div>
                          <div class="flex justify-betweens">
                            <div
                              class="text-text dark:text-textGray"
                              v-if="item.notes"
                              v-html="item.notes"
                            ></div>
                          </div>
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
                          class="dropdown-menu top-8 peer-hover:block hover:block min-w-max absolute text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding border-none bg-gray-800"
                          aria-labelledby="dropdownMenuButton2"
                        >
                          <li>
                            <EditButton @click="update(item.id)" />
                          </li>
                          <!-- <li>
                            <ShowButton @click="show(item.id)" />
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
      </div>
    </div>
  </div>

  <!-- bottom tool bar -->
  <div class="m-5 fixed bottom-0 ltr:right-0 rtl:left-0">
    <button
      @click="addItem()"
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
