<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionStore } from "@/project/user/permissionStore";
import { useStockStore } from "../../stockStore";
import { useOutputVoucherStore } from "./../outputVoucherStore";
import { useInputVoucherStore } from "@/project/warehouse/inputVoucher/inputVoucherStore";
import type { IOutputVoucherItem } from "../IOutputVoucher";
import { t } from "@/utilities/I18nPlugin";
import type { IInputVoucherItem } from "../../inputVoucher/IInputVoucher";
import type { ITableHeader } from "@/types/core/components/ITable";
import { EnumPermission } from "@/utilities/EnumSystem";
import IInput from "@/components/inputs/IInput.vue";
import IButton2 from "@/components/ihec/IButton2.vue";
import type { IEmployee } from "@/project/employee/IEmployee";
import IBasis from "@/components/ihec/IBasis.vue";
import IFlex from "@/components/ihec/IFlex.vue";
import { makeFormDataFromObject } from "@/utilities/tools";
const { inputVoucherItemsVSelect } = storeToRefs(useInputVoucherStore());

//region"Validation"
import {
  useValidation,
  type IValidationResult,
  type IFieldValidation,
} from "@/utilities/Validation";
import { WarningToast } from "@/utilities/Toast";
import IErrorMessages from "@/components/ihec/IErrorMessages.vue";
import IPage from "@/components/ihec/IPage.vue";

const { validate, isArray, required, isObject } = useValidation();

let validationResult = ref<IValidationResult>({ success: true, errors: [] });

const rules: Array<IFieldValidation> = [
  {
    field: "number",
    caption: t("OutputVoucherNumber"),
    rules: [required()],
  },
  {
    field: "Employee",
    caption: t("OutputVoucherEmployeeRequest"),
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
const namePage = ref("OutputVoucher");
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
    Category: {
      id: 1,
      name: "",
    },
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
      Category: {
        id: 0,
        name: "",
      },
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
      Category: {
        id: 1,
        name: "",
      },
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
        Category: {
          id: 0,
          name: "",
        },
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
  showPop.value = false;
};
const ChangeValueTotal = () => {
  OutputVoucherItem.value.value =
    OutputVoucherItem.value.count *
    Number(OutputVoucherItem.value.InputVoucherItem?.price);
};

// for change the value of total in form item
watch(
  () => OutputVoucherItem.value.InputVoucherItem.price,
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
};

const store = () => {
  validationResult.value = validate(outputVoucher.value, rules);

  if (!validationResult.value.success) {
    WarningToast(t("ValidationFails"));
    return;
  }

  errors.value = null;
  const sendData = makeFormDataFromObject(outputVoucher.value);
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
    WarningToast(t("ValidationFails"));
    return;
  }
  errors.value = null;
  const sendData = makeFormDataFromObject(outputVoucher.value);
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
        outputVoucher.value.Stock = response.data.data.Stock;
        outputVoucher.value.signaturePerson =
          response.data.data.signaturePerson;
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
const { stocks } = storeToRefs(useStockStore());

onMounted(async () => {
  Loading.value = true;

  checkPermissionAccessArray([EnumPermission.ShowOutputVouchers]);
  await outputVoucherStore.getEmployees().then(() => {});
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "AddOutputVoucher";
    outputVoucher.value.id = 0;
    outputVoucher.value.date = new Date().toISOString().split("T")[0];
  } else {
    outputVoucher.value.id = id.value;
    await showData(id.value);
    namePage.value = "UpdateOutputVoucher";
  }
  await useStockStore().get_stocks();
  await useInputVoucherStore().getAvailableItemsVSelect();
  Loading.value = false;
});
const ChangeStock = async () => {
  Loading.value = true;

  await useInputVoucherStore()
    .getAvailableItemsVSelect(outputVoucher.value.Stock.id.toString())
    .then(() => {
      //console.log("Get Store ");
    });
  Loading.value = false;
};
const headers = ref<Array<ITableHeader>>([
  { caption: t("ID"), value: "id" },
  { caption: t("Item.Index"), value: "Item" },
  { caption: t("Item.Description"), value: "Description" },
  { caption: t("Count"), value: "count" },
  { caption: t("Price"), value: "price" },
  { caption: t("Total"), value: "Total" },
  { caption: t("Stock"), value: "Stock" },
  { caption: t("Notes"), value: "notes" },
  { caption: t("Actions"), value: "Actions" },
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
                :label="t('OutputVoucherNumber')"
                name="Number"
                v-model="outputVoucher.number"
                type="text"
              />
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <IInput
                :label="t('Date')"
                name="InputVoucherNumer"
                v-model="outputVoucher.date"
                type="date"
              />
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <div
                class="md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
              >
                {{ t("OutputVoucherEmployeeRequest") }}
              </div>
              <vSelect
                class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
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
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <IInput
                :label="t('InputVoucherSignaturePerson')"
                name="InputVoucherNumer"
                v-model="outputVoucher.signaturePerson"
                type="text"
              />
            </ICol>
          </IRow>
          <IRow col-lg="4" col-md="2" col-sm="1">
            <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
              <div class="mb-2">
                <label class="_inputLabel">
                  <span class="text-red-600">*</span> {{ t("Stock") }}
                </label>
                <select
                  v-model="outputVoucher.Stock"
                  class="_input"
                  @change="ChangeStock()"
                >
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
            <ICol span="3">
              <IInput
                :label="t('Notes')"
                name="InputVoucherNumer"
                v-model="outputVoucher.notes"
                type="text"
              />
            </ICol>
          </IRow>
          <IRow >
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
              <ITable :items="outputVoucher.Items" :headers="headers">
                <template v-slot:Item="{ row }">
                  {{ row.InputVoucherItem.Item.name }}
                </template>
                <template v-slot:Stock="{ row }">
                  {{ row.InputVoucherItem.Stock.name }}
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
              {{ t("Item") }}
            </div>
            <vSelect
              class="capitalize rounded-md border-2 p-2 dark:bg-gray-800 focus:outline-none focus:border focus:border-gray-700 text-gray-800 dark:text-gray-200 mb-10"
              v-model="OutputVoucherItem.InputVoucherItem"
              :options="inputVoucherItemsVSelect"
              :reduce="(_item: IInputVoucherItem) => _item"
              :get-option-label="(_item: IInputVoucherItem) => _item.Item.name"
            >
              <template #option="{ Item, outValue, inValue, notes }">
                <div class="rtl:text-right border-2 p-2 rounded-md">
                  <div
                    class="rounded-md focus:outline-none focus:border focus:border-gray-700 dark:bg-gray-800 dark:text-gray-100 p-1 mb-1 font-bold"
                  >
                    {{ Item.name.toString() }}
                  </div>
                  <cite>
                    <div
                      class="rounded-md focus:outline-none focus:border focus:border-gray-400 bg-gray-500 text-gray-200 p-1 mb-1"
                    >
                      {{ t("Code") }}: {{ Item.code.toString() }}
                    </div>
                    <div
                      class="rounded-md focus:outline-none focus:border focus:border-gray-400 bg-gray-500 text-gray-200 p-1 mb-1"
                    >
                      {{ t("Category") }}:
                      {{ Item.Category.name.toString() }}
                    </div>
                    <div
                      v-if="Item.description"
                      class="rounded-md focus:outline-none focus:border focus:border-gray-400 bg-gray-500 text-gray-200 p-1 mb-1"
                    >
                      {{ t("Item.Description") }}:
                      {{ Item.description.toString() }}
                    </div>
                    <div
                      class="rounded-md focus:outline-none focus:border focus:border-gray-400 bg-amber-800 text-gray-200 p-1 mb-1"
                    >
                      {{ t("Available") }}:
                      {{ Number(inValue) - Number(outValue) }}
                    </div>
                    <cite class="flex flex-wrap text-left text-xs w-fit">
                      {{ notes }}
                    </cite>
                  </cite>
                  <br />
                  <cite>
                    {{ Item.description }}
                  </cite>
                </div>
              </template>
            </vSelect>
          </IBasis>
          <IBasis
            base="3/4"
            v-if="OutputVoucherItem.InputVoucherItem == null"
            class="border-2 border-dotted border-gray-600"
            ><div class="w-full text-center align-middle border-gray-600">
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
                  {{
                    OutputVoucherItem.InputVoucherItem.Item?.Category.name
                  }}</ILabel
                >
              </IBasis>
              <IBasis base="1/2"
                ><ILabel :title="t('Description')">
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
            ><div class="w-full text-center align-middle border-gray-600">
              <div
                class="md:text-sm text-base ml-2 font-bold dark:text-gray-300 mt-auto mb-auto w-full"
              >
                قم بأختيار مادة
              </div>
            </div></IBasis
          >
        </IFlex>

        <!-- for insert item proparties -->
        <IRow
          col-lg="4"
          col-xl="4"
          col-md="2"
          col-sm="1"
          col-xs="1"
          v-if="OutputVoucherItem.InputVoucherItem != null"
        >
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <ILabel :title="t('Item.Description')">
              {{ OutputVoucherItem.InputVoucherItem.description }}</ILabel
            >
          </ICol>
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <IInput
              :label="t('Count')"
              :on-input="ChangeValueTotal"
              type="number"
              v-model="OutputVoucherItem.count"
              :max="
                Number(OutputVoucherItem.InputVoucherItem.inValue) -
                Number(OutputVoucherItem.InputVoucherItem.outValue)
              "
              :min="1"
            />
          </ICol>
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <IInput
              :label="t('Price')"
              :on-input="ChangeValueTotal"
              type="number"
              v-model="OutputVoucherItem.InputVoucherItem.price"
            />
          </ICol>
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <IInput
              :label="t('Total')"
              type="number"
              v-model="OutputVoucherItem.value"
            />
          </ICol>
          <ICol :span="3" :span-lg="3" :span-md="2" :span-xl="1">
            <IInput
              :label="t('Note')"
              type="text"
              v-model="OutputVoucherItem.notes"
            />
          </ICol>
        </IRow>
        <!-- buttons -->
        <IContainer class="flex flex-row my-10">
          <IButton2
            :text="t('Add')"
            color="blue"
            type="default"
            :on-click="AddItem"
            v-if="IsAdd"
          />
          <IButton2
            :text="t('Update')"
            color="blue"
            type="default"
            :on-click="EditItem"
            v-else
          />
          <IButton2
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
        :isAdd="outputVoucher.id == 0"
        :onCreate="store"
        :onUpdate="update"
        :onDelete="Delete"
      />
    </template>
  </IPage>
</template>
