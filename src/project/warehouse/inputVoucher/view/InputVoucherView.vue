<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionStore } from "@/project/user/permissionStore";
import { useStockStore } from "../../stockStore";
import { useInputVoucherStore } from "@/project/warehouse/inputVoucher/inputVoucherStore";
import { useItemStore } from "@/project/item/itemStore";
import type { IInputVoucherItem } from "../IInputVoucher";
import { t } from "@/utilities/I18nPlugin";
import type { IItem } from "@/project/item/IItem";
import AddItemPopup from "@/project/item/view/AddItemPopup.vue";
import { EnumPermission } from "@/utilities/EnumSystem";
import type { ITableHeader } from "@/types/core/components/ITable";
import ICol from "@/components/ihec/ICol.vue";
import IRow from "@/components/ihec/IRow.vue";
import ILabel from "@/components/ihec/ILabel.vue";
import IInput from "@/components/inputs/IInput.vue";
import IButton from "@/components/ihec/IButton2.vue";
import IContainer from "@/components/ihec/IContainer.vue";
import IPageContent from "@/components/ihec/IPageContent.vue";
import IPage from "@/components/ihec/IPage.vue";

const { stocks } = storeToRefs(useStockStore());
const { items } = storeToRefs(useItemStore());
const { item } = storeToRefs(useItemStore());
//region"Validation"
import {
  useValidation,
  type IValidationResult,
  type IFieldValidation,
} from "@/utilities/Validation";
import { WarningToast } from "@/utilities/Toast";
import IErrorMessages from "@/components/ihec/IErrorMessages.vue";
import { makeFormDataFromObject } from "@/utilities/tools";
 
const { validate, isArray, required, isObject } = useValidation();

let validationResult = ref<IValidationResult>({ success: true, errors: [] });

const rules: Array<IFieldValidation> = [
  {
    field: "number",
    caption: t("OutputVoucherNumber"),
    rules: [required()],
  },
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
  {
    field: "Items",
    caption: t("Item.Sum"),
    rules: [isArray()],
  },
];
//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
const namePage = ref("InputVoucherAdd");
const route = useRoute();
const id = ref(Number(route.params.id));

const inputVoucherStore = useInputVoucherStore();
const { inputVoucher, inputVoucherStates } = storeToRefs(
  useInputVoucherStore()
);
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
    Category: { id: 0, name: "" },
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
      Category: { id: 1, name: "" },
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
    });
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
    VoucherItemTemp.value.count * VoucherItemTemp.value.price;
  console.log(VoucherItemTemp.value);

  inputVoucherStore.addItem(VoucherItemTemp.value);
  resetVoucherItemTemp();
  showPop.value = false;
};
const ChangeValueTotal = () => {
  VoucherItemTemp.value.value =
    VoucherItemTemp.value.count * VoucherItemTemp.value.price;
};
const indexSelectedVoucherItem = ref(0);
const EditItem = () => {
  VoucherItemTemp.value.value =
    VoucherItemTemp.value.count * VoucherItemTemp.value.price;
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
  // validationResult.value = validate(inputVoucher.value, rules);

  // if (!validationResult.value.success) {
  //   WarningToast(t("ValidationFails"));
  //   return;
  // }
  errors.value = null;
  const sendData = makeFormDataFromObject(inputVoucher.value);

  inputVoucherStore
    .store(sendData)
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
      errors.value = inputVoucherStore.getError(error);
      Swal.fire({
        icon: "error",
        title: "create new data fails!!!",
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
  //#region Old Schema
  // const formData = new FormData();
  // formData.append("number", inputVoucher.value.number);
  // formData.append("notes", inputVoucher.value.notes);
  // formData.append("date", inputVoucher.value.date);
  // formData.append("items", JSON.stringify(inputVoucher.value.Items));
  // formData.append("State", JSON.stringify(inputVoucher.value.State));
  // formData.append("requestedBy", inputVoucher.value.requestedBy);
  // formData.append(
  //   "signaturePerson",
  //   String(inputVoucher.value.signaturePerson)
  // );
  //#endregion
  inputVoucherStore
    .update(inputVoucher.value.id, sendData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Your Item has been updated",
          showConfirmButton: false,
          timer: 1500,
        });
        showData(inputVoucher.value.id);
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = inputVoucherStore.getError(error);
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
        inputVoucher.value.Items = response.data.data.items;
        inputVoucher.value.requestedBy = response.data.data.requestedBy;
        inputVoucher.value.signaturePerson = response.data.data.signaturePerson;
        inputVoucher.value.State = response.data.data.State;
        inputVoucher.value.Stock = response.data.data.Stock;
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
  checkPermissionAccessArray([EnumPermission.ShowInputVouchers]);
  await inputVoucherStore.getState();
  await inputVoucherStore.getEmployees();
  if (Number.isNaN(id.value) || id.value === undefined) {
    inputVoucher.value.id = 0;
  } else {
    inputVoucher.value.id = id.value;
    await showData(id.value);
    namePage.value = "InputVoucherUpdate";
  }
  await useStockStore().get_stocks();
  await useItemStore().get_items();
  Loading.value = false;
});
const handleEnter = (event: KeyboardEvent) => {
  const enteredValue = (event.target as HTMLInputElement).value;
  const matchingOption = items.value.find(
    (option: IItem) => option.name === enteredValue
  );
  if (matchingOption === undefined && enteredValue.length > 0) {
    let btn = document.getElementById("my_modal_7");
    item.value.name = enteredValue;
    btn?.click();
    let NameItemEnterNew = document.getElementById("NameItemEnterNew");
    NameItemEnterNew?.focus();
    //xxx
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
        Category: { id: 0, name: "" },
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
const setItemFromChild = (_item: IItem) => {
  VoucherItemTemp.value.Item = _item;
};
const headers = ref<Array<ITableHeader>>([
  { caption: t("ID"), value: "id" },
  { caption: t("Item.Name"), value: "Item" },
  { caption: t("Item.Description"), value: "description" },
  { caption: t("Count"), value: "count" },
  { caption: t("Price"), value: "price" },
  { caption: t("Total"), value: "Total" },
  { caption: t("Notes"), value: "notes" },
  { caption: t("Details"), value: "Actions" },
]);
</script>

<template>
  <IPage :HeaderTitle="t(namePage)" :isLoading="Loading">
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
      <IContainer>
        <IForm>
          <IRow col-lg="4" col-md="2" col-sm="1">
            <ICol span="1" span-md="2" span-sm="1">
              <IInput
                :label="t('InputVoucher.Number')"
                name="InputVoucher.Number"
                v-model="inputVoucher.number"
                type="text"
              />
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <IInput
                :label="t('Date')"
                name="InputVoucher.Date"
                v-model="inputVoucher.date"
                type="date"
              />
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <IInput
                :label="t('InputVoucher.DateReceive')"
                name="InputVoucher.DateReceive"
                v-model="inputVoucher.dateReceive"
                type="date"
              />
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <IInput
                :label="t('InputVoucher.DateBill')"
                name="InputVoucherNumer"
                v-model="inputVoucher.dateBill"
                type="date"
              />
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <IInput
                :label="t('InputVoucher.NumberBill')"
                name="InputVoucher.NumberBill"
                v-model="inputVoucher.numberBill"
                type="text"
              />
            </ICol>
            <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
              <div class="mb-2">
                <label class="_inputLabel">
                  <span class="text-red-600">*</span> {{ t("Stock") }}
                </label>
                <select v-model="inputVoucher.Stock" class="_input">
                  <option
                    v-for="stock in stocks"
                    :key="stock.id"
                    :value="stock"
                  >
                    {{ stock.name }}
                  </option>
                </select>
              </div>
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <ISelect
                :label="t('InputVoucher.State')"
                v-model="inputVoucher.State.id"
                name="inputVoucherStateId"
                :options="inputVoucherStates"
                :IsRequire="true"
              />
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <IInput
                :label="t('InputVoucherEmployeeRequest')"
                name="InputVoucherNumer"
                v-model="inputVoucher.requestedBy"
                type="text"
              />
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <IInput
                :label="t('InputVoucherSignaturePerson')"
                name="InputVoucherNumer"
                v-model="inputVoucher.signaturePerson"
                type="text"
              />
            </ICol>
          </IRow>
          <IRow>
            <ICol>
              <IInput
                :label="t('Notes')"
                name="InputVoucherNumer"
                v-model="inputVoucher.notes"
                type="text"
              />
            </ICol>
          </IRow>
          <IRow>
            <ICol>
              <van-button
                class="border-none duration-500 rounded-lg bg-create hover:bg-createHover"
                type="success"
                is-link
                @click="AddPopup()"
                >{{ t("Item.Add") }}
              </van-button>
            </ICol>
          </IRow>
          <IRow>
            <ICol>
              <ITable :items="inputVoucher.Items" :headers="headers">
                <template v-slot:Item="{ row }">
                  {{ row.Item.name }}
                </template>
                <template v-slot:Total="{ row }">
                  {{ row.count * row.price }}
                </template>
                <template v-slot:Actions="{ row, rowIndex }">
                  <van-button
                    class="border-none duration-500 m-2 rounded-lg bg-create hover:bg-createHover"
                    type="success"
                    is-link
                    @click="updatePopup(rowIndex, row)"
                    >{{ t("Edit") }}
                  </van-button>
                  |
                  <van-button
                    class="duration-500 rounded-lg m-2 bg-white hover:bg-deleteHover border-red-700 border-2"
                    is-link
                    @click="deleteItem(rowIndex)"
                    >{{ t("Delete") }}
                  </van-button>
                </template>
              </ITable>
            </ICol>
          </IRow>
          <IRow>
            <ICol><IErrorMessages :validationResult="validationResult" /></ICol>
          </IRow>
        </IForm>
      </IContainer>
    </IPageContent>
    <IContainer>
      <van-popup
        class="overflow-hidden dark:bg-darkNav"
        v-model:show="showPop"
        round
        position="bottom"
      >
        <!-- for search Item -->
        <IRow col-lg="4" col-md="1" col-sm="1" col-xs="1">
          <ICol>
            <div
              class="mb-1 md:text-sm text-base ml-2 font-bold dark:text-gray-300"
            >
              {{ t("Item") }}
            </div>
            <vSelect
              class="capitalize rounded-md border-2 p-2 dark:text-gray-200 dark:bg-gray-800 focus:outline-none focus:border focus:border-gray-700 text-gray-800 mb-10"
              v-model="VoucherItemTemp.Item"
              :options="items"
              :reduce="(_item: IItem) => _item"
              :get-option-label="(_item: IItem) => _item.name"
              @keydown.enter="handleEnter"
              :create-option="
                (_item: IItem) => ({
                  input_voucher_id: 0,
                  Item: {
                    name: '',
                    id: 0,
                    code: 0,
                    description: 0,
                    Category: { id: 0, name: '' },
                    measuringUnit: '',
                  },
                  describtion: '',
                  count: 0,
                  price: 0,
                  value: 0,
                  notes: '',
                })
              "
            >
              <template #option="{ code, Category, description, name }">
                <div class="rtl:text-right border-2 p-2 rounded-md">
                  <div
                    class="rounded-md focus:outline-none focus:border focus:border-gray-700 dark:bg-gray-800 dark:text-gray-100 p-1 mb-1 font-bold"
                  >
                    {{ name }}
                  </div>
                  <cite>
                    <div
                      class="rounded-md focus:outline-none focus:border focus:border-gray-400 bg-gray-500 text-gray-200 p-1 mb-1"
                    >
                      {{ t("Code") }}: {{ code }}
                    </div>
                    <div
                      class="rounded-md focus:outline-none focus:border focus:border-gray-400 bg-gray-500 text-gray-200 p-1 mb-1"
                    >
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
            <AddItemPopup :setItem="setItemFromChild"></AddItemPopup>
          </ICol>
          <ICol
            span="3"
            span-xl="3"
            span-lg="3"
            span-md="1"
            span-sm="1"
            span-xs="1"
            v-if="VoucherItemTemp.Item == null"
            class="border-2 border-dotted border-gray-600"
          >
            <div class="w-full text-center align-middle border-gray-600">
              <div
                class="md:text-sm text-base ml-2 font-bold dark:text-gray-300 mt-auto mb-auto w-full"
              >
                قم بأختيار مادة
              </div>
            </div>
          </ICol>
          <ICol
            :span="3"
            span-xl="3"
            span-lg="3"
            span-md="1"
            span-sm="1"
            span-xs="1"
            v-else-if="VoucherItemTemp.Item.name != ''"
          >
            <IRow col="4">
              <ICol span="1">
                <ILabel :title="t('Code')">
                  {{ VoucherItemTemp.Item.code }}</ILabel
                >
              </ICol>
              <ICol span="1">
                <ILabel :title="t('Category')">
                  {{ VoucherItemTemp.Item.Category.name }}</ILabel
                >
              </ICol>
              <ICol span="1">
                <ILabel :title="t('Description')">
                  {{ VoucherItemTemp.Item.description }}</ILabel
                >
              </ICol>
            </IRow>
          </ICol>
          <ICol
            span="3"
            span-xl="3"
            span-lg="3"
            span-md="1"
            span-sm="1"
            span-xs="1"
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
          </ICol>
        </IRow>
        <!-- for insert item proparties -->
        <IRow col-lg="4" :col="4" col-xl="4" col-md="2" col-sm="1" col-xs="1">
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <IInput
              :label="t('Item.Description')"
              v-model="VoucherItemTemp.description"
            />
          </ICol>
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <IInput
              :label="t('Count')"
              :on-input="ChangeValueTotal"
              type="number"
              v-model="VoucherItemTemp.count"
              :min="1"
            />
          </ICol>
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <IInput
              :label="t('Price')"
              :on-input="ChangeValueTotal"
              type="number"
              v-model="VoucherItemTemp.price"
              :min="1"
            />
          </ICol>
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <IInput
              :label="t('Total')"
              type="number"
              v-model="VoucherItemTemp.value"
            />
          </ICol>
          <ICol :span="4" span-lg="4" span-xl="1" span-md="1">
            <IInput
              :label="t('Notes')"
              type="text"
              v-model="VoucherItemTemp.notes"
            />
          </ICol>
        </IRow>
        <!-- buttons -->
        <IContainer class="flex flex-row my-10">
          <IButton
            :text="t('Add')"
            color="blue"
            type="default"
            :on-click="AddItem"
            v-if="IsAdd"
          />
          <IButton
            :text="t('Update')"
            color="blue"
            type="default"
            :on-click="EditItem"
            v-else
          />
          <IButton
            class=""
            pre-icon="close-box"
            :text="t('Close')"
            color="blue"
            type="text"
            :on-click="() => (showPop = false)"
          />
        </IContainer>
      </van-popup>
    </IContainer>
    <template #Footer>
      <IFooterCrud
        :isAdd="inputVoucher.id == 0"
        :onCreate="store"
        :onUpdate="update"
        :onDelete="Delete"
      />
    </template>
  </IPage>
</template>
