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
    itemX.InputVoucherItem.id
  );
};
const AddItem = () => {
  OutputVoucherItem.value.Item = OutputVoucherItem.value.InputVoucherItem?.Item;
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
  (Number(OutputVoucherItem.value.count)|| 0) *
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
const inputVoucherItemsVSelect = ref<IInputVoucherItem[]>([]);
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
</script>
<template>
  <IPage :HeaderTitle="t(namePage)" :isLoading="Loading">
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
                :type="EnumButtonType.Outlined"
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
                :show-columns-button="false"
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
                    <button type="button" @click="updatePopup(outputVoucher.Items.indexOf(row), row)" class=" bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700
                    dark:text-green-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200
                    hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2
                    focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-1.5a2.5 2.5 0 113.536 3.536L7.5 21H3v-4.5L16.732 6.768z" />
                      </svg>
                      {{ t("Edit") }}
                    </button>
                    <button type="button" @click="deleteItem(outputVoucher.Items.indexOf(row))" class="bg-red-100 hover:bg-red-200 dark:bg-red-900
                      dark:hover:bg-red-800 text-red-700 dark:text-red-200 px-4 py-2 rounded-lg flex items-center
                      gap-2 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5
                      focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
                      dark:focus:ring-offset-gray-800">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
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
            </IRow
          >
          
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
          <IBasis base="1/4">
            <div
              class="mb-1 md:text-sm text-base ml-2 font-bold dark:text-gray-300"
            >
              {{ t("Item.Name") }}
            </div> 
            <ISelect2
              v-model="OutputVoucherItem.InputVoucherItem"
              :options="inputVoucherItemsVSelect"
              label-key="Item.name"
              track-by="fingerprint"
              :placeholder="t('Item.Choose')"

              :async="true"
              :fetch-function="useInputVoucherStore().getItemsVSelect2"
            >
              <template #item="{ option }">
                <div
                  class="w-full rounded-xl border p-4 transition-shadow duration-300 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 border-gray-200 dark:border-gray-700 hover:shadow-xl"
                >
                  <div class="mb-4 flex items-start justify-between">
                    <div class="flex items-center gap-x-3">
                      <div
                        class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700"
                      >
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
                      <h3
                        class="text-lg font-bold text-gray-900 dark:text-white"
                      >
                        {{ option.Item.name }}
                      </h3>
                    </div>
                    <span
                      class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-200"
                    >
                      {{ t("Available") }}:
                      {{ ConvertToMoneyFormat(option.count) }}
                    </span>
                  </div>

                  <div
                    class="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1.5 text-sm"
                  >
                    <div class="font-medium text-gray-500 dark:text-gray-400">
                      {{ t("Code") }}:
                    </div>
                    <div class="font-mono text-gray-700 dark:text-gray-300">
                      {{ option.Item.code }}
                    </div>

                    <div class="font-medium text-gray-500 dark:text-gray-400">
                      {{ t("Category") }}:
                    </div>
                    <div class="text-gray-700 dark:text-gray-300">
                      {{ option.Item.Category.name }}
                    </div>

                    <div class="font-medium text-gray-500 dark:text-gray-400">
                      {{ t("Price") }}:
                    </div>
                    <div class="font-semibold text-gray-800 dark:text-gray-200">
                      {{ ConvertToMoneyFormat(option.price) }}
                    </div>
                  </div>

                  <div
                    v-if="option.description || option.notes"
                    class="mt-4 space-y-3 border-t border-gray-200/80 pt-3 dark:border-gray-700/60"
                  >
                    <p
                      v-if="option.description"
                      class="text-sm text-gray-600 dark:text-gray-400"
                    >
                      {{ option.description }}
                    </p>
                    <p
                      v-if="option.notes"
                      class="whitespace-pre-wrap rounded-md bg-gray-100 p-2 text-xs italic text-gray-500 dark:bg-gray-900/50 dark:text-gray-500"
                    >
                      {{ option.notes }}
                    </p>
                  </div>
                </div>
              </template>
            </ISelect2>
          </IBasis>
          <IBasis
            base="3/4"
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

        <!-- for insert item proparties -->
        <div class="flex p-2" v-if="OutputVoucherItem.InputVoucherItem != null">
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
        <!-- buttons -->
        <IContainer class="flex flex-row my-10">
          <IButton2
            :text="t('Add')"
            color="blue"
            :type="EnumButtonType.Default"
            :on-click="AddItem"
            v-if="IsAdd"
          />
          <IButton2
            :text="t('Update')"
            color="blue"
            :type="EnumButtonType.Default"
            :on-click="EditItem"
            v-else
          />
          <IButton2
            class=""
            pre-icon="close-box"
            :text="t('Close')"
            color="blue"
            :type="EnumButtonType.Text"
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