<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { useOutputVoucherStore } from "./../outputVoucherStore";
import { useInputVoucherStore } from "@/project/warehouse/inputVoucher/inputVoucherStore";
import type { IOutputVoucherItem } from "../IOutputVoucher";
import { t } from "@/utilities/I18nPlugin";
import type { IInputVoucherItem } from "../../inputVoucher/IInputVoucher";
import type { ITableHeader } from "@/types/core/components/ITable";
import { EnumPermission } from "@/utilities/EnumSystem";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";
import IInput from "@/components/inputs/IInput.vue";
import IButton2 from "@/components/ihec/IButton2.vue";
import type { IEmployee } from "@/project/employee/IEmployee";
import IBasis from "@/components/ihec/IBasis.vue";
import IFlex from "@/components/ihec/IFlex.vue";
import {
  ConvertToMoneyFormat,
  makeFormDataFromObject,
  ToNumberShow,
} from "@/utilities/tools";

//region"Validation"
import {
  useValidation,
  type IValidationResult,
  type IFieldValidation,
} from "@/utilities/Validation";
import { SuccessToast, WarningToast } from "@/utilities/Toast2";
import IErrorMessages from "@/components/ihec/IErrorMessages.vue";
import IPage from "@/components/ihec/IPage.vue";
import ILabel from "@/components/ihec/ILabel.vue";

const { validate, isArray, required, isObject } = useValidation();

let validationResult = ref<IValidationResult>({ success: true, errors: [] });

const rules: Array<IFieldValidation> = [
  { field: "number", caption: t("OutputVoucher.Number"), rules: [required()] },
  {
    field: "Employee",
    caption: t("EmployeeRequest"),
    rules: [isObject({ key: "id", message: "يجب ان تقوم بأختيار الموظف" })],
  },
  {
    field: "Items",
    caption: t("Item.Sum"),
    rules: [isArray({ message: "يجب ان يحتوي السند على مواد" })],
  },
];
//#endregion
//#region Drag & Drop
import { useDragDropStore } from "@/project/archive/dragDrop";
import FilePreview from "@/project/archive/view/FilePreview.vue";
import DragDrop from "@/project/archive/view/DragDrop.vue";
import { showToast } from "@/utilities/toast";
import ISelectObject from "@/components/inputs/ISelectObject.vue";
import ISelect from "@/components/inputs/ISelect.vue";
import ISelect2 from "@/components/inputs/ISelect2.vue";
import IButton from "@/components/ihec/IButton.vue";
import IRow from "@/components/ihec/IRow.vue";
import SearchableTableItemsOutputVOucher from "../../component/SearchableTableItemsOutputVoucher.vue";
import SearchableTableItemsOutputVoucher from "../../component/SearchableTableItemsOutputVoucher.vue";
import { Label } from "radix-vue";
const { filesDataInput } = storeToRefs(useDragDropStore());
const updateList = () => {
  if (id.value > 0) showData(id.value);
};
//#region Vars
const { checkPermissionAccessArray } = usePermissionsStore();
const namePage = ref("OutputVoucher.Add");
const route = useRoute();
const id = ref(Number(route.params.id));

const outputVoucherStore = useOutputVoucherStore();
const { outputVoucher, outputVoucherEmployees } = storeToRefs(
  useOutputVoucherStore()
);
//#region popUp
const showPop = ref(false);
const IsAdd = ref(false);

const OutputVoucherItem = ref<IOutputVoucherItem>({
  id: 0,
  Item: {
    id: 1,
    name: "",
    code: "",
    description: "",
    Category: { id: 1, name: "", description: "" },
    measuringUnit: "",
  },
  description: "",
  count: 1,
  price: 1,
  value: 1,
  notes: "",
  inputVoucherItemId: 0,
  InputVoucherItem: {
    Item: {
      id: 0,
      name: "",
      code: "",
      description: "",
      Category: { id: 0, name: "", description: "" },
      measuringUnit: "",
    },
    description: "",
    count: 1,
    price: 1,
    value: 1,
  },
  outputVoucherId: 0,
});
const AddPopup = () => {
  showPop.value = true;
  resetVoucherItem();
};
const resetVoucherItem = () => {
  IsAdd.value = true;
  indexSelectedVoucherItem.value = 0;

  OutputVoucherItem.value = {
    id: 0,
    Item: {
      id: 1,
      name: "",
      code: "",
      description: "",
      Category: { id: 1, name: "", description: "" },
      measuringUnit: "",
    },
    description: "",
    count: 1,
    price: 1,
    value: 1,
    notes: "",
    inputVoucherItemId: 0,
    outputVoucherId: 0,
    InputVoucherItem: {
      Item: {
        id: 0,
        name: "",
        code: "",
        description: "",
        Category: { id: 0, name: "", description: "" },
        measuringUnit: "",
      },
      description: "",
      count: 1,
      price: 1,
      value: 1,
    },
  };
};
//#region Item Row
const deleteItem = (index: number) => {
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
        outputVoucherStore.removeItem(index);
      }
    });
};
const updatePopup = (index: number, itemX: IOutputVoucherItem) => {
  showPop.value = true;
  IsAdd.value = false;
  indexSelectedVoucherItem.value = index;
  OutputVoucherItem.value = itemX;
  OutputVoucherItem.value.inputVoucherItemId = Number(
    itemX.inputVoucherItemId
  );
};
const AddItem = () => {
  OutputVoucherItem.value.Item = OutputVoucherItem.value.Item;
  OutputVoucherItem.value.description = String(
    OutputVoucherItem.value.InputVoucherItem?.description
  );
  OutputVoucherItem.value.price = Number(
    OutputVoucherItem.value.InputVoucherItem?.price
  );
  ChangeValueTotal();
  OutputVoucherItem.value.inputVoucherItemId = Number(
    OutputVoucherItem.value.InputVoucherItem.id
  );
  outputVoucherStore.addItem(OutputVoucherItem.value);

  resetVoucherItem();
  OutputVoucherItem.value.InputVoucherItem = {
    Item: {
      id: 0,
      name: "",
      code: "",
      description: "",
      Category: { id: 0, name: "", description: "" },
      measuringUnit: "",
    },
    description: "",
    count: 1,
    price: 1,
    value: 1,
  };
  showPop.value = false;
};
const ChangeValueTotal = () => {
  OutputVoucherItem.value.value =
    (Number(OutputVoucherItem.value.count) || 0) *
    (OutputVoucherItem.value.InputVoucherItem?.price || 0);
};

// for change the value of total in form item
watch(
  () => OutputVoucherItem.value.InputVoucherItem || null,
  (newX) => {
    ChangeValueTotal();
  }
);
const indexSelectedVoucherItem = ref(0);
const EditItem = () => {
  OutputVoucherItem.value.value =
    OutputVoucherItem.value.count * OutputVoucherItem.value.price;
  outputVoucherStore.editItem(
    indexSelectedVoucherItem.value,
    OutputVoucherItem.value
  );
  resetVoucherItem();
  showPop.value = false;
};
//#endregion

const Loading = ref(false);
const router = useRouter();
const errors = ref<string | null>();

//#region CURD
const reset = () => {
  outputVoucherStore.resetData();
  OutputVoucherItem.value.InputVoucherItem = {
    Item: {
      id: 0,
      name: "",
      code: "",
      description: "",
      Category: { id: 0, name: "", description: "" },
      measuringUnit: "",
    },
    description: "",
    count: 1,
    price: 1,
    value: 1,
  };
};

const store = () => {
  validationResult.value = validate(outputVoucher.value, rules);

  if (!validationResult.value.success) {
    let messages = validationResult.value.errors[0].messages.join("، ");
    showToast(
      t("FailedValidation") +
        " : " +
        validationResult.value.errors[0].fieldName,
      {
        description: messages,
        status: "warning",
        action: {
          label: "Done",
          onClick: () => {},
        },
      }
    );
    return;
  }

  errors.value = null;
  const sendData = makeFormDataFromObject(outputVoucher.value);
  const files = filesDataInput.value;
  for (let i = 0; i < files.length; i++) {
    sendData.append("FilesDocument[]", files[i]);
  }
  sendData.append(
    "employeeRequestId",
    outputVoucher.value.Employee.id.toString()
  );
  outputVoucherStore
    .store(sendData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Your item has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        useInputVoucherStore().getAvailableItemsVSelect();
        filesDataInput.value = [];
        router.go(-1);
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = outputVoucherStore.getError(error);
      Swal.fire({
        icon: "error",
        title: "create new data fails!!!",
        text: error.response.data.message,
        footer: "",
      });
    });
};
function update() {
  validationResult.value = validate(outputVoucher.value, rules);

  if (!validationResult.value.success) {
    let messages = validationResult.value.errors[0].messages.join("، ");
    showToast(
      t("FailedValidation") +
        " : " +
        validationResult.value.errors[0].fieldName,
      {
        description: messages,
        status: "warning",
        action: {
          label: "Done",
          onClick: () => {},
        },
      }
    );
    return;
    return;
  }
  errors.value = null;
  const sendData = makeFormDataFromObject(outputVoucher.value);
  const files = filesDataInput.value;
  for (let i = 0; i < files.length; i++) {
    sendData.append("FilesDocument[]", files[i]);
  }
  sendData.append(
    "employeeRequestId",
    outputVoucher.value.Employee.id.toString()
  );

  outputVoucherStore
    .update(outputVoucher.value.id, sendData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Your Item has been updated",
          showConfirmButton: false,
          timer: 1500,
        });
        filesDataInput.value = [];
        useInputVoucherStore().getAvailableItemsVSelect();
        showData(outputVoucher.value.id);
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = outputVoucherStore.getError(error);
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
        await outputVoucherStore._delete(outputVoucher.value.id).then(() => {
          swalWithBootstrapButtons.fire(
            t("Deleted!"),
            t("Deleted successfully ."),
            "success"
          );
          filesDataInput.value = [];
          router.go(-1);
        });
      }
    });
};
const showData = async (id: number) => {
  Loading.value = true;
  await outputVoucherStore
    .show(id)
    .then((response) => {
      if (response.status == 200) {
        outputVoucher.value.id = response.data.data.id;
        outputVoucher.value.date = response.data.data.date;
        outputVoucher.value.number = response.data.data.number;
        outputVoucher.value.notes = response.data.data.notes;
        outputVoucher.value.Items = response.data.data.Items;
        outputVoucher.value.Employee = response.data.data.Employee;
        outputVoucher.value.numberBill = response.data.data.numberBill;
        outputVoucher.value.dateBill = response.data.data.dateBill;
        outputVoucher.value.FilesDocument = response.data.data.FilesDocument;
        filesDataInput.value = [];
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
        filesDataInput.value = [];
        router.go(-1);
      });
    });
  Loading.value = false;
};
//#endregion
const getItemsVSelect = async (query?: string | undefined) => {
  inputVoucherItemsVSelect.value =
    await useInputVoucherStore().getItemsVSelect2(query);
};
onMounted(async () => {
  Loading.value = true;
  filesDataInput.value = [];
  checkPermissionAccessArray([EnumPermission.ShowOutputVouchers]);
  await outputVoucherStore.getEmployees().then(() => {});
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "OutputVoucher.Add";
    outputVoucher.value.id = 0;
    outputVoucher.value.date = new Date().toISOString().split("T")[0];
  } else {
    outputVoucher.value.id = id.value;
    await showData(id.value);
    namePage.value = "OutputVoucher.Update";
  }
  await useInputVoucherStore().getAvailableItemsVSelect();
  Loading.value = false;
});

const headers = ref<Array<ITableHeader>>([
  { caption: t("ID"), value: "id" },
  { caption: t("Item.Index"), value: "Item" },
  { caption: t("Item.Description"), value: "Description" },
  { caption: t("Count"), value: "count" },
  { caption: t("Price"), value: "Price" },
  { caption: t("Total"), value: "Total" },
  { caption: t("Notes"), value: "notes" },
  { caption: t("Actions"), value: "Actions" },
]);
const checkBillExists = () => {
  if (outputVoucher.value.number === "") {
    WarningToast(t("InputVoucher.NumberRequired"));
    return;
  }
  outputVoucherStore
    .checkBillExists(outputVoucher.value.number, outputVoucher.value.date)
    .then((response) => {
      if (response && response.status === 200) {
        if (response.data.data && response.data.data.length > 0) {
          showToast(t("InputVoucher.BillExists"), {
            description: " هل تريد فتح المستند الاول",
            status: "warning",
            position: "top-center",
            action: {
              label: t("Open"),
              onClick: () => {
                outputVoucher.value.number = "";
                router.push({
                  name: "outputVoucherUpdate",
                  params: { id: response.data.data[0].id },
                });
                showData(response.data.data[0].id);
              },
            },
          });
        }
      }
    })
    .catch((error) => {
      SuccessToast(t("InputVoucher.BillNotExists"));
    });
};

// في نفس الصفحة اللي تستعمل بيها الكومبوننت
const inputVoucherItemsVSelect = ref<IInputVoucherItem[]>([]);

function convertToMoneyFormat(value: number | string) {
  const num = Number(value || 0);
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

/** منع إدخال HTML غير مرغوب */
function escapeHtml(text: string) {
  return String(text ?? "").replace(
    /[&<>"']/g,
    (m) =>
      (
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }) as Record<string, string>
      )[m]
  );
}

/** إبراز المطابقة بـ <mark> (case-insensitive) */
function highlightMatch(text: string, query: string) {
  const safe = escapeHtml(text);
  const q = String(query ?? "").trim();
  if (!q) return safe;
  const pattern = new RegExp(
    `(${q.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")})`,
    "ig"
  );
  return safe.replace(pattern, "<mark>$1</mark>");
}

async function fetchFn(query: string, page = 1) {
  const raw = await useInputVoucherStore().getItemsVSelect3(query, page);
  if (Array.isArray(raw)) return { items: raw, nextPage: null };
  if (raw?.items) return { items: raw.items, nextPage: raw.nextPage ?? null };
  if (raw?.data) return { items: raw.data, nextPage: null };
  return { items: [], nextPage: null };
}
</script>
<template>
  <IPage :HeaderTitle="t(namePage)" :isLoading="Loading">
    <template #HeaderButtons>
      <IButton2
        color="green"
        width="28"
        :variant="EnumButtonType.Outlined"
        pre-icon="view-grid-plus"
        :onClick="reset"
        :text="t('New')"
      />
    </template>
    <IPageContent>
      <IContainer>
        <IForm>
          <IRow col-lg="4" col-md="2" col-sm="1">
            <ICol
              span="1"
              span-md="2"
              span-sm="1"
              class="flex flex-wrap items-center"
            >
              <IInput
                :label="t('OutputVoucher.Number')"
                class="w-[50%]"
                name="Number"
                v-model="outputVoucher.number"
                :type="EnumInputType.Text"
                :FnClick="checkBillExists"
                FunIcon="search"
                FnTooltip="بحث عن رقم المستند وتاريخه داخل النظام"
              />
              <IInput
                :label="t('Date')"
                class="w-[50%]"
                name="OutputVoucherDate"
                v-model="outputVoucher.date"
                :type="EnumInputType.Date"
              />
            </ICol>
            <ICol span="1" span-md="2" span-sm="1" class="flex flex-row">
              <IInput
                class="w-[50%]"
                :label="t('InputVoucher.NumberBill')"
                name="OutputVoucher.NumberBill"
                v-model="outputVoucher.numberBill"
                :type="EnumInputType.Text"
              />
              <IInput
                class="w-[50%]"
                :label="t('OutputVoucher.DateBill')"
                name="OutputVoucherNumber"
                v-model="outputVoucher.dateBill"
                :type="EnumInputType.Date"
              />
            </ICol>
            <ICol span="2" span-md="2" span-sm="2" class="flex flex-row">
              <div class="w-[100%]">
                <div
                  class="md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
                >
                  {{ t("EmployeeRequest") }}
                </div>
                <vSelect
                  class="w-full outline-none focus:border-gray-800 h-10 mt-1 px-3 py-1 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                  v-model="outputVoucher.Employee"
                  :options="outputVoucherEmployees"
                  :reduce="(employee: IEmployee) => employee"
                  label="name"
                  :getOptionLabel="(employee: IEmployee) => employee.name"
                >
                  <template #option="{ name }">
                    <div>
                      <span>{{ name }}</span>
                    </div>
                  </template>
                </vSelect>
              </div>
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <IInput
                :label="t('Notes')"
                name="InputVoucherNumber"
                v-model="outputVoucher.notes"
                :type="EnumInputType.Text"
              />
            </ICol>
          </IRow>

          <IRow>
            <ICol span="2" span-md="2" span-sm="2">
              <IButton2
                :text="t('Item.Choose')"
                color="blue"
                :variant="EnumButtonType.Outlined"
                post-icon="plus"
                :on-click="AddPopup"
                class="w-fit"
              />
            </ICol>
          </IRow>
          <IRow>
            <ICol>
              <ITable
                :items="outputVoucher.Items"
                :headers="headers"
                :showRowNumber="true"
                :showColumnsButton="false"
              >
                <template v-slot:Item="{ row }">
                  {{ row.InputVoucherItem.Item.name }}
                </template>
                <template v-slot:Description="{ row }">
                  {{ row.InputVoucherItem.description }}
                </template>
                <template v-slot:Total="{ row }">
                  {{ ConvertToMoneyFormat(row.count * row.price) }}
                </template>
                <template v-slot:Price="{ row }">
                  {{ ConvertToMoneyFormat(row.price) }}
                </template>
                <template v-slot:Actions="{ row }">
                  <div class="flex flex-row items-center justify-center gap-2">
                    <button
                      type="button"
                      @click="
                        updatePopup(outputVoucher.Items.indexOf(row), row)
                      "
                      class="bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-1.5a2.5 2.5 0 113.536 3.536L7.5 21H3v-4.5L16.732 6.768z"
                        />
                      </svg>
                      {{ t("Edit") }}
                    </button>
                    <button
                      type="button"
                      @click="deleteItem(outputVoucher.Items.indexOf(row))"
                      class="bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      {{ t("Delete") }}
                    </button>
                  </div>
                </template>
              </ITable>
            </ICol>
          </IRow>
          <!-- file -->
          <IRow :collapse="true" :OpenCollapse="false" :title="t('files')">
            <ICol
              span="3"
              span-md="3"
              span-sm="2"
              v-for="document in outputVoucher.FilesDocument"
              :key="document.name"
            >
              <FilePreview :file="document" @updateList="updateList">
              </FilePreview>
            </ICol>
            <DragDrop></DragDrop>
          </IRow>

          <IRow>
            <ICol>
              <IErrorMessages :validationResult="validationResult" />
            </ICol>
          </IRow>
        </IForm>
      </IContainer>
    </IPageContent>
    <IContainer class="w-full">
      <van-popup
        class="overflow-hidden dark:bg-darkNav"
        v-model:show="showPop"
        round
        position="bottom"
      >
        <!-- for search Item -->
        <IFlex class="p-2">
          <IBasis base="2/4">
            <label class="px-2">{{ t("Item.Choose") }}</label>
            <SearchableTableItemsOutputVoucher
              v-model="OutputVoucherItem.InputVoucherItem"
              label-key="Item.name"
              track-by="fingerprint"
              :placeholder="t('Item.Choose')"
              :async="true"
              :fetch-function="fetchFn"
              :dialog-z-index="2147483647"
            >
              <template #item="{ option, isHighlighted, query }">
                <div
                  class="result-card"
                  :class="{ 'result-card--active': isHighlighted }"
                >
                  <div class="result-card__head">
                    <div class="result-card__title-wrap">
                      <div class="result-card__icon">
                        <svg
                          class="h-6 w-6 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7v10l8 4m0-14L4 7"
                          />
                        </svg>
                      </div>
                      <!-- الاسم مع تظليل -->
                      <h3
                        class="result-card__title"
                        v-html="highlightMatch(option?.Item?.name ?? '', query)"
                      ></h3>
                    </div>

                    <span class="result-card__badge">
                      متاح: {{ ConvertToMoneyFormat(option?.count) }}
                    </span>
                  </div>

                  <div class="result-card__grid">
                    <div class="result-card__label">الكود:</div>
                    <div
                      class="result-card__value"
                      v-html="highlightMatch(option?.Item?.code ?? '', query)"
                    ></div>
                    <div class="result-card__label">التصنيف:</div>
                    <div class="result-card__value">
                      {{ option?.Item?.Category?.name ?? "—" }}
                    </div>
                    <div class="result-card__label">السعر:</div>
                    <div class="result-card__value result-card__value--strong">
                      {{ ConvertToMoneyFormat(option?.price) }}
                    </div>
                  </div>

                  <div
                    v-if="option?.description || option?.notes"
                    class="result-card__footer"
                  >
                    <p v-if="option?.description" class="result-card__desc">
                      {{ option.description }}
                    </p>
                    <p v-if="option?.notes" class="result-card__notes">
                      {{ option.notes }}
                    </p>
                  </div>
                </div>
              </template>

              <template #footer>
                <div class="hint">استخدم ↑ ↓ للتنقّل و Enter للاختيار</div>
              </template>
            </SearchableTableItemsOutputVoucher>
          </IBasis>
          <IBasis
            base="2/4"
            v-if="OutputVoucherItem.InputVoucherItem == null"
            class="border-2 border-dotted border-gray-600"
          >
            <div class="w-full text-center align-middle border-gray-600">
              <div
                class="md:text-sm text-base ml-2 font-bold dark:text-gray-300 mt-auto mb-auto w-full"
              >
                قم بأختيار مادة
              </div>
            </div>
          </IBasis>
          <IBasis
            base="3/4"
            v-else-if="
              OutputVoucherItem.InputVoucherItem.Item?.Category.name != ''
            "
          >
            <IFlex>
              <IBasis base="1/4">
                <ILabel :title="t('Code')">
                  {{ OutputVoucherItem.InputVoucherItem.Item?.code }}</ILabel
                >
              </IBasis>
              <IBasis base="1/4">
                <ILabel :title="t('Category')">
                  {{ OutputVoucherItem.InputVoucherItem.Item?.Category.name }}
                </ILabel>
              </IBasis>
              <IBasis base="1/4">
                <ILabel :title="t('Price')">
                  {{
                    ConvertToMoneyFormat(
                      OutputVoucherItem.InputVoucherItem.price
                    )
                  }}
                </ILabel>
              </IBasis>
              <IBasis base="1/2">
                <ILabel :title="t('Description')">
                  {{ OutputVoucherItem.InputVoucherItem.Item?.description }} -
                  {{ OutputVoucherItem.InputVoucherItem.notes }}</ILabel
                >
              </IBasis>
            </IFlex>
          </IBasis>
          <IBasis
            base="3/4"
            v-else
            class="border-2 border-dotted border-gray-600"
          >
            <div class="w-full text-center align-middle border-gray-600">
              <div
                class="md:text-sm text-base ml-2 font-bold dark:text-gray-300 mt-auto mb-auto w-full"
              >
                قم بأختيار مادة
              </div>
            </div>
          </IBasis>
        </IFlex>

        <!-- for insert item Properties -->
        <div v-if="OutputVoucherItem.InputVoucherItem != null">
          <div class="flex p-2">
            <div class="w-full">
              <ILabel :title="t('Item.Description')">
                {{ OutputVoucherItem.InputVoucherItem.description }}
              </ILabel>
            </div>
            <div class="w-1/4">
              <IInput
                :label="t('Count')"
                :on-input="ChangeValueTotal"
                :type="EnumInputType.Number"
                v-model="OutputVoucherItem.count"
                :max="
                  Number(OutputVoucherItem.InputVoucherItem.countIn) -
                  Number(OutputVoucherItem.InputVoucherItem.countOut) +
                  Number(OutputVoucherItem.InputVoucherItem.countReIn) -
                  Number(OutputVoucherItem.InputVoucherItem.countReOut)
                "
                :auto-correct="false"
                :min="1"
              />
            </div>
            <div class="w-1/4">
              <IInput
                :label="t('Price')"
                :on-input="ChangeValueTotal"
                :type="EnumInputType.Number"
                v-model="OutputVoucherItem.InputVoucherItem.price"
              />
            </div>
            <div class="w-1/4">
              <ILabel :title="t('Total')">
                {{ ConvertToMoneyFormat(OutputVoucherItem.value) }}
              </ILabel>
            </div>
          </div>
          <IRow>
            <ICol>
              <IInput
                :label="t('Note')"
                :type="EnumInputType.Text"
                v-model="OutputVoucherItem.notes"
              />
            </ICol>
          </IRow>
        </div>

        <!-- buttons -->
        <IContainer class="flex flex-row my-10">
          <IButton2
            :text="t('Add')"
            color="blue"
            :variant="EnumButtonType.Default"
            :on-click="AddItem"
            v-if="IsAdd"
          />
          <IButton2
            :text="t('Update')"
            color="blue"
            :variant="EnumButtonType.Default"
            :on-click="EditItem"
            v-else
          />
          <IButton2
            class=""
            pre-icon="close-box"
            :text="t('Close')"
            color="blue"
            :variant="EnumButtonType.Text"
            :on-click="() => (showPop = false)"
          />
        </IContainer>
      </van-popup>
    </IContainer>
    <template #Footer>
      <IFooterCrud
        :isAdd="outputVoucher.id == 0"
        :onCreate="store"
        :onUpdate="update"
        :onDelete="Delete"
      />
    </template>
  </IPage>
</template>
<style scoped>
/* بطاقة النتيجة */
.result-card {
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--tw-ring-offset-shadow, rgba(229, 231, 235, 0.9));
  padding: 12px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  transition:
    box-shadow 0.2s ease,
    transform 0.12s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}
.result-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

/* حالة السطر المحدّد من الكيبورد */
.result-card--active {
  border-color: rgba(99, 40, 241, 0.55); /* indigo */
  box-shadow:
    0 0 0 3px rgba(99, 102, 241, 0.18),
    /* outer ring */ 0 10px 28px rgba(0, 0, 0, 0.08);
  background: linear-gradient(
    135deg,
    #eef2ff 0%,
    #f5f7ff 100%
  ); /* خلفية لطيفة */
  transform: translateY(-1px);
}

/* الهيدر */
.result-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 10px;
}
.result-card__title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.result-card__icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #e5e7eb;
}
.result-card__title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.result-card__badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #d1fae5;
  color: #065f46;
}

/* شبكة التفاصيل */
.result-card__grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.35rem 1rem;
  font-size: 0.9rem;
}
.result-card__label {
  color: #6b7280;
  font-weight: 500;
}
.result-card__value {
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.result-card__value--strong {
  color: #1f2937;
  font-weight: 700;
}

/* تذييل */
.result-card__footer {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(229, 231, 235, 0.7);
}
.result-card__desc {
  font-size: 0.9rem;
  color: #4b5563;
}
.result-card__notes {
  white-space: pre-wrap;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 8px;
  font-size: 0.78rem;
  color: #6b7280;
  font-style: italic;
}

/* تمييز الكلمة المطابقة */
mark {
  background: #ffec99;
  border-radius: 4px;
  padding: 0 2px;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.08);
}

/* تلميح الفوتر */
.hint {
  padding: 8px;
  text-align: center;
  font-size: 0.78rem;
  color: #6b7280;
}
</style>
