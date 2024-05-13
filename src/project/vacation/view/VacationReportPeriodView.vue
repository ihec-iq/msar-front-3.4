<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEmployeeStore } from "@/project/employee/employeeStore";
import { useSectionStore } from "@/project/section/sectionStore";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { usePermissionsStore } from "@/project/core/permissionStore";


import type {
  IVacationTime,
  IVacationTimeFilter,
} from "../vacationTime/IVacationTime";
import type {
  IVacationDaily,
  IVacationDailyFilter,
} from "../vacationDaily/IVacationDaily";
import type { IVacationSick } from "../vacationSick/IVacationSick";


//#region Stores
import { useVacationTimeStore } from "../vacationTime/vacationTimeStore";
import { useVacationDailyStore } from "../vacationDaily/vacationDailyStore";
import { useVacationSickStore } from "../vacationSick/vacationSickStore";

//endregion

//#region Data
import { limits } from "@/utilities/defaultParams";
import { TailwindPagination } from "laravel-vue-pagination";
import { EnumPermission } from "@/utilities/EnumSystem";
import { t } from "@/utilities/I18nPlugin";

const limit = ref(10);
const dataVacationTime = ref<Array<IVacationTime>>([]);
const dataVacationDaily = ref<Array<IVacationDaily>>([]);
const dataVacationSick = ref<Array<IVacationSick>>([]);
const dataPageVacationTime = ref();
const dataPageVacationDaily = ref();
const dataPageVacationSick = ref();

const isLoadingTime = ref(false);
const isLoadingDaily = ref(false);
const isLoadingSick = ref(false);

//#endregion
//#region Functions
const getFilterData = async (page: number = 1) => {
  await getDataDaily();
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
        dataVacationTime.value = response.data.data.data;
        console.log(dataPageVacationTime.value);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  isLoadingTime.value = false;
};
const getDataDaily = async (page: number = 1) => {
  isLoadingTime.value = true;
  const searchFilter = ref<IVacationDailyFilter>({
    limit: limit.value,
    employeeId: employee.value.id,
  });
  await useVacationDailyStore()
    .get_filter(searchFilter.value, page)
    .then((response) => {
      if (response.status == 200) {
        dataPageVacationDaily.value = response.data.data;
        dataVacationDaily.value = response.data.data.data;
        console.log(dataPageVacationDaily.value);
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
const { checkPermissionAccessArray } = usePermissionsStore();
const namePage = ref("");
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
        employee.value.Section.id = response.data.data.Section.id;
        employee.value.Section.name = response.data.data.Section.name;
        employee.value.isPerson = response.data.data.isPerson;
        isIn.value = response.data.data.isPerson == 0 ? false : true;
      }
    })
    .catch((errors) => {
      console.log(errors);
      Swal.fire({
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
  router.back();
};
const OpenVacationTime = (id: number) => {
  router.push({
    name: "vacationTimeUpdate",
    params: { id: id },
  });
};
const OpenVacationDaily = (id: number) => {
  router.push({
    name: "vacationDailyUpdate",
    params: { id: id },
  });
};
onMounted(async () => {
  //console.log(can("show employees1"));
  checkPermissionAccessArray([EnumPermission.VacationReport]);
  await sectionStore.get_sections();
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = t("EmployeeAdd");
    employee.value.id = 0;
  } else {
    await showData();
    await getFilterData();
    employee.value.id = id.value;
    namePage.value = t("EmployeeUpdate");
  }
});
</script>
<template>
  <PageTitle>{{ namePage }}</PageTitle>
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
        <input
          v-model="employee.Section.name"
          type="text"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
        />
      </div>
      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("EmployeeIsPerson") }}
        </div>
        <div
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
        >
          {{ isIn ? "شخص" : "شعبة" }}
        </div>
      </div>
    </div>
    <!-- For Time Report -->
    <div class="w-full">
      <div class="flex flex-col">
        <div class="py-4 inline-block min-w-full lg:px-8">
          <!-- card -->

          <div class="rounded-xl" v-if="isLoadingTime == false">
            <div
              v-motion
              :initial="{ opacity: 0, y: -15 }"
              :enter="{ opacity: 1, y: 0 }"
              :variants="{ custom: { scale: 2 } }"
              :delay="200"
              v-if="dataVacationTime.length > 0"
            >
              <div class="max-w-full relative">
                <div
                  class="w-full outline-none font-bold h-10 px-3 py-2 mb-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                >
                  الاجازات الزمنية
                </div>
                <div
                  class="grid lg:grid-cols-2 md:grid-cols-2 xs:grid-cols-1 gap-10 lg:m-0 xs:mx-3"
                >
                  <!-- card -->
                  <div
                    class="bg-cardLight dark:bg-card flex w-full p-5 rounded-lg border border-gray-600 shadow-md shadow-gray-900 duration-500 hover:border hover:border-gray-400 hover:shadow-md hover:shadow-gray-600"
                    v-for="vacation in dataVacationTime"
                    :key="vacation.id"
                  >
                    <div class="w-3/4 overflow-hidden">
                      <div class="flex justify-betweens">
                        اجازة لمدة
                        <div
                          class="text-text dark:text-textGray pr-2 pl-2"
                          v-html="vacation.record"
                        />
                        ساعة من
                        <div
                          class="text-text dark:text-textGray pr-2 pl-2"
                          v-html="vacation.timeFrom"
                        />
                        الى
                        <div
                          class="text-text dark:text-textGray pr-2 pl-2"
                          v-html="vacation.timeTo"
                        />
                        بتاريخ
                        <div
                          class="text-text dark:text-textGray pr-2 pl-2"
                          v-html="vacation.date"
                        />
                      </div>
                    </div>

                    <button
                      class="duration-500 h-10 w-24 rounded-lg bg-create hover:bg-createHover text-white"
                      is-link
                      @click="OpenVacationTime(vacation.id)"
                    >
                      Open
                    </button>
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
          <SimpleLoading v-if="isLoadingTime"></SimpleLoading>
          <!-- end card -->
        </div>
      </div>
    </div>
    <!-- For Daily Report -->
    <div class="w-full">
      <div class="flex flex-col">
        <div class="py-4 inline-block min-w-full lg:px-8">
          <!-- card -->

          <div class="rounded-xl" v-if="isLoadingDaily == false">
            <div
              v-motion
              :initial="{ opacity: 0, y: -15 }"
              :enter="{ opacity: 1, y: 0 }"
              :variants="{ custom: { scale: 2 } }"
              :delay="200"
              v-if="dataVacationDaily.length > 0"
            >
              <div class="max-w-full relative">
                <div
                  class="w-full outline-none font-bold h-10 px-3 py-2 mb-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                >
                  الاجازات الاعتيادية
                </div>
                <div
                  class="grid lg:grid-cols-2 md:grid-cols-2 xs:grid-cols-1 gap-10 lg:m-0 xs:mx-3"
                >
                  <!-- card -->
                  <div
                    class="bg-cardLight dark:bg-card flex w-full p-5 rounded-lg border border-gray-600 shadow-md shadow-gray-900 duration-500 hover:border hover:border-gray-400 hover:shadow-md hover:shadow-gray-600"
                    v-for="vacation in dataVacationDaily"
                    :key="vacation.id"
                  >
                    <div class="w-3/4 overflow-hidden">
                      <div class="flex justify-betweens">
                        اجازة لمدة
                        <div
                          class="text-text dark:text-textGray pr-2 pl-2"
                          v-html="vacation.record"
                        />
                        يوم من
                        <div
                          class="text-text dark:text-textGray pr-2 pl-2"
                          v-html="vacation.dayFrom"
                        />
                        الى
                        <div
                          class="text-text dark:text-textGray pr-2 pl-2"
                          v-html="vacation.dayTo"
                        />
                      </div>
                    </div>

                    <button
                      class="duration-500 h-10 w-24 rounded-lg bg-create hover:bg-createHover text-white"
                      is-link
                      @click="OpenVacationDaily(vacation.id)"
                    >
                      Open
                    </button>
                  </div>
                  <!-- end card -->
                </div>
                <TailwindPagination
                  class="flex justify-center mt-10"
                  :data="dataPageVacationDaily"
                  @pagination-change-page="getDataDaily"
                  :limit="10"
                />
              </div>
            </div>
          </div>
          <SimpleLoading v-if="isLoadingDaily"></SimpleLoading>
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