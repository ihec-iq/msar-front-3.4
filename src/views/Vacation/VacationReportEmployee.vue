<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEmployeeStore } from "@/stores/employee";
import { useSectionStore } from "@/stores/section";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { usePermissionStore } from "@/stores/permission";

import { useI18n } from "@/stores/i18n/useI18n";

import type {
  IVacationTime,
  IVacationTimeFilter,
} from "@/types/vacation/IVacationTime";
import type { IVacationDaily } from "@/types/vacation/IVacationDaily";
import type { IVacationSick } from "@/types/vacation/IVacationSick";

const { t } = useI18n();
//#region Stores
import { useVacationTimeStore } from "@/stores/vacations/vacationTime";
import { useVacationDailyStore } from "@/stores/vacations/vacationDaily";
import { useVacationSickStore } from "@/stores/vacations/vacationSick";

//endregion

//#region Data
const limits = reactive([
  { name: "6", val: 6, selected: true },
  { name: "12", val: 12, selected: false },
  { name: "24", val: 24, selected: false },
  { name: "50", val: 50, selected: false },
  { name: "All", val: 999999999 },
]);
const limit = ref(6);
const dataVacationTime = ref<Array<IVacationTime>>([]);
const dataPageVacationTime = ref();
const dataVacationDaily = ref<Array<IVacationDaily>>([]);
const dataVacationSick = ref<Array<IVacationSick>>([]);
const isLoadingTime = ref(false);

//#endregion
//#region Functions
const getFilterData = async (page: number = 1) => {
  await getDataTime();
};
const getDataTime = async (page: number = 1) => {
  isLoadingTime.value = true;
  const searchFilter = ref<IVacationTimeFilter>({
    limit: limit.value,
    employeeId: employee.value.id,
  });
  await useVacationTimeStore()
    .get_filter(searchFilter.value, page)
    .then((response) => {
      if (response.status == 200) {
        dataPageVacationTime.value = response.data.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  isLoadingTime.value = false;
};
//#endregion

//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
const namePage = ref(".....");
const route = useRoute();
const id = ref(Number(route.params.id));
const rtlStore = useRtlStore();
const { is } = storeToRefs(rtlStore);
const isIn = ref(false);

const employeeStore = useEmployeeStore();
const { employee } = storeToRefs(useEmployeeStore());
const sectionStore = useSectionStore();
const { sections } = storeToRefs(useSectionStore());

const Loading = ref(false);

const router = useRouter();
const errors = ref<String | null>();
//#endregion
//#region CURD
const showData = async () => {
  Loading.value = true;
  await employeeStore
    .show(id.value)
    .then((response) => {
      if (response.status == 200) {
        employee.value.id = response.data.data.id;
        employee.value.name = response.data.data.name;
        employee.value.section.id = response.data.data.section.id;
        employee.value.section.name = response.data.data.section.name;
        employee.value.isPerson = response.data.data.isPerson;
        isIn.value = response.data.data.isPerson == 0 ? false : true;
      }
    })
    .catch((errors) => {
      console.log(errors);
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Your employee file not exist !!!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        router.go(-1);
      });
    });
  Loading.value = false;
};
//#endregion
const back = () => {
  router.push({
    name: "employeeIndex",
  });
};
onMounted(async () => {
  //console.log(can("show employees1"));
  checkPermissionAccessArray(["show Item"]);
  await sectionStore.get_sections();
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = t("EmployeeAdd");
    employee.value.id = 0;
  } else {
    await showData();
    employee.value.id = id.value;
    namePage.value = t("EmployeeUpdate");
  }
});
</script>
<template>
  <PageTitle> {{ namePage }}</PageTitle>
  <div class="w-full">
    <div class="w-full p-6 grid lg:grid-cols-4 xs:grid-cols-2">
      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("Name") }}
        </div>
        <input
          v-model="employee.name"
          type="text"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
        />
      </div>
      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("EmployeeSection") }}
        </div>
        <select v-model="employee.section.id" class="p-2">
          <option
            v-for="section in sections"
            :key="section.id"
            :value="section.id"
          >
            {{ section.name }}
          </option>
        </select>
      </div>
      <div class="w-11/12 mr-2">
        <div class="form-control w-52">
          <label class="cursor-pointer label">
            <span
              class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
            >
              {{ t("EmployeeIsPerson") }} : {{ isIn ? "شخص" : "شعبة" }}</span
            >
            <input
              type="checkbox"
              v-model="isIn"
              class="toggle toggle-secondary"
              checked
            />
          </label>
        </div>
      </div>
    </div>
    <div class="w-full p-6 grid lg:grid-cols-4 xs:grid-cols-2">
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
            v-model="limit"
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
        <div class="ml-4 lg:mt-0 xs:mt-2">
          <button
            @click="getFilterData(1)"
            class="bg-create hover:bg-createHover duration-500 h-10 w-32 rounded-lg text-white"
          >
            {{ t("Search") }}
          </button>
        </div>
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
                    v-for="vacation in data"
                    :key="vacation.id"
                  >
                    <div class="w-3/4 overflow-hidden">
                      <div
                        class="ltr:ml-2 rtl:mr-2 ltr:text-left rtl:text-right"
                      >
                        <div
                          class="text-2xl text-text dark:text-textLight mb-2"
                        >
                          {{ vacation.Vacation.Employee.name }}
                        </div>
                      </div>
                      <div class="flex justify-betweens">
                        اجازة لمدة
                        <div
                          class="text-text dark:text-textGray"
                          v-html="vacation.record"
                        ></div>
                        يوم من تاريخ
                        <div
                          class="text-text dark:text-textGray"
                          v-html="vacation.timeFrom"
                        ></div>
                        الى
                        <div
                          class="text-text dark:text-textGray"
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
                          <EditButton @click="OpenVactionTime(vacation.id)" />
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
                  :data="dataPageVacationTime"
                  @pagination-change-page="getDataTime"
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
    <!-- bottom tool bar -->
    <div
      :class="{
        'lg:w-[99.2%] xs:w-[97%] lg:mx-2 xs:mx-2 bottom': is,
        'lg:w-[95%] md:w-[90%] xs:w-[75%] lg:mr-0 ltr:xs:ml-3 rtl:xs:mr-3 bottom':
          !is,
      }"
      class="dark:bg-bottomTool duration-700 bg-ideNavLight p-2 rounded-lg flex items-center justify-end fixed bottom-0 print:hidden"
    >
      <div class="flex ltr:ml-8 rtl:mr-8">
        <div class="items-center mr-3"></div>
      </div>
    </div>
    <div
      :class="{
        'ltr:left-4 rtl:right-4': is,
        'ltr:left-28 rtl:right-28': !is,
      }"
      class="backBtn z-10 fixed bottom-2 lg:ml-3 xs:ml-0 print:hidden"
    >
      <button
        @click="back()"
        class="bg-back hover:bg-backHover h-10 duration-500 lg:w-32 xs:w-20 p-2 rounded-md text-white"
      >
        {{ t("Back") }}
      </button>
    </div>
    <!-- end bottom tool -->
  </div>
</template>
<style scoped>
.drop-area {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 50px;
  background: rgba(255, 255, 255, 0.333);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: 0.2s ease;
}
.drop-area[data-active="true"] {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  background: rgba(255, 255, 255, 0.8);
}
label {
  font-size: 36px;
  cursor: pointer;
  display: block;
}
label span {
  display: block;
}
label input[type="file"]:not(:focus-visible) {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
label .smaller {
  font-size: 16px;
}
.image-list {
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  padding: 0;
  margin-bottom: 35px;
}
.preview-card {
  display: flex;
  border: 1px solid #a2a2a2;
  padding: 5px;
  margin: 5px;
}
.upload-button {
  display: block;
  appearance: none;
  border: 0;
  border-radius: 50px;
  padding: 0.75rem 3rem;
  margin: 1rem auto;
  font-size: 1.25rem;
  font-weight: bold;
  background: #369;
  color: #fff;
  text-transform: uppercase;
}
button {
  cursor: pointer;
}
</style>
