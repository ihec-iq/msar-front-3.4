<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useArchiveStore } from "@/stores/Archive/archive";
import PageTitle from "@/components/general/namePage.vue";
import type {
  IArchive,
  IArchiveFilter,
  IDocument,
} from "@/types/Archive/IArchive";
import { TailwindPagination } from "laravel-vue-pagination";
import { useI18n } from "@/stores/i18n/useI18n";
const { t } = useI18n();
const isLoading = ref(false);
const data = ref<Array<IArchive>>([]);
const dataPage = ref();
const dataBase = ref<Array<IArchive>>([]);
const { archive } = useArchiveStore();
const { get_filter } = useArchiveStore();

const limits = reactive([
  { name: "6", val: 6, selected: true },
  { name: "12", val: 12, selected: false },
  { name: "24", val: 24, selected: false },
  { name: "50", val: 50, selected: false },
  { name: "All", val: 999999999 },
]);

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
const addArchive = () => {
  archive.id = 0;
  archive.title = "";
  archive.issueDate = new Date().toISOString().split("T")[0];
  archive.files = [];
  archive.number = "";
  archive.description = "";
  archive.isIn = 0;
  archive.sectionId = 1;
  archive.archiveTypeId = 1;
  router.push({
    name: "archiveAdd",
  });
};

//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (item: IArchive) => {
  if (
    item.title.includes(fastSearch.value) ||
    item.way.includes(fastSearch.value)
  ) {
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
const searchFilter = ref<IArchiveFilter>({
  title: "",
  limit: 6,
  issueDateFrom: new Date(new Date().setDate(new Date().getDate() - 360))
    .toISOString()
    .split("T")[0],
  issueDateTo: new Date().toISOString().split("T")[0],
  description: "",
  way: "",
  number: "",
  isIn: -1,
  sectionId: -1,
  archiveTypeId: -1,
});
const getFilterData = async (page = 1) => {
  isLoading.value = true;
  searchFilter.value.number = fastSearch.value;
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
    name: "archiveUpdate",
    params: { id: id },
  });
};

//#region Pagination
//#endregion
const getPath = (files: Array<IDocument>) => {
  if (files.length == 0 || files == null)
    return "https://picsum.photos/100/150/?random";
  else {
    if (files[0].extension == "png" || files[0].extension == "jpg")
      return String(files[0].path);
    else if (files[0].extension == "pdf")
      return new URL("@/assets/image/pdf.png", import.meta.url);
    else if (files[0].extension == "doc" || files[0].extension == "docx")
      return new URL("@/assets/image/word.png", import.meta.url);
    else if (files[0].extension == "xls" || files[0].extension == "xlsx")
      return new URL("@/assets/image/excel.png", import.meta.url);
    else return new URL("@/assets/image/undefined.png", import.meta.url);
  }
};
onMounted(async () => {
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";

  await getFilterData(1);
});
</script>
<template>
  <PageTitle> {{ t("Archive") }} </PageTitle>
  <div class="flex">
    <!-- <Nav class="w-[5%]" /> -->
    <div class="lg:w-[95%] mb-12 lg:ml-[5%] xs:w-full md:mr-[2%]">
      <div
        class="flex lg:flex-row xs:flex-col lg:justify-around xs:items-center mt-6"
      >
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
            :placeholder="t('SearchForArchive')"
          />
        </div>
        <div class="flex mb-2">
          <div class="ml-4">
            <div
              class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
            >
              {{ t("DateFrom") }}
            </div>
            <input
              type="date"
              v-model="searchFilter.issueDateFrom"
              class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
            />
          </div>
          <div class="ml-4">
            <div
              class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
            >
              {{ t("DateTo") }}
            </div>
            <input
              type="date"
              v-model="searchFilter.issueDateTo"
              class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
            />
          </div>
        </div>
        <!-- limit -->
        <div
          class="limit flex items-center lg:ml-10 xs:ml-3 lg:w-[10%] xs:w-[81.5%]"
        >
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
                      <div class="w-1/4">
                        <img
                          @click="update(item.id)"
                          class="rounded-lg cursor-pointer"
                          :src="getPath(item.files).toString()"
                          alt=""
                        />
                      </div>
                      <div class="w-3/4 overflow-hidden">
                        <div
                          class="ltr:ml-2 rtl:mr-2 ltr:text-left rtl:text-right"
                        >
                          <div
                            class="text-2xl text-text dark:text-textLight mb-2"
                          >
                            {{ item.title }}
                          </div>
                          <div
                            class="text-text dark:text-textGray mb-2 justify-between"
                          >
                            <span
                              >{{ t("Date") }}:
                              {{ item.issueDate.split(" ")[0] }}</span
                            >
                            <span class="float-left flex">
                              {{ item.files.length }}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="20"
                                height="20"
                                viewBox="0,0,256,256"
                                style="fill: #000000"
                              >
                                <g
                                  fill="#7f7e7e"
                                  fill-rule="nonzero"
                                  stroke="none"
                                  stroke-width="1"
                                  stroke-linecap="butt"
                                  stroke-linejoin="miter"
                                  stroke-miterlimit="10"
                                  stroke-dasharray=""
                                  stroke-dashoffset="0"
                                  font-family="none"
                                  font-weight="none"
                                  font-size="none"
                                  text-anchor="none"
                                  style="mix-blend-mode: normal"
                                >
                                  <g transform="scale(2.56,2.56)">
                                    <path
                                      d="M34.17969,10.16406c-2.076,0 -3.56445,1.2622 -3.56445,3.5332l0.0332,12.10937c0,3.04 2.1218,4.90625 4.9668,4.90625c2.845,0 5,-1.71 5,-4.75v-11.65625h-1.00195l-0.08984,11.5625c0,2.21 -1.924,3.93945 -3.875,3.93945c-1.951,0 -4.0332,-1.75875 -4.0332,-3.96875l0.0293,-12.22852c0,-1.307 1.43295,-2.48437 2.62695,-2.48437c1.194,0 2.34375,1.14808 2.34375,2.45508v10.47461c0,0 -0.47542,1 -0.98242,1c-0.507,0 -1.14658,-0.35625 -1.01758,-0.90625v-9.8418h-1l-0.0332,9.65625c0,1.38 0.74022,2 2.07422,2c1.334,0 1.95898,-0.7157 1.95898,-2.0957v-10.20508c0,-2.271 -1.35955,-3.5 -3.43555,-3.5zM41.61328,11.30664c-0.552,0 -1,0.448 -1,1c0,0.552 0.448,1 1,1h18v10.48633c0,5.247 4.26863,9.51367 9.51563,9.51367h10.48438v49.26758c0,4.263 -3.46647,7.73242 -7.73047,7.73242h-43.53516c-4.263,0 -7.73242,-3.46842 -7.73242,-7.73242v-61.53516c0,-4.263 3.46842,-7.73047 7.73242,-7.73047h1.26758c0.552,0 1,-0.448 1,-1c0,-0.552 -0.448,-1 -1,-1h-1.26758c-5.366,0 -9.73242,4.36347 -9.73242,9.73047v61.53516c0,5.366 4.36542,9.73242 9.73242,9.73242h43.53516c5.366,0 9.73047,-4.36642 9.73047,-9.73242v-50.01953c0,-0.265 -0.10497,-0.51903 -0.29297,-0.70703l-20.24805,-20.24805c-0.187,-0.188 -0.44203,-0.29297 -0.70703,-0.29297zM60.61328,13.9668l18.33789,18.33984h-9.82227c-4.695,0 -8.51562,-3.81867 -8.51562,-8.51367zM28.37109,19.50586c-0.12588,-0.02413 -0.261,0.00013 -0.375,0.07813c-2.118,1.44 -3.38281,3.82209 -3.38281,6.37109v52.66211c0,4.239 3.4352,7.68945 7.6582,7.68945h35.68359c4.223,0 7.65816,-3.45045 7.66016,-7.68945v-17.81055c0,-0.276 -0.224,-0.5 -0.5,-0.5c-0.276,0 -0.5,0.224 -0.5,0.5v17.81055c0,3.688 -2.9872,6.68945 -6.6582,6.68945h-35.68359c-3.671,0 -6.6582,-3.00145 -6.6582,-6.68945v-52.66211c0,-2.218 1.09936,-4.29092 2.94336,-5.54492c0.228,-0.155 0.28781,-0.46436 0.13281,-0.69336c-0.0775,-0.1135 -0.19444,-0.18681 -0.32031,-0.21094zM75.11328,47.30664c-0.276,0 -0.5,0.224 -0.5,0.5v3c0,0.276 0.224,0.5 0.5,0.5c0.277,0 0.5,-0.224 0.5,-0.5v-3c0,-0.276 -0.224,-0.5 -0.5,-0.5zM30.11328,51.30664c-0.276,0 -0.5,0.224 -0.5,0.5c0,0.276 0.224,0.5 0.5,0.5h23c0.277,0 0.5,-0.224 0.5,-0.5c0,-0.276 -0.224,-0.5 -0.5,-0.5zM75.11328,52.30664c-0.276,0 -0.5,0.224 -0.5,0.5v6c0,0.276 0.224,0.5 0.5,0.5c0.277,0 0.5,-0.224 0.5,-0.5v-6c0,-0.276 -0.224,-0.5 -0.5,-0.5zM30.11328,58.30664c-0.276,0 -0.5,0.224 -0.5,0.5c0,0.276 0.224,0.5 0.5,0.5h14c0.277,0 0.5,-0.224 0.5,-0.5c0,-0.276 -0.224,-0.5 -0.5,-0.5zM46.11328,58.30664c-0.276,0 -0.5,0.224 -0.5,0.5c0,0.276 0.224,0.5 0.5,0.5h24c0.277,0 0.5,-0.224 0.5,-0.5c0,-0.276 -0.224,-0.5 -0.5,-0.5zM30.11328,65.30664c-0.276,0 -0.5,0.224 -0.5,0.5c0,0.276 0.224,0.5 0.5,0.5h18c0.277,0 0.5,-0.224 0.5,-0.5c0,-0.276 -0.224,-0.5 -0.5,-0.5zM50.11328,65.30664c-0.276,0 -0.5,0.224 -0.5,0.5c0,0.276 0.224,0.5 0.5,0.5h11c0.277,0 0.5,-0.224 0.5,-0.5c0,-0.276 -0.224,-0.5 -0.5,-0.5zM63.11328,65.30664c-0.276,0 -0.5,0.224 -0.5,0.5c0,0.276 0.224,0.5 0.5,0.5h8c0.277,0 0.5,-0.224 0.5,-0.5c0,-0.276 -0.224,-0.5 -0.5,-0.5zM30.11328,72.30664c-0.276,0 -0.5,0.224 -0.5,0.5c0,0.276 0.224,0.5 0.5,0.5h24c0.277,0 0.5,-0.224 0.5,-0.5c0,-0.276 -0.224,-0.5 -0.5,-0.5zM57.11328,72.30664c-0.276,0 -0.5,0.224 -0.5,0.5c0,0.276 0.224,0.5 0.5,0.5h13c0.277,0 0.5,-0.224 0.5,-0.5c0,-0.276 -0.224,-0.5 -0.5,-0.5z"
                                    ></path>
                                  </g>
                                </g>
                              </svg>
                            </span>
                          </div>
                          <div class="flex justify-betweens">
                            <div
                              class="text-text dark:text-textGray"
                              v-html="item.description"
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
            <!-- end card -->
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- bottom tool bar -->
  <div class="m-5 fixed bottom-0 ltr:right-0 rtl:left-0">
    <button
      @click="addArchive()"
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
