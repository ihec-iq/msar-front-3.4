<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionStore } from "@/stores/permissionStore";

import type { IVacation, IVacationReason } from "../../IVacation";
import { useVacationTimeStore } from "../vacationTimeStore";
import { useVacationStore } from "../../vacationStore";

import { useVacationReasonStore } from "../../vacationReasonStore";
import ISelect from "@/components/inputs/ISelect.vue";
import { EnumPermission } from "@/utils/EnumSystem";
import { t } from "@/utils/I18nPlugin";

//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
const namePage = ref("VacationTime");
const route = useRoute();
const id = ref(Number(route.params.id));

const objectStore = useVacationTimeStore();
const { vacationTime } = storeToRefs(useVacationTimeStore());
const { vacations } = storeToRefs(useVacationStore());
const { reasons } = storeToRefs(useVacationReasonStore());

const { addHours } = useVacationTimeStore();
const Loading = ref(false);

const router = useRouter();
const errors = ref<string | null>();
const times = ref([
  { name: "نصف ساعة", id: 0.5, selected: true },
  { name: "1 ساعة", id: 1, selected: false },
  { name: "ساعة ونصف", id: 1.5, selected: false },
  { name: "2 ساعة", id: 2, selected: false },
  { name: "ساعتان ونصف", id: 2.5, selected: false },
  { name: "3 ساعة", id: 3, selected: false },
]);
//#endregion
//#region CURD
const reset = () => {
  objectStore.resetData();
};
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

  objectStore
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
      errors.value = objectStore.getError(error);
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

  objectStore
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
      errors.value = objectStore.getError(error);
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
        await objectStore._delete(vacationTime.value.id).then(() => {
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
  checkPermissionAccessArray([EnumPermission.ShowVacationsTime]);
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "VacationTimeAdd";
    vacationTime.value.id = 0;
    reset();
  } else {
    await showData();
    vacationTime.value.id = id.value;
    namePage.value = "VacationTimeUpdate";
  }
  await useVacationStore().get_vacations();
  await useVacationReasonStore().get();
});
// const ChangeDate = () => {
//   if (vacationTime.value.timeFrom.length == 5)
//     vacationTime.value.timeFrom = vacationTime.value.timeFrom + ":00";
//   if (vacationTime.value.timeTo.length == 5)
//     vacationTime.value.timeTo = vacationTime.value.timeTo + ":00";

//   const currentDate = new Date(vacationTime.value.date);
//   const timeFrom =
//     currentDate.getFullYear() +
//     "-" +
//     currentDate.getMonth() +
//     "-" +
//     currentDate.getDay() +
//     " " +
//     vacationTime.value.timeFrom;
//   vacationTime.value.timeTo = addHours(vacationTime.value.record, timeFrom);
// };
const ChangeDateRecord = () => {
  const DateTimeFrom =
    new Date(vacationTime.value.date).toISOString().split("T")[0] +
    " " +
    vacationTime.value.timeFrom;
  vacationTime.value.timeTo = addHours(vacationTime.value.record, DateTimeFrom);
};
</script>
<template>
  <IPage :HeaderTitle="t(namePage)">
    <template #HeaderButtons>
      <IButton2
        color="green"
        width="28"
        type="outlined"
        pre-icon="autorenew"
        :onClick="reset"
        :text="t('New')"
      />
    </template>
    <IPageContent>
      <IRow>
        <IForm>
          <IRow col-lg="4" col-md="2" col-sm="1">
            <ICol span="1" span-md="1" span-sm="1">
              <IInput
                :label="t('Date')"
                name="dayFrom"
                v-model="vacationTime.date"
                type="date"
                @change="ChangeDateRecord()"
            /></ICol>
            <ICol span="1" span-md="1" span-sm="1">
              <ISelect
                :label="t('VacationTimeRecord')"
                v-model="vacationTime.record"
                name="vacationTimeRecord"
                :options="times"
                :IsRequire="true"
                @change="ChangeDateRecord()"
            /></ICol>

            <ICol span="1" span-md="1" span-sm="1">
              <IInput
                :label="t('DateFrom')"
                v-model="vacationTime.timeFrom"
                type="time"
                @input="ChangeDateRecord()"
                :IsRequire="true"
            /></ICol>
            <ICol span="1" span-md="1" span-sm="1">
              <IInput
                :label="t('DateTo')"
                v-model="vacationTime.timeTo"
                type="time"
                @input="ChangeDateRecord()"
                :IsRequire="true"
            /></ICol>
            <ICol span="1" span-md="1" span-sm="1">
              <div
                class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
              >
                {{ t("OutputVoucherEmployeeRequest") }}
              </div>
              <vSelect
                class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                v-model="vacationTime.Vacation"
                :options="vacations"
                :reduce="(vacation: IVacation) => vacation"
                label="name"
                :getOptionLabel="
                  (vacation: IVacation) => vacation.Employee.name
                "
              >
                <template #option="{ Employee }">
                  <div>
                    <span>{{ Employee.name }}</span>
                  </div>
                </template>
              </vSelect>
            </ICol>
            <ICol span="1" span-md="2" span-sm="4">
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
            </ICol>
          </IRow>
        </IForm>
      </IRow>
    </IPageContent>

    <template #Footer>
      <IFooterCrud
        :isAdd="vacationTime.id == 0"
        :onCreate="store"
        :onUpdate="update"
        :onDelete="Delete"
      />
    </template>
  </IPage>
</template>