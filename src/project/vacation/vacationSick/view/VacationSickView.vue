<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";

import type { IVacation } from "../../IVacation";
import type { IVacationSick } from "../IVacationSick";
import { useVacationSickStore } from "../vacationSickStore";
import { useVacationStore } from "../../vacationStore";

import { EnumPermission } from "@/utilities/EnumSystem";
import { t } from "@/utilities/I18nPlugin";
import IInput from "@/components/inputs/IInput.vue";
import { CNumber, makeFormDataFromObject } from "@/utilities/tools";
import {
  useValidation,
  type IValidationResult,
  type IFieldValidation,
} from "@/utilities/Validation";
import { WarningToast } from "@/utilities/Toast";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";
 
const { validate, min, required, isObject, max, number } = useValidation();

let validationResult = ref<IValidationResult>({ success: true, errors: [] });

const rules: Array<IFieldValidation> = [
  {
    field: "dayFrom",
    caption: t("DayFrom"),
    rules: [required()],
  },
  {
    field: "dayTo",
    caption: t("DayTo"),
    rules: [required()],
  },
  {
    field: "record",
    caption: t("Record"),
    rules: [required(), number()],
  },
  {
    field: "Vacation",
    caption: t("OutputVoucherEmployeeRequest"),
    rules: [isObject({ key: "id", message: "" })],
  },
];

//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray, can } = usePermissionsStore();
const namePage = ref("VacationSick");
const route = useRoute();
const id = ref(Number(route.params.id));
const isLoading = ref(false);

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
  validationResult.value = validate(vacationSick.value, rules);

  if (!validationResult.value.success) {
    WarningToast(t("ValidationFails"));
    return;
  }

  errors.value = null;
  const formData = makeFormDataFromObject(vacationSick.value);

  objectStore
    .store(formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
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
  validationResult.value = validate(vacationSick.value, rules);

  if (!validationResult.value.success) {
    WarningToast(t("ValidationFails"));
    return;
  }
  errors.value = null;
  // formData.append("dayFrom", vacationSick.value.dayFrom);
  // formData.append("dayTo", vacationSick.value.dayTo);
  // formData.append("record", vacationSick.value.record.toString());
  // formData.append("Vacation", JSON.stringify(vacationSick.value.Vacation));
  const formData = makeFormDataFromObject(vacationSick.value);

  objectStore
    .update(vacationSick.value.id, formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
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
  isLoading.value = true;
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
  isLoading.value = false;
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
  <IPage :HeaderTitle="t(namePage)" :is-loading="isLoading">
    <template #HeaderButtons>
      <IButton2
        color="green"
        width="28"
        :type="EnumButtonType.Outlined"
        pre-icon="view-grid-plus"
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
                :type="EnumInputType.Date"
                @change="ChangeDate()"
              />
            </ICol>
            <ICol span="2" span-md="2" span-sm="4">
              <IInput
                :label="t('DateTo')"
                v-model="vacationSick.dayTo"
                name="issueDate"
                :type="EnumInputType.Date"
                @change="ChangeDate()"
                :IsRequire="true"
              />
            </ICol>
            <ICol span="1" span-md="2" span-sm="4">
              <IInput
                :label="t('RecordSick')"
                v-model="vacationSick.record"
                :type="EnumInputType.Number"
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
      <IErrorMessages :validationResult="validationResult" />
    </IPageContent>

    <template #Footer>
      <IFooterCrud
        :isAdd="vacationSick.id == 0"
        :onCreate="store"
        :onUpdate="update"
        :onDelete="Delete"
        :showAdd="can(EnumPermission.AddVacationSick) == 1"
        :showUpdate="can(EnumPermission.EditVacationSick) == 1"
        :showDelete="can(EnumPermission.DeleteVacationSick) == 1"
      />
    </template>
  </IPage>
</template>
