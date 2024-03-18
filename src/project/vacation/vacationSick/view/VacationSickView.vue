<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionStore } from "@/project/user/permissionStore";

import type { IVacation } from "../../IVacation";
import type { IVacationSick } from "../IVacationSick";
import { useVacationSickStore } from "../vacationSickStore";
import { useVacationStore } from "../../vacationStore";

import { EnumPermission } from "@/utils/EnumSystem";
import { t } from "@/utils/I18nPlugin";
import IInput from "@/components/inputs/IInput.vue";
import { CNumber } from "@/utils/tools";

//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
const namePage = ref("VacationSick");
const route = useRoute();
const id = ref(Number(route.params.id));

const objectStore = useVacationSickStore();
const { vacationSick } = storeToRefs(useVacationSickStore());
const { vacations } = storeToRefs(useVacationStore());

const Loading = ref(false);

const router = useRouter();
const errors = ref<string | null>();
//#endregion
//#region CURD
const reset = () => {
  objectStore.resetData();
};
const store = () => {
  errors.value = null;
  const formData = new FormData();
  formData.append("dayFrom", vacationSick.value.dayFrom);
  formData.append("dayTo", vacationSick.value.dayTo);
  formData.append("record", vacationSick.value.record.toString());
  formData.append("Vacation", JSON.stringify(vacationSick.value.Vacation));
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
  formData.append("dayFrom", vacationSick.value.dayFrom);
  formData.append("dayTo", vacationSick.value.dayTo);
  formData.append("record", vacationSick.value.record.toString());
  formData.append("Vacation", JSON.stringify(vacationSick.value.Vacation));

  objectStore
    .update(vacationSick.value.id, formData)
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
        await objectStore._delete(vacationSick.value.id).then(() => {
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
  await useVacationSickStore()
    .show(id.value)
    .then((response) => {
      if (response.status == 200) {
        vacationSick.value.dayFrom = response.data.data.dayFrom;
        vacationSick.value.dayTo = response.data.data.dayTo;
        vacationSick.value.record = response.data.data.record;
        vacationSick.value.Vacation = response.data.data.Vacation;
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
    name: "vacationSickIndex",
  });
};
 
onMounted(async () => {
  //console.log(can("show items1"));
  checkPermissionAccessArray([EnumPermission.ShowVacationsSick]);

  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "VacationSickAdd";
    vacationSick.value.id = 0;
  } else {
    await showData();
    vacationSick.value.id = CNumber(id.value);
    namePage.value = "VacationSickUpdate";
  }
  await useVacationStore().get_vacations();
});
const ChangeDate = () => {
  if (vacationSick.value.dayFrom >= vacationSick.value.dayTo) {
    vacationSick.value.record = 1;
    ChangeDateRecord();
    return;
  }
  const oneDay = 24 * 60 * 60 * 1000;
  const days = Math.round(
    (new Date(vacationSick.value.dayTo).valueOf() -
      new Date(vacationSick.value.dayFrom).valueOf()) /
      oneDay
  );
  vacationSick.value.record = days;
};
const ChangeDateRecord = () => {
  let d = new Date(vacationSick.value.dayFrom);
  d.setDate(d.getDate() + vacationSick.value.record);
  vacationSick.value.dayTo = d.toISOString().split("T")[0];
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
            <ICol span="2" span-md="1" span-sm="1">
              <IInput
                :label="t('DateFrom')"
                name="dayFrom"
                v-model="vacationSick.dayFrom"
                type="date"
                @change="ChangeDate()"
              />
            </ICol>
            <ICol span="2" span-md="2" span-sm="4">
              <IInput
                :label="t('DateTo')"
                v-model="vacationSick.dayTo"
                name="issueDate"
                type="date"
                @change="ChangeDate()"
                :IsRequire="true"
              />
            </ICol>
            <ICol span="1" span-md="2" span-sm="4">
              <IInput
                :label="t('RecordSick')"
                v-model="vacationSick.record"
                type="number"
                @input="ChangeDateRecord()"
                :min="1"
                :IsRequire="true"
              />
            </ICol>
            <ICol span="2" span-lg="2" span-md="2" span-sm="4">
              <div class="">
                {{ t("OutputVoucherEmployeeRequest") }}
              </div>
              <vSelect
                class="_input"
                v-model="vacationSick.Vacation"
                :options="vacations"
                :reduce="(vacation: IVacation) => vacation"
                label="name"
                :getOptionLabel="
                  (vacation: IVacation) => vacation.Employee.name
                "
              />
            </ICol>
          </IRow>
        </IForm>
      </IRow>
    </IPageContent>

    <template #Footer>
      <IFooterCrud
        :isAdd="vacationSick.id == 0"
        :onCreate="store"
        :onUpdate="update"
        :onDelete="Delete"
      />
    </template>
  </IPage>
</template>
@/project/user/permissionStore