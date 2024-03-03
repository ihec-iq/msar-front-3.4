<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { usePermissionStore } from "@/stores/permissionStore";
import { useStockStore } from "@/stores/warehouse/stockStore";
import { useOutputVoucherStore } from "@/stores/warehouse/outputVoucherStore";
import { useInputVoucherStore } from "@/stores/warehouse/inputVoucherStore";
import type { IOutputVoucherItem } from "@/types/IOutputVoucher";
import { t } from "@/utils/I18nPlugin";
import type { IInputVoucherItem } from "@/types/IInputVoucher";
import { ITableHeader } from "@/types/core/components/ITable";
import { EnumPermission } from "@/utils/EnumSystem";
import { IEmployee } from "@/types/IEmployee";
import IInput from "@/components/inputs/IInput.vue";
const { inputVoucherItemsVSelect } = storeToRefs(useInputVoucherStore());
//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
const namePage = ref(".....");
const route = useRoute();
const id = ref(Number(route.params.id));
const rtlStore = useRtlStore();
const { is } = storeToRefs(rtlStore);

const outputVoucherStore = useOutputVoucherStore();
const { outputVoucher, outputVoucherEmployees } = storeToRefs(
  useOutputVoucherStore()
);
//#region popUp
const showPop = ref(false);
const IsAdd = ref(false);

const VoucherItem = ref<IOutputVoucherItem>({
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
  Stock: {
    id: 1,
    name: "",
  },
  serialNumber: "",
  count: 1,
  price: 0,
  value: 0,
  notes: "",
  Employee: { id: 1, name: "" },
  inputVoucherItemId: 0,
});
const AddPopup = () => {
  showPop.value = true;
  resetVoucherItem();
};
const resetVoucherItem = () => {
  IsAdd.value = true;
  indexSelectedVoucherItem.value = 0;
  VoucherItem.value = {
    id: 0,
    Item: {
      id: 0,
      name: "",
      code: "",
      description: "",
      Category: {
        id: 1,
        name: "",
      },
      measuringUnit: "",
    },
    Stock: {
      id: 1,
      name: "",
    },
    serialNumber: "",
    count: 1,
    price: 0,
    value: 0,
    notes: "",
    Employee: { id: 1, name: "" },
    inputVoucherItemId: 0,
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
  VoucherItem.value = itemX;
  console.log(VoucherItem.value);
};
const AddItem = () => {
  VoucherItem.value.Item = VoucherItem.value.inputVoucherItem?.Item;
  VoucherItem.value.Stock = VoucherItem.value.inputVoucherItem?.Stock || {
    id: 1,
    name: "",
  };
  VoucherItem.value.serialNumber = String(
    VoucherItem.value.inputVoucherItem?.serialNumber
  );
  VoucherItem.value.price = Number(VoucherItem.value.inputVoucherItem?.price);
  VoucherItem.value.value = VoucherItem.value.count * VoucherItem.value.price;
  outputVoucherStore.addItem(VoucherItem.value);
  resetVoucherItem();
  showPop.value = false;
};
const ChangeValueTotal = () => {
  VoucherItem.value.value =
    VoucherItem.value.count * Number(VoucherItem.value.inputVoucherItem?.price);
};
const indexSelectedVoucherItem = ref(0);
const EditItem = () => {
  console.log(VoucherItem.value);
  VoucherItem.value.value = VoucherItem.value.count * VoucherItem.value.price;
  outputVoucherStore.editItem(
    indexSelectedVoucherItem.value,
    VoucherItem.value
  );
  resetVoucherItem();
  showPop.value = false;
};
//#endregion

const Loading = ref(false);
const router = useRouter();
const errors = ref<String | null>();

//#region CURD
const reset = () => {
  outputVoucherStore.resetData();
};
const store = () => {
  errors.value = null;
  const formData = new FormData();
  formData.append("number", outputVoucher.value.number.toString());
  formData.append("notes", outputVoucher.value.notes.toString());
  formData.append("date", outputVoucher.value.date.toString());
  formData.append("items", JSON.stringify(outputVoucher.value.Items));
  formData.append(
    "employeeRequestId",
    outputVoucher.value.Employee.id.toString()
  );
  formData.append(
    "signaturePerson",
    String(outputVoucher.value.signaturePerson)
  );
  outputVoucherStore
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
  errors.value = null;
  const formData = new FormData();
  formData.append("number", outputVoucher.value.number.toString());
  formData.append("notes", String(outputVoucher.value.notes));
  formData.append("date", outputVoucher.value.date.toString());
  formData.append("items", JSON.stringify(outputVoucher.value.Items));
  formData.append(
    "employeeRequestId",
    outputVoucher.value.Employee.id.toString()
  );
  formData.append(
    "signaturePerson",
    String(outputVoucher.value.signaturePerson)
  );
  outputVoucherStore
    .update(outputVoucher.value.id, formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
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
        outputVoucher.value.signaturePerson =
          response.data.data.signaturePerson;
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

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowOutputVouchers]);
  await outputVoucherStore.getEmployees().then(() => {});
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "OutputVoucher";
    outputVoucher.value.id = 0;
    outputVoucher.value.date = new Date().toISOString().split("T")[0];
  } else {
    outputVoucher.value.id = id.value;
    await showData(id.value);
    namePage.value = "OutputVoucher";
  }
  await useStockStore().get_stocks();
  await useInputVoucherStore().getItemsVSelect();
});

const headers = ref<Array<ITableHeader>>([
  { caption: t("ID"), value: "id" },
  { caption: t("Item"), value: "name" },
  { caption: t("SerialNumber"), value: "serialNumber" },
  { caption: t("Count"), value: "count" },
  { caption: t("Price"), value: "price" },
  { caption: t("Total"), value: "total" },
  { caption: t("Stock"), value: "stock" },
  { caption: t("Notes"), value: "notes" },
  { caption: t("Actions"), value: "actions" },
]);
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
      <IContainer>
        <IForm>
          <IRow col-lg="4" col-md="2" col-sm="1">
            <ICol span="1" span-md="2" span-sm="1">
              <IInput
                :label="t('Name')"
                name="Name"
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
                class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
              >
                {{ t("OutputVoucherEmployeeRequest") }}
              </div>
              <vSelect
                class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                v-model="outputVoucher.Employee.id"
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
            <ICol span="1" span-md="2" span-sm="1">
              <IInput
                :label="t('InputVoucherEmployeeRequest')"
                name="InputVoucherNumer"
                v-model="outputVoucher.requestedBy"
                type="text"
              />
            </ICol>
          </IRow>
          <IRow>
            <ICol>
              <IInput
                :label="t('Notes')"
                name="InputVoucherNumer"
                v-model="outputVoucher.notes"
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
                >{{ t("AddItem") }}
              </van-button>
            </ICol>
          </IRow>
          <IRow>
            <ICol>
              <ITable :items="outputVoucher.Items" :headers="headers">
                <template v-slot:Item="{ row }">
                  {{ row.Item.name }}
                </template>
                <template v-slot:Stock="{ row }">
                  {{ row.Stock.name }}
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
        </IForm>
      </IContainer>
      <IContainer>
        <van-popup
          class="overflow-hidden"
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
                class="capitalize rounded-md border-2 p-2 dark:bg-gray-800 focus:outline-none focus:border focus:border-gray-700 text-gray-800 mb-10"
                v-model="VoucherItem.inputVoucherItem"
                :options="inputVoucherItemsVSelect"
                :reduce="(_item: IInputVoucherItem) => _item"
                :get-option-label="(_item: IInputVoucherItem) => _item.name"
                @option:clear=""
                :create-option="
                  (_item: IInputVoucherItem) => ({
                    input_voucher_id: 0,
                    Item: {
                      name: '',
                      id: 0,
                      code: 0,
                      description: 0,
                      Category: { id: 0, name: '' },
                      measuringUnit: '',
                    },
                    Stock: { name: '', id: 0 },
                    serialNumber: '',
                    count: 0,
                    price: 0,
                    value: 0,
                    notes: '',
                  })
                "
              >
                <template #option="{ _item }">
                  <div class="rtl:text-right border-2 p-2 rounded-md">
                    <div
                      class="rounded-md focus:outline-none focus:border focus:border-gray-700 dark:bg-gray-800 dark:text-gray-100 p-1 mb-1 font-bold"
                    >
                      {{ _item.Item.name.toString() }}
                    </div>
                    <cite>
                      <div
                        class="rounded-md focus:outline-none focus:border focus:border-gray-400 bg-gray-500 text-gray-200 p-1 mb-1"
                      >
                        {{ t("Code") }}: {{ _item.Item.code.toString() }}
                      </div>
                      <div
                        class="rounded-md focus:outline-none focus:border focus:border-gray-400 bg-gray-500 text-gray-200 p-1 mb-1"
                      >
                        {{ t("Category") }}:
                        {{ _item.Item.Category.name.toString() }}
                      </div>
                      <div
                        v-if="_item.serialNumber"
                        class="rounded-md focus:outline-none focus:border focus:border-gray-400 bg-gray-500 text-gray-200 p-1 mb-1"
                      >
                        {{ t("SerialNumber") }}:
                        {{ _item.serialNumber.toString() }}
                      </div>
                      <div
                        class="rounded-md focus:outline-none focus:border focus:border-gray-400 bg-amber-800 text-gray-200 p-1 mb-1"
                      >
                        {{ t("Available") }}:
                        {{ Number(_item.inValue) - Number(_item.outValue) }}
                      </div>
                      <cite class="flex flex-wrap text-left text-xs w-fit">
                        {{ _item.notes }}
                      </cite>
                    </cite>
                    <br />
                    <cite>
                      {{ description }}
                    </cite>
                  </div>
                </template>
              </vSelect>
            </ICol>
            <ICol
              span="3"
              span-xl="3"
              span-lg="3"
              span-md="1"
              span-sm="1"
              span-xs="1"
              v-if="VoucherItem.Item == null"
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
              v-else-if="VoucherItem.Item.name != ''"
            >
              <IRow col="3">
                <ICol span="1">
                  <ILabel :title="t('Code')">
                    {{ VoucherItem.Item?.code }}</ILabel
                  >
                </ICol>
                <ICol span="1">
                  <ILabel :title="t('Category')">
                    {{ VoucherItem.Item?.Category.name }}</ILabel
                  >
                </ICol>
                <ICol span="1">
                  <ILabel :title="t('Description')">
                    {{ VoucherItem.Item?.description }}</ILabel
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
          <IRow col-lg="4" col-xl="4" col-md="2" col-sm="1" col-xs="1">
            <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
              <div class="mb-2">
                <label class="_inputLabel">
                  <span class="text-red-600">*</span> {{ t("Stock") }}
                </label>
                <input
                  :value="VoucherItem.inputVoucherItem?.Stock.name"
                  type="text"
                  class="rounded-md focus:outline-none disabled focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold"
                />
              </div>
            </ICol>
            <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
              <IInput
                :label="t('SerialNumber')"
                v-model="VoucherItem.inputVoucherItem?.serialNumber"
              />
            </ICol>
            <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
              <IInput
                :label="t('Count')"
                :on-input="ChangeValueTotal"
                type="number"
                v-model="VoucherItem.count"
                :max="
                  Number(VoucherItem.inputVoucherItem?.inValue) -
                  Number(VoucherItem.inputVoucherItem?.outValue)
                "
                :min="1"
              />
            </ICol>
            <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
              <IInput
                :label="t('Price')"
                :on-input="ChangeValueTotal"
                type="number"
                v-model="VoucherItem.inputVoucherItem?.price"
              />
            </ICol>
            <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
              <IInput
                :label="t('Total')"
                type="number"
                v-model="VoucherItem.value"
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
    </IPageContent>

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
