<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { usePermissionStore } from "@/project/user/permissionStore";
import { useStockStore } from "../../stockStore";
import { useRetrievalVoucherStore } from "./../RetrievalVoucherStore";
import { useInputVoucherStore } from "@/project/warehouse/inputVoucher/inputVoucherStore";
import type { IRetrievalVoucherItem } from "../IRetrievalVoucher";
import { t } from "@/utilities/I18nPlugin";
import type { IInputVoucherItem } from "../../inputVoucher/IInputVoucher";
import type { ITableHeader } from "@/types/core/components/ITable";
import { EnumPermission } from "@/utilities/EnumSystem";
import IInput from "@/components/inputs/IInput.vue";
import IButton2 from "@/components/ihec/IButton2.vue";
import type { IEmployee } from "@/project/employee/IEmployee";
import IBasis from "@/components/ihec/IBasis.vue";
import IFlex from "@/components/ihec/IFlex.vue";
const { inputVoucherItemsVSelect } = storeToRefs(useInputVoucherStore());
//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
const namePage = ref("RetrievalVoucher");
const route = useRoute();
const id = ref(Number(route.params.id));

const VoucherStore = useRetrievalVoucherStore();
const { Voucher, VoucherEmployees } = storeToRefs(
  useRetrievalVoucherStore()
);
//#region popUp
const showPop = ref(false);
const IsAdd = ref(false);

const VoucherItem = ref<IRetrievalVoucherItem>({
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
  price: 1,
  value: 1,
  notes: "",
  Employee: { id: 1, name: "" },
  inputVoucherItemId: 0,
  inputVoucherItem: {
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
    Stock: {
      id: 0,
      name: "",
    },
    serialNumber: "",
    count: 1,
    price: 1,
    value: 1,
  },
  VoucherId: 0
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
    price: 1,
    value: 1,
    notes: "",
    Employee: { id: 1, name: "" },
    inputVoucherItemId: 0,
    VoucherId: 0,
    inputVoucherItem: {
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
      Stock: {
        id: 0,
        name: "",
      },
      serialNumber: "",
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
        VoucherStore.removeItem(index);
      }
    });
};
const updatePopup = (index: number, itemX: IRetrievalVoucherItem) => {
  showPop.value = true;
  IsAdd.value = false;
  indexSelectedVoucherItem.value = index;
  VoucherItem.value = itemX;
  VoucherItem.value.inputVoucherItemId =Number(itemX.inputVoucherItem.id) ;
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
  ChangeValueTotal();
  VoucherItem.value.inputVoucherItemId = Number(VoucherItem.value.inputVoucherItem.id);
  VoucherStore.addItem(VoucherItem.value);

  resetVoucherItem();
  showPop.value = false;
};
const ChangeValueTotal = () => {
  VoucherItem.value.value =
    VoucherItem.value.count * Number(VoucherItem.value.inputVoucherItem?.price);
};

// for change the value of total in form item
watch(
  () => VoucherItem.value.inputVoucherItem.price,
  (newX) => {
    ChangeValueTotal();
  }
)
const indexSelectedVoucherItem = ref(0);
const EditItem = () => {
  VoucherItem.value.value = VoucherItem.value.count * VoucherItem.value.price;
  VoucherStore.editItem(
    indexSelectedVoucherItem.value,
    VoucherItem.value
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
  VoucherStore.resetData();
};
const getFormData = (object: any) =>
  Object.keys(object).reduce((formData, key) => {
    let value = object[key];
    if (typeof value === "object" && value !== null)
      value = JSON.stringify(value);
    formData.append(key, value);
    return formData;
  }, new FormData());

const store = () => {
  errors.value = null;
  const sendData = getFormData(Voucher.value);
  sendData.append(
    "employeeRequestId",
    Voucher.value.Employee.id.toString()
  );
  VoucherStore
    .store(sendData)
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
      errors.value = VoucherStore.getError(error);
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
  const sendData = getFormData(Voucher.value);
  sendData.append(
    "employeeRequestId",
    Voucher.value.Employee.id.toString()
  );

  VoucherStore
    .update(Voucher.value.id, sendData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your Item has been updated",
          showConfirmButton: false,
          timer: 1500,
        });
        showData(Voucher.value.id);
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = VoucherStore.getError(error);
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
        await VoucherStore._delete(Voucher.value.id).then(() => {
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
  await VoucherStore
    .show(id)
    .then((response) => {
      if (response.status == 200) {
        Voucher.value.id = response.data.data.id;
        Voucher.value.date = response.data.data.date;
        Voucher.value.number = response.data.data.number;
        Voucher.value.notes = response.data.data.notes;
        Voucher.value.Items = response.data.data.Items;
        Voucher.value.Employee = response.data.data.Employee;
        Voucher.value.signaturePerson =
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
  checkPermissionAccessArray([EnumPermission.ShowRetrievalVouchers]);
  await VoucherStore.getEmployees().then(() => {});
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "AddRetrievalVoucher";
    Voucher.value.id = 0;
    Voucher.value.date = new Date().toISOString().split("T")[0];
  } else {
    Voucher.value.id = id.value;
    await showData(id.value);
    namePage.value = "UpdateRetrievalVoucher";
  }
  await useStockStore().get_stocks();
  await useInputVoucherStore().getItemsVSelect();
});

const headers = ref<Array<ITableHeader>>([
  { caption: t("ID"), value: "id" },
  { caption: t("Item"), value: "Item" },
  { caption: t("SerialNumber"), value: "serialNumber" },
  { caption: t("Count"), value: "count" },
  { caption: t("Price"), value: "price" },
  { caption: t("Total"), value: "Total" },
  { caption: t("Stock"), value: "Stock" },
  { caption: t("Notes"), value: "notes" },
  { caption: t("Actions"), value: "Actions" },
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
                :label="t('RetrievalVoucherNumber')"
                name="Number"
                v-model="Voucher.number"
                type="text"
              />
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <IInput
                :label="t('Date')"
                name="InputVoucherNumer"
                v-model="Voucher.date"
                type="date"
              />
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <div
                class="md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
              >
                {{ t("RetrievalVoucherEmployeeRequest") }}
              </div>
              <vSelect
                class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                v-model="Voucher.Employee"
                :options="VoucherEmployees"
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
                v-model="Voucher.signaturePerson"
                type="text"
              />
            </ICol>
          </IRow>
          <IRow>
            <ICol>
              <IInput
                :label="t('Notes')"
                name="InputVoucherNumer"
                v-model="Voucher.notes"
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
              <ITable :items="Voucher.Items" :headers="headers">
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
              class="capitalize rounded-md border-2 p-2 dark:bg-gray-800 focus:outline-none focus:border focus:border-gray-700 text-gray-800 mb-10"
              v-model="VoucherItem.inputVoucherItem"
              :options="inputVoucherItemsVSelect"
              :reduce="(_item: IInputVoucherItem) => _item"
              :get-option-label="(_item: IInputVoucherItem) => _item.Item.name"
            >
              <template #option="{ Item, outValue, inValue }">
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
                      v-if="Item.serialNumber"
                      class="rounded-md focus:outline-none focus:border focus:border-gray-400 bg-gray-500 text-gray-200 p-1 mb-1"
                    >
                      {{ t("SerialNumber") }}:
                      {{ Item.serialNumber.toString() }}
                    </div>
                    <div
                      class="rounded-md focus:outline-none focus:border focus:border-gray-400 bg-amber-800 text-gray-200 p-1 mb-1"
                    >
                      {{ t("Available") }}:
                      {{ Number(inValue) - Number(outValue) }}
                    </div>
                    <cite class="flex flex-wrap text-left text-xs w-fit">
                      {{ Item.notes }}
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
            v-if="VoucherItem.inputVoucherItem == null"
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
            v-else-if="VoucherItem.inputVoucherItem.Item?.Category.name != ''"
          >
            <IFlex>
              <IBasis base="1/4">
                <ILabel :title="t('Code')">
                  {{ VoucherItem.inputVoucherItem.Item?.code }}</ILabel
                >
              </IBasis>
              <IBasis base="1/4">
                <ILabel :title="t('Category')">
                  {{ VoucherItem.inputVoucherItem.Item?.Category.name }}</ILabel
                >
              </IBasis>
              <IBasis base="1/2"
                ><ILabel :title="t('Description')">
                  {{ VoucherItem.inputVoucherItem.Item?.description }}</ILabel
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
          v-if="VoucherItem.inputVoucherItem != null"
        >
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <IInput
              :label="t('Stock')"
              v-model="VoucherItem.inputVoucherItem.Stock.name"
              :disabled="true"
            />
          </ICol>
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <IInput
              :label="t('SerialNumber')"
              v-model="VoucherItem.inputVoucherItem.serialNumber"
            />
          </ICol>
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <IInput
              :label="t('Count')"
              :on-input="ChangeValueTotal"
              type="number"
              v-model="VoucherItem.count"
              :max="
                Number(VoucherItem.inputVoucherItem.inValue) -
                Number(VoucherItem.inputVoucherItem.outValue)
              "
              :min="1"
            />
          </ICol>
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <IInput
              :label="t('Price')"
              :on-input="ChangeValueTotal"
              type="number"
              v-model="VoucherItem.inputVoucherItem.price"
            />
          </ICol>
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <IInput
              :label="t('Total')"
              type="number"
              v-model="VoucherItem.value"
            />
          </ICol>
          <ICol :span="2" :span-lg="2" :span-md="2" :span-xl="1">
            <IInput
              :label="t('Note')"
              type="text"
              v-model="VoucherItem.notes"
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
        :isAdd="Voucher.id == 0"
        :onCreate="store"
        :onUpdate="update"
        :onDelete="Delete"
      />
    </template>
  </IPage>
</template>@/utilities/I18nPlugin@/utilities/EnumSystem
