<script setup lang="ts">
//#region imports
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { useStockStore } from "../../settingVoucher/stock/stockStore";
import { useInputVoucherStateStore } from "../../settingVoucher/inputVoucherState/inputVoucherStateStore";
import { useInputVoucherStore } from "@/project/warehouse/inputVoucher/inputVoucherStore";
import { useItemStore } from "@/project/item/itemStore";
import type { IInputVoucherItem } from "../IInputVoucher";
import { t } from "@/utilities/I18nPlugin";
import type { IItem } from "@/project/item/IItem";
import AddItemPopup from "@/project/item/view/AddItemPopup.vue";
import { EnumPermission } from "@/utilities/EnumSystem";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";
import type { ITableHeader } from "@/types/core/components/ITable";
import ICol from "@/components/ihec/ICol.vue";
import IRow from "@/components/ihec/IRow.vue";
import ILabel from "@/components/ihec/ILabel.vue";
import IInput from "@/components/inputs/IInput.vue";
import IButton from "@/components/ihec/IButton2.vue";
import IContainer from "@/components/ihec/IContainer.vue";
import IPageContent from "@/components/ihec/IPageContent.vue";
import IPage from "@/components/ihec/IPage.vue";
// import { QuillEditor } from "@vueup/vue-quill";
// import "@vueup/vue-quill/dist/vue-quill.snow.css";
// // Define the editor options with RTL direction
// const editorOptions = ref({
//   theme: "snow",
//   modules: {
//     toolbar: [
//       // Add your toolbar options here
//     ],
//   },
//   placeholder: "اكتب شيئًا...",
//   direction: "rtl", // Set the direction to RTL
// });
// //#endregion
//#region Drag & Drop
import { useDragDropStore } from "@/project/archive/dragDrop";
const { filesDataInput } = storeToRefs(useDragDropStore());
const updateList = () => {
  if (id.value > 0) showData(id.value);
};
//#region store
const { stocks } = storeToRefs(useStockStore());
const { items } = storeToRefs(useItemStore());
const { item } = storeToRefs(useItemStore());
const { inputVoucherStates } = storeToRefs(useInputVoucherStateStore());
import {
  ConvertToMoneyFormat,
  makeFormDataFromObject,
  ToNumberShow,
} from "@/utilities/tools";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";
import IButton2 from "@/components/ihec/IButton2.vue";
//#endregion
//#region Validation
import {
  useValidation,
  type IValidationResult,
  type IFieldValidation,
} from "@/utilities/Validation";
import { WarningToast } from "@/utilities/Toast2";
import IErrorMessages from "@/components/ihec/IErrorMessages.vue";
import ISelect from "@/components/inputs/ISelect.vue";
import FilePreview from "@/project/archive/view/FilePreview.vue";
import DragDrop from "@/project/archive/view/DragDrop.vue";
import { title } from "process";

const { validate, isArray, required, isObject } = useValidation();

let validationResult = ref<IValidationResult>({ success: true, errors: [] });

const rules: Array<IFieldValidation> = [
  { field: "number", caption: t("InputVoucher.Number"), rules: [required()] },
  // {
  //   field: "Employee",
  //   caption: t("OutputVoucherEmployeeRequest"),
  //   rules: [isObject({ key: "id", message: "" })],
  // },
  {
    field: "Stock",
    caption: t("Stock"),
    rules: [isObject({ key: "id", message: "" })],
  },
  { field: "Items", caption: t("Item.Sum"), rules: [isArray()] },
];
//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionsStore();
const namePage = ref("InputVoucher.Index");
const route = useRoute();
const id = ref(Number(route.params.id));

const inputVoucherStore = useInputVoucherStore();
const { inputVoucher } = storeToRefs(useInputVoucherStore());
//#region popUp
const showPop = ref(false);
const IsAdd = ref(false);
const VoucherItemTemp = ref<IInputVoucherItem>({
  id: 0,
  inputVoucherId: 0,
  Item: {
    name: "",
    id: 0,
    code: "",
    description: "",
    Category: { id: 0, name: "" ,description:"" },
    measuringUnit: "",
  },
  description: "",
  count: 1,
  price: 1,
  value: 1,
  notes: "",
});
const AddPopup = () => {
  showPop.value = true;
  resetVoucherItemTemp();
};
const resetVoucherItemTemp = () => {
  IsAdd.value = true;
  indexSelectedVoucherItem.value = 0;
  VoucherItemTemp.value = {
    id: 0,
    inputVoucherId: 0,
    Item: {
      name: "",
      id: 0,
      code: "",
      description: "",
      Category: { id: 1, name: "" ,description:"" },
      measuringUnit: "",
    },
    description: "",
    count: 1,
    price: 1,
    value: 1,
    notes: "",
  };
};
//#region Item Row
const deleteItem = (index: number) => {
  if(inputVoucher.value.Items.length <= 1) {
    WarningToast(t("InputVoucher.ItemRequired"));
    return;
  }
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
        await inputVoucherStore.removeItem(index);
      }
    })
};
const updatePopup = (index: number, item: IInputVoucherItem) => {
  VoucherItemTemp.value = item;
  if (VoucherItemTemp.value.Item.name == "") return false;
  IsAdd.value = false;
  showPop.value = true;
  indexSelectedVoucherItem.value = index;
};
const AddItem = () => {
  if (VoucherItemTemp.value.Item.name == "") return false;
  VoucherItemTemp.value.value =
    Number(VoucherItemTemp.value.count) * Number(VoucherItemTemp.value.price);
  inputVoucherStore.addItem(VoucherItemTemp.value);
  resetVoucherItemTemp();
  showPop.value = false;
};
const ChangeValueTotal = () => {
  VoucherItemTemp.value.value =
    Number(VoucherItemTemp.value.count) * Number(VoucherItemTemp.value.price);
};
const indexSelectedVoucherItem = ref(0);

const EditItem = () => {
  VoucherItemTemp.value.value =
    Number(VoucherItemTemp.value.count) * Number(VoucherItemTemp.value.price);
  inputVoucherStore.editItem(
    indexSelectedVoucherItem.value,
    VoucherItemTemp.value
  );
  resetVoucherItemTemp();
  showPop.value = false;
};
//#endregion

const Loading = ref(false);
const router = useRouter();
const errors = ref<string | null>();

//#region CURD
const reset = () => {
  inputVoucherStore.resetData();
};
const store = () => {
  validationResult.value = validate(inputVoucher.value, rules);

  if (!validationResult.value.success) {
    WarningToast(t("ValidationFails"));
    return;
  }
  errors.value = null;
  const sendData = makeFormDataFromObject(inputVoucher.value);
  const files = filesDataInput.value;
  for (let i = 0; i < files.length; i++) {
    sendData.append("FilesDocument[]", files[i]);
  }
  inputVoucherStore
    .store(sendData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: t("ToastMessages.Success"),
          showConfirmButton: false,
          timer: 1500,
        });
        filesDataInput.value = [];
        router.go(-1);
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = inputVoucherStore.getError(error);
      Swal.fire({
        icon: "error",
        title: t("ToastMessages.Error"),
        text: error.response.data.message,
        footer: "",
      });
    });
};
function update() {
  validationResult.value = validate(inputVoucher.value, rules);

  if (!validationResult.value.success) {
    WarningToast(t("ValidationFails"));
    return;
  }
  errors.value = null;
  const sendData = makeFormDataFromObject(inputVoucher.value);
  const files = filesDataInput.value;
  for (let i = 0; i < files.length; i++) {
    sendData.append("FilesDocument[]", files[i]);
  }
  inputVoucherStore
    .update(inputVoucher.value.id, sendData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: t("ToastMessages.Success"),
          showConfirmButton: false,
          timer: 1500,
        });
        filesDataInput.value = [];
        showData(inputVoucher.value.id);
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = inputVoucherStore.getError(error);
      Swal.fire({
        icon: "error",
        title: t("ToastMessages.Error"),
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
        await inputVoucherStore._delete(inputVoucher.value.id).then(() => {
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
const showData = async (id: number) => {
  Loading.value = true;
  await inputVoucherStore
    .show(id)
    .then((response) => {
      if (response.status == 200) {
        inputVoucher.value.id = response.data.data.id;
        inputVoucher.value.date = response.data.data.date;
        inputVoucher.value.number = response.data.data.number;
        inputVoucher.value.notes = response.data.data.notes;
        inputVoucher.value.Items = response.data.data.Items;
        inputVoucher.value.requestedBy = response.data.data.requestedBy;
        inputVoucher.value.numberBill = response.data.data.numberBill;
        inputVoucher.value.State = response.data.data.State;
        inputVoucher.value.Stock = response.data.data.Stock;
        inputVoucher.value.FilesDocument = response.data.data.FilesDocument;
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
  router.back();
};

onMounted(async () => {
  Loading.value = true;
  filesDataInput.value = [];

  checkPermissionAccessArray([EnumPermission.ShowInputVouchers]);
  await useInputVoucherStateStore().get_inputVoucherStates();
  //await inputVoucherStore.getEmployees();
  if (Number.isNaN(id.value) || id.value === undefined) {
    inputVoucher.value.id = 0;
  } else {
    inputVoucher.value.id = id.value;
    await showData(id.value);
    namePage.value = "InputVoucher.Update";
  }
  await useStockStore().get_stocks();
  await refreshItems();
  Loading.value = false;
});
const refreshItems = async () => {
  Loading.value = true;
  await useItemStore().get_items();
  Loading.value = false;
};

const addItemPopupRef = ref<InstanceType<typeof AddItemPopup>>();

const handleEnter = (event: KeyboardEvent) => {
  const enteredValue = (event.target as HTMLInputElement).value;
  const matchingOption = items.value.find(
    (option: IItem) => option.name === enteredValue
  );
  if (matchingOption === undefined && enteredValue.length > 0) {
    IsAddItem.value = true;
    //let btn = document.getElementById("my_modal_7");
    item.value.name = enteredValue;
    item.value.code = "";
    item.value.description = "";
    item.value.measuringUnit = "";
    item.value.Category.id = 0;

    makeInputPopFocus();
  }
};
const makeInputPopFocus = () => {
  if (addItemPopupRef.value) {
    addItemPopupRef.value.focus();
  }
};
function clearSelected(event: { target: { value: string } }) {
  console.log(event.target.value);
  if (event.target.value === "") {
    VoucherItemTemp.value = {
      id: 0,
      inputVoucherId: 0,
      Item: {
        name: "",
        id: 0,
        code: "",
        description: "",
        Category: { id: 0, name: "" ,description:"" },
        measuringUnit: "",
      },
      description: "",
      count: 0,
      price: 0,
      value: 0,
      notes: "",
    };
  }
}
const IsAddItem = ref(false);

const setItemFromChild = (_item: IItem) => {
  //console.log(_item);
  // _item.code = "";
  // _item.description = "";
  // _item.measuringUnit = "";
  VoucherItemTemp.value.Item = _item;
};
const headers = ref<Array<ITableHeader>>([
  { caption: t("ID"), value: "id" },
  { caption: t("Item.Name"), value: "Item" },
  { caption: t("Item.Description"), value: "description" },
  { caption: t("Count"), value: "count" },
  { caption: t("Price"), value: "Price" },
  { caption: t("Total"), value: "Total" },
  { caption: t("Notes"), value: "notes" },
  { caption: t("Details"), value: "Actions" },
]);
</script>

<template>
  <IPage :HeaderTitle="t(namePage)" :isLoading="Loading">
    <template #HeaderButtons>
      <IButton2 color="green" width="28" :type="EnumButtonType.Outlined" pre-icon="view-grid-plus" :onClick="reset"
        :text="t('New')" />
    </template>
    <IPageContent>
      <IContainer>
        <IForm>
          <IRow col-lg="4" col-md="2" col-sm="1">
            <ICol span="1" span-md="2" span-sm="1" class="flex flex-row">
              <IInput class="w-[50%]" :label="t('InputVoucher.Number')" name="InputVoucher.Number"
                v-model="inputVoucher.number" :type="EnumInputType.Text" />
              <IInput class="w-[50%]" :label="t('Date')" name="InputVoucher.Date" v-model="inputVoucher.date"
                :type="EnumInputType.Date" />
            </ICol>
            <ICol span="1" span-md="2" span-sm="1" class="flex flex-row">
              <IInput class="w-[50%]" :label="t('InputVoucher.NumberBill')" name="InputVoucher.NumberBill"
                v-model="inputVoucher.numberBill" :type="EnumInputType.Text" />
              <IInput :disabled="inputVoucher.numberBill == ''" class="w-[50%]" :label="t('InputVoucher.DateBill')"
                name="InputVoucherNumber" v-model="inputVoucher.dateBill" :type="EnumInputType.Date" />
            </ICol>
            <ICol :span="1" span-lg="1" span-xl="1" span-md="1" class="flex flex-row w-full">
              <ISelect class="w-[50%] sm:w-full" :label="t('Stock')" v-model="inputVoucher.Stock.id"
                name="inputVoucherStockId" :options="stocks" :IsRequire="true">
              </ISelect>
              <ISelect class="w-[50%] sm:w-full" :label="t('InputVoucher.State')" v-model="inputVoucher.State.id"
                name="inputVoucherStateId" :options="inputVoucherStates" :IsRequire="true" />
            </ICol>
            <ICol class="w-full">
              <IInput :label="t('Notes')" name="Notes" v-model="inputVoucher.notes" :type="EnumInputType.Text" />
            </ICol>
          </IRow>
          <IRow>
            <ICol>
              <IButton2 :text="t('Item.Choose')" class="w-[150px]" color="blue" post-icon="add"
                :type="EnumButtonType.Outlined" @click="AddPopup()" />
            </ICol>
          </IRow>
          <IRow>
            <ICol>
              <ITable :items="inputVoucher.Items" :headers="headers" titleNoData="NoItems" :showColumnsButton="false">
                <template v-slot:Item="{ row }">
                  {{ row.Item.name }}
                </template>
                <template v-slot:Total="{ row }">
                  {{ ConvertToMoneyFormat(row.count * row.price) }}
                </template>
                <template v-slot:Price="{ row }">
                  {{ ConvertToMoneyFormat(row.price) }}
                </template>
                <template v-slot:Actions="{ row }">
                  <div class="flex flex-row items-center justify-center gap-2">
                    <button type="button" @click="updatePopup(inputVoucher.Items.indexOf(row), row)" class=" bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700
                    dark:text-green-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200
                    hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2
                    focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-1.5a2.5 2.5 0 113.536 3.536L7.5 21H3v-4.5L16.732 6.768z" />
                      </svg>
                      {{ t("Edit") }}
                    </button>
                    <button type="button" @click="deleteItem(inputVoucher.Items.indexOf(row))" class="bg-red-100 hover:bg-red-200 dark:bg-red-900
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
        </IForm>
        <!-- file -->
        <IRow col-lg="4" col-md="4" col-sm="2" :title="t('files')">
          <ICol span="3" span-md="3" span-sm="2" v-for="document in inputVoucher.FilesDocument" :key="document.name">
            <FilePreview :file="document" @updateList="updateList">
            </FilePreview>
          </ICol>
        </IRow>
        <DragDrop></DragDrop>
        <IRow>
          <ICol>
            <IErrorMessages :validationResult="validationResult" />
          </ICol>
        </IRow>
      </IContainer>
    </IPageContent>
    <IContainer>
      <van-popup class="p-2 overflow-hidden dark:bg-darkNav" v-model:show="showPop" round position="bottom">
        <!-- for search Item -->
        <IRow>
          <AddItemPopup @setItem="setItemFromChild" v-model="IsAddItem" ref="addItemPopupRef"></AddItemPopup>
        </IRow>
        <IRow col-lg="2" col-md="1" col-sm="1" col-xs="1">
          <ICol>
            <div class="mb-1 md:text-md text-base ml-2 font-bold dark:text-gray-300">
              {{ t("Item.Choose") }}
            </div>
            <div class="flex flex-row w-full">
              <vSelect
                class="capitalize w-full rounded-md border-2 p-2 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:border focus:border-gray-700 text-gray-800 mb-10"
                v-model="VoucherItemTemp.Item" :options="items" :reduce="(_item: IItem) => _item"
                :get-option-label="(_item: IItem) => _item.name" @keydown.enter="handleEnter" :create-option="(_item: IItem) => ({
                  input_voucher_id: 0,
                  Item: {
                    name: '',
                    id: 0,
                    code: 0,
                    description: 0,
                    Category: { id: 0, name: '' },
                    measuringUnit: '',
                  },
                  description: '',
                  count: 0,
                  price: 0,
                  value: 0,
                  notes: '',
                })
                  ">
                <template #option="{ code, Category, description, name }">
                  <div class="rtl:text-right border-2 p-2 rounded-md">
                    <div
                      class="rounded-md focus:outline-none focus:border focus:border-gray-700 dark:bg-gray-800 dark:text-gray-100 p-1 mb-1 font-bold">
                      {{ name }}
                    </div>
                    <cite>
                      <div
                        class="rounded-md focus:outline-none focus:border focus:border-gray-400 bg-gray-500 text-gray-200 p-1 mb-1">
                        {{ t("Code") }}: {{ code }}
                      </div>
                      <div
                        class="rounded-md focus:outline-none focus:border focus:border-gray-400 bg-gray-500 text-gray-200 p-1 mb-1">
                        {{ t("Category") }}: {{ Category.name }}
                      </div>
                    </cite>
                    <br />
                    <cite>
                      {{ description }}
                    </cite>
                  </div>
                </template>
              </vSelect>
              <IButton class="h-full" :text="t('Refresh')" :onClick="refreshItems" post-icon="refresh" color="green"
                :type="EnumButtonType.Outlined" />
              <IButton v-if="!IsAddItem" class="h-full" :text="t('Add')" :onClick="() => {
                IsAddItem = !IsAddItem;
                makeInputPopFocus();
              }
                " post-icon="add" color="blue" :type="EnumButtonType.Outlined" />
            </div>
          </ICol>

          <ICol span="3" span-xl="3" span-lg="3" span-md="1" span-sm="1" span-xs="1" v-if="VoucherItemTemp.Item == null"
            class="border-2 border-dotted border-gray-600">
            <div class="w-full text-center align-middle border-gray-600">
              <div class="md:text-sm text-base ml-2 font-bold dark:text-gray-300 mt-auto mb-auto w-full">
                قم بأختيار مادة
              </div>
            </div>
          </ICol>
          <ICol :span="3" span-xl="3" span-lg="3" span-md="1" span-sm="1" span-xs="1"
            v-else-if="VoucherItemTemp.Item.name != ''"
            class="relative border-2 pb-2 rounded-md border-dotted border-gray-500 overflow-hidden  ">
            <!-- Watermark background text -->
            <div class="absolute inset-0 flex flex-col justify-center items-center pointer-events-none select-none"
              style="z-index:0;">
              <span class="text-6xl font-bold text-gray-300 dark:text-gray-500 opacity-20"
                style="transform: rotate(-10deg); white-space:nowrap; letter-spacing:0.2em;">
                {{ t('Item.Properties') }} {{ t('Item.Properties') }}
              </span>
              <span class="text-6xl font-bold text-gray-300 dark:text-gray-500  opacity-20 mt-10"
                style="transform: rotate(-10deg); white-space:nowrap; letter-spacing:0.2em;">
                {{ t('Item.Properties') }} {{ t('Item.Properties') }}
              </span>
            </div>
            <!-- Foreground content -->
            <div
              class="hover:text-gray-300 dark:hover:text-gray-700 duration-300 text-lg font-bold header-title text-blue-700 dark:text-blue-300 py-2 w-full basis-full px-2 bg-gray-200 dark:bg-gray-800">
              {{ t('Item.Properties') }}
            </div>
            <div class="w-full flex flex-row items-center justify-center text-center">
              <div class="md:text-sm text-base ml-2 font-bold dark:text-gray-300 mt-auto mb-auto w-[25%]">
                <ILabel :title="t('Code')">
                  {{ VoucherItemTemp.Item.code }}
                </ILabel>
              </div>
              <div class="md:text-sm text-base ml-2 font-bold dark:text-gray-300 mt-auto mb-auto w-[25%]">
                <ILabel :title="t('Category')">
                  {{ VoucherItemTemp.Item.Category.name }}
                </ILabel>
              </div>
              <div class="md:text-sm text-base ml-2 font-bold dark:text-gray-300 mt-auto mb-auto w-full">
                <ILabel :title="t('Description')">
                  {{ VoucherItemTemp.Item.description }}
                </ILabel>
              </div>
            </div>
          </ICol>
          <ICol span="3" span-xl="3" span-lg="3" span-md="1" span-sm="1" span-xs="1" v-else
            class="border-2 border-dotted border-gray-600">
            <div class="w-full text-center align-middle border-gray-600">
              <div class="md:text-sm text-base ml-2 font-bold dark:text-gray-300 mt-auto mb-auto w-full">
                قم بأختيار مادة
              </div>
            </div>
          </ICol>
        </IRow>
        <!-- for insert item proparties -->
        <IRow col-lg="4" :col="4" col-xl="4" col-md="2" col-sm="1" col-xs="1">
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <IInput :label="t('Item.Description')" v-model="VoucherItemTemp.description" />
          </ICol>
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <IInput :label="t('Count')" :on-input="ChangeValueTotal" :type="EnumInputType.Number"
              v-model="VoucherItemTemp.count" :min="1" />
          </ICol>
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <IInput :label="t('Price')" :on-input="ChangeValueTotal" :type="EnumInputType.Number"
              v-model="VoucherItemTemp.price" :min="1" />
          </ICol>
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <ILabel :title="t('Total')">{{
              ConvertToMoneyFormat(VoucherItemTemp.value)
            }}</ILabel>
          </ICol>
          <ICol :span="4" span-lg="4" span-xl="1" span-md="1">
            <IInput :label="t('Notes')" :type="EnumInputType.Text" v-model="VoucherItemTemp.notes" />
          </ICol>
        </IRow>
        <!-- buttons -->
        <IContainer class="flex flex-row my-10">
          <IButton :text="t('Add')" color="blue" :type="EnumButtonType.Default" :on-click="AddItem" v-if="IsAdd" />
          <IButton :text="t('Update')" color="blue" :type="EnumButtonType.Default" :on-click="EditItem" v-else />
          <IButton class="" pre-icon="close-box" :text="t('Close')" color="blue" :type="EnumButtonType.Text"
            :on-click="() => (showPop = false)" />
        </IContainer>
      </van-popup>
    </IContainer>
    <template #Footer>
      <IFooterCrud :isAdd="inputVoucher.id == 0" :onCreate="store" :onUpdate="update" :onDelete="Delete" />
    </template>
  </IPage>
</template>
<style>
/* Optional: Add custom styles for RTL */
.ql-editor {
  text-align: right;
}
</style>