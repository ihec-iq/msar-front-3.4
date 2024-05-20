<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { useVacationDailyStore } from "../vacationDailyStore";
import { useVacationStore } from "../../vacationStore";
import type { IEmployee } from "@/project/employee/IEmployee";
import { useEmployeeStore } from "@/project/employee/employeeStore";
import { useVacationReasonStore } from "../../vacationReasonStore";
import { usePaperizer } from "paperizer";
const { paperize } = usePaperizer("printMe");
import printJS from "print-js";

import {
  useValidation,
  type IValidationResult,
  type IFieldValidation,
} from "@/utilities/Validation";
import { WarningToast } from "@/utilities/Toast";

const { validate, min, required, foreignKey, max, number } = useValidation();

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
    caption: t("Vacation"),
    rules: [required()],
  },
  {
    field: "Reason",
    caption: t("Reason"),
    rules: [required()],
  },
  {
    field: "EmployeeAlter",
    caption: t("EmployeeAlter"),
    rules: [required()],
  },
];

import type { IVacation, IVacationReason } from "../../IVacation";
//#region Vars
const { checkPermissionAccessArray, can } = usePermissionsStore();
const namePage = ref("VacationDaily");
const route = useRoute();
const id = ref(Number(route.params.id));

const vacationDailyStore = useVacationDailyStore();
const { vacationDaily } = storeToRefs(useVacationDailyStore());
const { vacations } = storeToRefs(useVacationStore());
const { reasons } = storeToRefs(useVacationReasonStore());
const { employees } = storeToRefs(useEmployeeStore());
const isLoading = ref(false);
const router = useRouter();
const errors = ref<string | null>();
//#endregion
//#region CURD
const storeWithPrint = () => {
  store(true);
};
const store = (withPrint: boolean = false) => {
  validationResult.value = validate(vacationDaily.value, rules);

  if (!validationResult.value.success) {
    WarningToast(t("ValidationFails"));
    return;
  }

  errors.value = null;
  const formData = new FormData();
  console.log(vacationDaily.value);
  formData.append("dayFrom", vacationDaily.value.dayFrom);
  formData.append("dayTo", vacationDaily.value.dayTo);
  formData.append("record", vacationDaily.value.record.toString());
  formData.append("Vacation", JSON.stringify(vacationDaily.value.Vacation));
  formData.append(
    "EmployeeAlter",
    JSON.stringify(vacationDaily.value.EmployeeAlter)
  );
  formData.append("Reason", JSON.stringify(vacationDaily.value.Reason));
  vacationDailyStore
    .store(formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Your item has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        console.log(response.data);
        if (withPrint) printWindow();
        router.go(-1);
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = vacationDailyStore.getError(error);
      Swal.fire({
        icon: "error",
        title: "create new data fails!!!",
        text: error.response.data.message,
        footer: "",
      });
    });
};
function update() {
  validationResult.value = validate(vacationDaily.value, rules);

  if (!validationResult.value.success) {
    WarningToast(t("ValidationFails"));
    return;
  }
  errors.value = null;
  const formData = new FormData();
  formData.append("dayFrom", vacationDaily.value.dayFrom);
  formData.append("dayTo", vacationDaily.value.dayTo);
  formData.append("record", vacationDaily.value.record.toString());
  formData.append("Vacation", JSON.stringify(vacationDaily.value.Vacation));
  formData.append(
    "EmployeeAlter",
    JSON.stringify(vacationDaily.value.EmployeeAlter)
  );
  formData.append("Reason", JSON.stringify(vacationDaily.value.Reason));

  vacationDailyStore
    .update(vacationDaily.value.id, formData)
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
      errors.value = vacationDailyStore.getError(error);
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
        await vacationDailyStore
          ._delete(vacationDaily.value.id)
          .then(() => {
            swalWithBootstrapButtons.fire(
              t("Deleted!"),
              t("Deleted successfully ."),
              "success"
            );
            router.go(-1);
          })
          .catch((error) => {
            swalWithBootstrapButtons.fire(t("Deleted!"), error, "error");
          });
      }
    });
};
const showData = async () => {
  isLoading.value = true;
  await useVacationDailyStore()
    .show(id.value)
    .then((response) => {
      if (response.status == 200) {
        vacationDaily.value.dayFrom = response.data.data.dayFrom;
        vacationDaily.value.dayTo = response.data.data.dayTo;
        vacationDaily.value.record = response.data.data.record;
        vacationDaily.value.Vacation = response.data.data.Vacation;
        vacationDaily.value.EmployeeAlter = response.data.data.EmployeeAlter;
        vacationDaily.value.Reason = response.data.data.Reason;
        //vacationDaily.value = response.data.data as IVacationDaily;
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
  isLoading.value = false;
};
//#endregion
const back = () => {
  router.push({
    name: "vacationDailyIndex",
  });
};
const printDirect222 = () => {
  printJS("printMe1", "html");
  return;
};
import printDirect from "@thiagoelg/node-printer";

const printWindow2 = () => {
  const options = {
    media: "A4",
    n: 1,
  };
  const prtHtml = document.getElementById("printMe")?.innerHTML;

  // printDirect.printDirect(prtHtml, options);
};
const printWindow = () => {
  // Pass the element id here
  //paperize();

  const prtHtml = document.getElementById("printMe")?.innerHTML;
  // Get all stylesheets HTML
  let stylesHtml = "";
  for (const node of [
    ...document.querySelectorAll('link[rel="stylesheet"], style'),
  ]) {
    stylesHtml += node.outerHTML;
  }
  // Open the print window
  const WinPrint = window.open(
    "",
    "",
    "left=0,top=0, toolbar=0,scrollbars=0,status=0"
  );

  WinPrint?.document.write(`<!DOCTYPE html>
<html>
  <head>
    ${stylesHtml}
    <style>
         body {
         -webkit-print-color-adjust: exact; /*Chrome,Safari,Edge*/
         color-adjust: exact;              /* firefox*/
         }
    </style>
  </head>
  <body style="background-color: white">
    ${prtHtml}
  </body>
</html>`);
  var options = {
    silent: false,
    printBackground: true,
    color: false,
    margin: {
      marginType: "printableArea",
    },
    landscape: false,
    pagesPerSheet: 1,
    collate: false,
    copies: 1,
    header: "Header of the Page",
    footer: "Footer of the Page",
  };
  setTimeout(function () {
    // wait until all resources loaded
    WinPrint?.document.close(); // necessary for IE >= 10
    WinPrint?.focus(); // necessary for IE >= 10
    WinPrint?.print(); // change window to winPrint
    WinPrint?.close(); // change window to winPrint
  }, 250);
};

const ChangeDate = () => {
  if (vacationDaily.value.dayFrom >= vacationDaily.value.dayTo) {
    vacationDaily.value.record = 1;
    ChangeDateRecord();
    return;
  }
  const oneDay = 24 * 60 * 60 * 1000;
  const days = Math.round(
    (new Date(vacationDaily.value.dayTo).valueOf() -
      new Date(vacationDaily.value.dayFrom).valueOf()) /
      oneDay
  );
  vacationDaily.value.record = days;
};
const ChangeDateRecord = () => {
  let d = new Date(vacationDaily.value.dayFrom);
  d.setDate(d.getDate() + vacationDaily.value.record);
  vacationDaily.value.dayTo = d.toISOString().split("T")[0];
};
//#region filters"

const SelectedEmployees = ref<Array<IEmployee>>([]);

const SelectEmployeeSection = () => {
  isLoading.value = true;
  if (
    vacationDaily.value.Vacation?.id == undefined ||
    vacationDaily.value.Vacation?.id == 0
  ) {
    SelectedEmployees.value = employees.value;
  } else {
    SelectedEmployees.value = employees.value.filter(filterEmployeesBySection);
  }
  isLoading.value = false;
};
const filterEmployeesBySection = (_employee: IEmployee) => {
  if (
    (vacationDaily.value.Vacation.Employee?.Position.level === "1" ||
      vacationDaily.value.Vacation.Employee?.Position.level === "0") &&
    (_employee.Position.level === "0" || _employee.Position.level === "1") &&
    _employee.id != vacationDaily.value.Vacation.Employee?.id
  ) {
    return true;
  }
  if (
    vacationDaily.value.Vacation.Employee.isMoveSection == 1 &&
    vacationDaily.value.Vacation?.Employee.MoveSection.id != 1 &&
    _employee.Section.id ==
      vacationDaily.value.Vacation?.Employee.MoveSection.id &&
    _employee.id != vacationDaily.value.Vacation.Employee?.id
  ) {
    return true;
  } else {
    if (
      _employee.Section.id ==
        vacationDaily.value.Vacation?.Employee.Section.id &&
      _employee.id != vacationDaily.value.Vacation.Employee?.id
    ) {
      return true;
    }
  }
};
watch(
  () => vacationDaily.value.Vacation?.Employee.id,
  () => {
    SelectEmployeeSection();
  }
);
//#endregion
function getImageUrl(name: string, ext: string) {
  return new URL(`@/assets/${name}.${ext}`, import.meta.url).href;
}
import { useAuthStore } from "@/stores/authStore";
import { EnumPermission } from "@/utilities/EnumSystem";
import IButton2 from "@/components/ihec/IButton2.vue";
import IFooterCrud from "@/components/ihec/IFooterCrud.vue";
import IPageContent from "@/components/ihec/IPageContent.vue";
import IPage from "@/components/ihec/IPage.vue";
import { t } from "@/utilities/I18nPlugin";

import printer from "@thiagoelg/node-printer";
import util from "util";

onMounted(async () => {
  //console.log(can("show items1"));
  isLoading.value = true;

  // console.log(
  //   "installed printers:\n" +
  //     util.inspect(printer.getPrinters(), { colors: true, depth: 10 })
  // );

  checkPermissionAccessArray([EnumPermission.ShowVacationsDaily]);
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "VacationDailyAdd";
    vacationDaily.value.id = 0;
  } else {
    await showData();
    vacationDaily.value.id = id.value;
    namePage.value = "VacationDailyUpdate";
  }
  await useVacationStore().get_vacations();
  await useVacationReasonStore().get();
  await useEmployeeStore()
    .get_employees()
    .then(() => {
      SelectEmployeeSection();
    });
  isLoading.value = false;
});
const reset = () => {
  useVacationDailyStore().resetData();
};
</script>
<template>
  <IPage :HeaderTitle="t(namePage)" :is-loading="isLoading" id="printMe1">
    <template #HeaderButtons>
      <IButton2
        color="green"
        width="28"
        type="outlined"
        pre-icon="view-grid-plus"
        :onClick="reset"
        :text="t('New')"
      />
    </template>
    <IPageContent>
      <IRow>
        <IForm>
          <IRow col="4" col-lg="4" col-md="2" col-sm="1">
            <ICol
              ><div
                class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
              >
                {{ t("DateFrom") }}
              </div>
              <input
                v-model="vacationDaily.dayFrom"
                type="date"
                @change="ChangeDate()"
                class="DateStyle"
              />
            </ICol>
            <ICol>
              <div
                class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
              >
                {{ t("DateTo") }}
              </div>
              <input
                v-model="vacationDaily.dayTo"
                type="date"
                @change="ChangeDate()"
                class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
              />
            </ICol>
            <ICol>
              <div
                class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
              >
                {{ t("RecordDaily") }}
              </div>
              <input
                v-model="vacationDaily.record"
                type="number"
                @input="ChangeDateRecord()"
                min="1"
                class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
              />
            </ICol>
            <ICol>
              <div
                class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
              >
                {{ t("OutputVoucherEmployeeRequest") }}
              </div>
              <vSelect
                class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                v-model="vacationDaily.Vacation"
                :options="vacations"
                :reduce="(vacation: IVacation) => vacation"
                label="name"
                :getOptionLabel="
                  (vacation: IVacation) => vacation.Employee.name
                "
              >
                <template #option="{ Employee }">
                  <div>
                    <span>{{ Employee.name }}</span
                    ><br />
                    <span class="text-xs align-super text-gray-400">
                      ({{ Employee.Section.name }})</span
                    >
                  </div>
                </template>
              </vSelect>
            </ICol>
            <ICol>
              <div
                class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
              >
                {{ t("OutputVoucherEmployeeAlter") }}
              </div>
              <vSelect
                class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                v-model="vacationDaily.EmployeeAlter"
                :options="SelectedEmployees"
                :reduce="(employee: IEmployee) => employee"
                label="name"
                :getOptionLabel="(employee: IEmployee) => employee.name"
              >
                <template #option="{ name, Section }">
                  <div>
                    <span>{{ name }}</span>
                    <br />
                    <span class="text-xs align-super text-gray-400">
                      ({{ Section.name }})</span
                    >
                  </div>
                </template>
              </vSelect>
            </ICol>
            <ICol>
              <div
                class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
              >
                {{ t("VacationReason") }}
              </div>
              <vSelect
                class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                v-model="vacationDaily.Reason"
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
      <IErrorMessages :validationResult="validationResult" />
    </IPageContent>
    <template #Footer>
      <IFooterCrud
        :isAdd="vacationDaily.id == 0"
        :onCreate="store"
        :onUpdate="update"
        :onDelete="Delete"
        :showAdd="can(EnumPermission.AddVacationDaily) == 1"
        :showUpdate="can(EnumPermission.EditVacationDaily) == 1"
        :showDelete="can(EnumPermission.DeleteVacationDaily) == 1"
      >
        <template #Pre>
          <IButton2
            v-if="vacationDaily.id != 0"
            :text="t('Print')"
            pre-icon="printer"
            type="outlined"
            :onClick="printWindow"
          />
          <IButton2
            v-if="vacationDaily.id == 0"
            :text="t('CreateWithPrint')"
            type="outlined"
            pre-icon="printer-pos-plus"
            :onClick="storeWithPrint"
          />
          <IButton2
            v-if="vacationDaily.id == 0"
            text="Test"
            type="outlined"
            pre-icon="printer-pos-plus"
            :onClick="printWindow"
          />
        </template>
      </IFooterCrud>
    </template>
  </IPage>

  <div
    class="hidden print:w-[900px] w-[900px] tablePrint m-2 print:bg-white bg-white"
    id="printMe"
    style="background-color: white !important"
    print:rtl
  >
    <div id="Header" class="w-[900px] print:w-[900px] print:bg-white bg-white">
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <!-- <img src="@/assets/ihec_logo_header1.png" class="print-img" /> -->
      <img
        src="@/assets/image/ihec_logo_header1.png"
        class="downHeader w-[900px] print:w-[900px]"
        alt=""
      />
    </div>
    <div id="body" class="print:bg-white bg-white">
      <table
        class="w-[900px] print:bg-white bg-white float-right print:w-[900px] content-center print:rtl rtl border-[#27156D] border-solid border-2 print:border-[#27156D] print:border-solid print:border-2"
        style="
          width: 890px !important ;
          margin: 3px !important ;
          text-align: right;
        "
      >
        <tr class="RowTable">
          <td class="RowHeader w-[50%]">اسم الموظف</td>
          <td class="RowContent w-[50%]">
            {{ vacationDaily.Vacation?.Employee.name }}
          </td>
        </tr>
        <tr class="RowTable">
          <td class="RowHeader w-[50%]">الشعبة</td>
          <td class="RowContent w-[50%]">
            {{ vacationDaily.Vacation?.Employee.Section?.name }}
          </td>
        </tr>
        <tr class="RowTable">
          <td class="RowHeader w-[50%]">تفاصيل الاجازة</td>
          <td class="RowContent w-[50%]">
            يرجى التفضل بالموافقة على منحي اجازة اعتيادية لمدة
            {{ vacationDaily.record }}
            ايام براتب تام من تاريخ
            {{ vacationDaily.dayFrom }}
            الى تاريخ
            {{ vacationDaily.dayTo }}
            وذلك بسبب ( {{ vacationDaily.Reason.name }} )
          </td>
        </tr>
        <tr class="RowTable">
          <td class="RowHeader w-[50%]">توقيع الموظف</td>
          <td class="RowContent w-[50%]"></td>
        </tr>
        <tr class="RowTable">
          <td class="RowHeader w-[50%]">الموظف البديل وتوقيعه</td>
          <td class="RowContent w-[50%]">
            {{ vacationDaily.EmployeeAlter.name }}
          </td>
        </tr>
      </table>
    </div>

    <div
      class="divFooter1 z-0 w-[900px] print:w-[900px] print:bg-white bg-white"
    >
      <!-- <img src="@/assets/ihec_logo_header1.png" class="print-img" /> -->
      <table
        class="print:bg-white bg-white float-right w-[900px] print:w-[900px] content-center print:rtl rtl border-[#27156D] border-solid border-2 print:border-[#27156D] print:border-solid print:border-2"
        style="
          width: 890px !important ;
          margin: 3px !important ;
          text-align: right;
        "
      >
        <caption></caption>
        <tr class="RowTable margin15" style="align-content: center !important">
          <td class="font-bold text-xl text-text dark:text-textLight p-10">
            موافقة مسؤول الشعبة
          </td>
          <td class="font-bold text-xl text-text dark:text-textLight p-10">
            موافقة معاون المدير
          </td>
        </tr>
        <tr class="RowTable margin15" style="align-content: center !important">
          <td class="font-bold text-sm text-text dark:text-textLight p-10">
            اسم وتوقيع موظف الادارية
            <br />
            {{ useAuthStore().user?.Employee?.name }}
          </td>
          <td class="font-bold text-2xl text-text dark:text-textLight p-10">
            توقيع المدير
          </td>
        </tr>
      </table>
      <img
        alt=""
        src="@/assets/image/ihec_logo_footer1.png"
        class="w-[903px] print:w-[903px]"
        style="margin-right: -10"
      />
    </div>
  </div>
</template>
<style scoped>
.RowHeader {
  @apply font-bold pr-2 pt-2 text-xl outline-none h-10 px-3 py-2  rounded-md  text-text dark:text-textLight;
}
.RowContent {
  @apply pr-2 pt-2 text-xl outline-none h-10 px-3 py-2  rounded-md  text-text dark:text-textLight;
}
.RowTable {
  @apply border-solid border-2 border-[#27156D];
}
@media screen {
}
@media print {
  table {
    direction: rtl;
    width: 80%;
  }
  div.margin15 {
    margin-top: 10px;
  }
  div.divFooterSignature {
    position: fixed;
    bottom: 1;
  }
  div.divFooter {
    position: fixed;
    bottom: 0;
  }
  div.downHeader {
    padding-top: 0px;
  }
}
.DateStyle {
  @apply w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight;
}
.logo {
  height: 400px;
  width: 400px;
}
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
