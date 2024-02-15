<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { usePermissionStore } from "@/stores/permissionStore";
import moment from "moment";

import { useI18n } from "@/stores/i18n/useI18n";
import { useVacationTimeStore } from "@/stores/vacations/vacationTimeStore";
import { useVacationStore } from "@/stores/vacations/vacationStore";
import { now } from "@vueuse/core";
import type { IVacation } from "@/types/vacation/IVacation";
import { useVacationReasonStore } from "@/stores/vacations/vacationReasonStore";
import type { IVacationReason } from "@/types/vacation/IVacationDaily";
import type { IEmployee } from "@/types/IEmployee";
const { t } = useI18n();

//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
const namePage = ref(".....");
const route = useRoute();
const id = ref(Number(route.params.id));
const rtlStore = useRtlStore();
const { is } = storeToRefs(rtlStore);

const vacationTimeStore = useVacationTimeStore();
const { vacationTime } = storeToRefs(useVacationTimeStore());
const { vacations } = storeToRefs(useVacationStore());
const { reasons } = storeToRefs(useVacationReasonStore());

const { addHours } = useVacationTimeStore();
const Loading = ref(false);

const router = useRouter();
const errors = ref<String | null>();
const times = reactive([
  { display: "نصف ساعة", value: 0.5, selected: true },
  { display: "1 ساعة", value: 1, selected: false },
  { display: "2 ساعة", value: 2, selected: false },
  { display: "3 ساعة", value: 3, selected: false },
]);
//#endregion
//#region CURD
const store = () => {
  console.log(vacationTime.value);
  errors.value = null;
  const formData = new FormData();
  formData.append("date", vacationTime.value.date);
  formData.append("timeFrom", vacationTime.value.timeFrom);
  formData.append("timeTo", vacationTime.value.timeTo);
  formData.append("record", vacationTime.value.record.toString());
  formData.append("Vacation", JSON.stringify(vacationTime.value.Vacation));
  formData.append("Reason", JSON.stringify(vacationTime.value.Reason));

  vacationTimeStore
    .store(formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your item has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        router.go(-1);
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = vacationTimeStore.getError(error);
      Swal.fire({
        icon: "error",
        title: "create new data fails!!!",
        text: error.response.data.message,
        footer: "",
      });
    });
};
function update() {
  errors.value = null;
  const formData = new FormData();
  formData.append("date", vacationTime.value.date);
  formData.append("timeFrom", vacationTime.value.timeFrom);
  formData.append("timeTo", vacationTime.value.timeTo);
  formData.append("record", vacationTime.value.record.toString());
  formData.append("Vacation", JSON.stringify(vacationTime.value.Vacation));
  formData.append("Reason", JSON.stringify(vacationTime.value.Reason));

  vacationTimeStore
    .update(vacationTime.value.id, formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your Item has been updated",
          showConfirmButton: false,
          timer: 1500,
        });
        showData();
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = vacationTimeStore.getError(error);
      Swal.fire({
        icon: "error",
        title: "updating data fails!!!",
        text: error.response.data.message,
        footer: "",
      });
    });
}
const Delete = async () => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn m-2 bg-red-700",
      cancelButton: "btn bg-grey-400",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: t("Are You Sure?"),
      text: t("You Won't Be Able To Revert This!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, delete it!"),
      cancelButtonText: t("No, cancel!"),
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        await vacationTimeStore._delete(vacationTime.value.id).then(() => {
          swalWithBootstrapButtons.fire(
            t("Deleted!"),
            t("Deleted successfully ."),
            "success"
          );
          router.go(-1);
        });
      }
    });
};
const showData = async () => {
  Loading.value = true;
  await useVacationTimeStore()
    .show(id.value)
    .then((response) => {
      if (response.status == 200) {
        console.log(response.data.data);
        vacationTime.value.timeFrom = response.data.data.timeFrom;
        vacationTime.value.timeTo = response.data.data.timeTo;
        vacationTime.value.record = response.data.data.record;
        vacationTime.value.Vacation = response.data.data.Vacation;
        vacationTime.value.Reason = response.data.data.Reason;

        //vacationTime.value = response.data.data as IVacationTime;
      }
    })
    .catch((errors) => {
      console.log(errors);
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Your Item file not exist !!!",
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
    name: "vacationTimeIndex",
  });
};
onMounted(async () => {
  //console.log(can("show items1"));
  checkPermissionAccessArray(["show vacations time"]);
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = t("VacationTimeAdd");
    vacationTime.value.id = 0;
  } else {
    await showData();
    vacationTime.value.id = id.value;
    namePage.value = t("VacationTimeUpdate");
  }
  await useVacationStore().get_vacations();
  await useVacationReasonStore().get();
});
const ChangeDate = () => {
  //console.log("ChangeDate");
  if (vacationTime.value.timeFrom.length == 5)
    vacationTime.value.timeFrom = vacationTime.value.timeFrom + ":00";
  if (vacationTime.value.timeTo.length == 5)
    vacationTime.value.timeTo = vacationTime.value.timeTo + ":00";

  const currentDate = new Date(now());
  const timeFrom =
    currentDate.getFullYear() +
    "-" +
    currentDate.getMonth() +
    "-" +
    currentDate.getDay() +
    " " +
    vacationTime.value.timeFrom;
  vacationTime.value.timeTo = addHours(vacationTime.value.record, timeFrom);
  console.log(vacationTime.value.timeTo);
  // if (vacationTime.value.timeFrom >= vacationTime.value.timeTo) {
  //   vacationTime.value.record = 0.5;
  //   ChangeDateRecord();
  //   return;
  // }
  // const oneDay = 24 * 60 * 60 * 1000;
  // const days = Math.round(
  //   (new Date(vacationTime.value.timeTo).valueOf() -
  //     new Date(vacationTime.value.timeFrom).valueOf()) /
  //     oneDay
  // );
  // vacationTime.value.record = days;
};
const ChangeDateRecord = () => {
  console.log("ChangeDateRecord");
  const timeFrom =
    new Date().toISOString().split("T")[0] + " " + vacationTime.value.timeFrom;
  vacationTime.value.timeTo = addHours(vacationTime.value.record, timeFrom);
  console.log(vacationTime.value.timeTo);
};
</script>
<template>
  <PageTitle>
    {{ namePage }}
    <span>{{ moment(now()).format("dddd") }}</span></PageTitle
  >
  <div class="w-full">
    <div class="w-full p-6 grid lg:grid-cols-4 xs:grid-cols-2">
      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("Date") }}
        </div>
        <input
          v-model="vacationTime.date"
          type="date"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
        />
      </div>

      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("VacationTimeRecord") }}
        </div>
        <select
          v-model="vacationTime.record"
          @change="ChangeDateRecord()"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
        >
          <option
            v-for="time in times"
            :key="time.value"
            :value="time.value"
            :selected="time.selected == true"
            class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightOutput dark:bg-input text-text dark:text-textLight"
          >
            {{ time.display }}
          </option>
        </select>
      </div>
      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("DateFrom") }}
        </div>
        <input
          v-model="vacationTime.timeFrom"
          type="time"
          @input="ChangeDate()"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
        />
      </div>
      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("DateTo") }}
        </div>
        <input
          v-model="vacationTime.timeTo"
          type="time"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
        />
      </div>
      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("OutputVoucherEmployeeRequest") }}
        </div>
        <!-- <select
          v-model="vacationTime.Vacation"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
        >
          <option
            v-for="vacation in vacations"
            :key="vacation.id"
            :value="vacation"
            class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightOutput dark:bg-input text-text dark:text-textLight"
          >
            {{ vacation.Employee.name }}
          </option>
        </select> -->
        <vSelect
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
          v-model="vacationTime.Vacation"
          :options="vacations"
          :reduce="(vacation: IVacation) => vacation"
          label="name"
          :getOptionLabel="(vacation: IVacation) => vacation.Employee.name"
        >
          <template #option="{ Employee }">
            <div>
              <span>{{ Employee.name }}</span>
            </div>
          </template>
        </vSelect>
      </div>
      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("VacationReason") }}
        </div>
        <vSelect
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
          v-model="vacationTime.Reason"
          :options="reasons"
          :reduce="(reason: IVacationReason) => reason"
          label="name"
          :getOptionLabel="(reason: IVacationReason) => reason.name"
        >
          <template #option="{ name }">
            <div>
              <span>{{ name }}</span>
            </div>
          </template>
        </vSelect>
      </div>
    </div>
    <!-- bottom tool bar -->
    <div
      :class="{
        'lg:w-[99.2%] xs:w-[97%] lg:mx-2 xs:mx-2 bottom': is,
        'lg:w-[95%] md:w-[90%] xs:w-[75%] lg:mr-0 ltr:xs:ml-3 rtl:xs:mr-3 bottom': !is,
      }"
      class="dark:bg-bottomTool duration-700 bg-ideNavLight p-2 rounded-lg flex items-center justify-end fixed bottom-0 print:hidden"
    >
      <div class="flex ltr:ml-8 rtl:mr-8">
        <div class="items-center mr-3">
          <button
            v-if="vacationTime.id == 0"
            @click="store()"
            class="bg-create hover:bg-createHover ml-1 duration-500 h-10 lg:w-32 xs:w-20 rounded-lg text-white"
          >
            {{ t("Create") }}
          </button>
          <button
            v-else
            @click="update()"
            class="bg-update hover:bg-updateHover ml-1 duration-500 h-10 lg:w-32 xs:w-20 rounded-lg text-white"
          >
            {{ t("Update") }}
          </button>
          <button
            v-if="vacationTime.id != 0"
            @click="Delete()"
            class="bg-delete hover:bg-deleteHover duration-500 h-10 lg:w-32 xs:w-20 rounded-lg text-white ml-2"
          >
            {{ t("Delete") }}
          </button>
        </div>
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
  </div>
  <!-- end bottom tool -->
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
