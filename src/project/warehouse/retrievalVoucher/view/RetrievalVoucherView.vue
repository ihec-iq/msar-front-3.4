<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { useStockStore } from "../../stockStore";
import { useRetrievalVoucherStore } from "./../retrievalVoucherStore";
import { useInputVoucherStore } from "@/project/warehouse/inputVoucher/inputVoucherStore";
import type { IRetrievalVoucherItem } from "../IRetrievalVoucher";
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
const { inputVoucherItemsVSelect } = storeToRefs(useInputVoucherStore());
//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionsStore();
const namePage = ref("RetrievalVoucher.Index");
const route = useRoute();
const id = ref(Number(route.params.id));
const isLoading = ref(false);

const retrievalVoucherStore = useRetrievalVoucherStore();
const {
  retrievalVoucher,
  retrievalVoucherEmployees,
  retrievalVoucherItemTypes,
} = storeToRefs(useRetrievalVoucherStore());
//#region popUp
const showPop = ref(false);
const IsAdd = ref(false);

const VoucherItem = ref<IRetrievalVoucherItem>({
  id: 0,
  description: "",
  count: 1,
  price: 1,
  value: 1,
  notes: "",
  Employee: { id: 1, name: "" },
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
  Type: {
    id: 0,
    name: "",
  },
  TypeId: 0,
  retrievalVoucherId: 0,
  employeeRequestId: 0,
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
    description: "",
    count: 1,
    price: 1,
    value: 1,
    notes: "",
    Employee: { id: 1, name: "" },
    employeeRequestId: 0,
    inputVoucherItemId: 0,
    retrievalVoucherId: 0,
    Type: {
      id: 0,
      name: "",
    },
    TypeId: 0,
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
        retrievalVoucherStore.removeItem(index);
      }
    });
};
const updatePopup = (index: number, itemX: IRetrievalVoucherItem) => {
  showPop.value = true;
  IsAdd.value = false;
  indexSelectedVoucherItem.value = index;
  console.log(VoucherItem.value);
  VoucherItem.value = itemX;
  VoucherItem.value.InputVoucherItem = itemX.InputVoucherItem;
};

const AddItem = () => {
  // VoucherItem.value.Stock = VoucherItem.value.InputVoucherItem?.Stock || {
  //   id: 1,
  //   name: "",
  // };
  VoucherItem.value.description = String(
    VoucherItem.value.InputVoucherItem?.description
  );
  VoucherItem.value.price = Number(VoucherItem.value.InputVoucherItem?.price);
  ChangeValueTotal();
  VoucherItem.value.inputVoucherItemId = Number(
    VoucherItem.value.InputVoucherItem.id
  );
  retrievalVoucherStore.addItem(VoucherItem.value);
  resetVoucherItem();
  showPop.value = false;
};

const ChangeValueTotal = () => {
  VoucherItem.value.value =
    VoucherItem.value.count * Number(VoucherItem.value.InputVoucherItem?.price);
};

// for change the value of total in form item
watch(
  () => VoucherItem.value.InputVoucherItem,
  (newX) => {
    ChangeValueTotal();
  }
);
const indexSelectedVoucherItem = ref(0);
const EditItem = () => {
  VoucherItem.value.value = VoucherItem.value.count * VoucherItem.value.price;
  retrievalVoucherStore.editItem(
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
  retrievalVoucherStore.resetData();
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
  const sendData = getFormData(retrievalVoucher.value);
  sendData.append(
    "employeeRequestId",
    retrievalVoucher.value.Employee.id.toString()
  );
  retrievalVoucherStore
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
      errors.value = retrievalVoucherStore.getError(error);
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
  const sendData = getFormData(retrievalVoucher.value);
  sendData.append(
    "employeeRequestId",
    retrievalVoucher.value.Employee.id.toString()
  );

  retrievalVoucherStore
    .update(retrievalVoucher.value.id, sendData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your Item has been updated",
          showConfirmButton: false,
          timer: 1500,
        });
        showData(retrievalVoucher.value.id);
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = retrievalVoucherStore.getError(error);
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
        await retrievalVoucherStore
          ._delete(retrievalVoucher.value.id)
          .then(() => {
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
  await retrievalVoucherStore
    .show(id)
    .then((response) => {
      if (response.status == 200) {
        retrievalVoucher.value.id = response.data.data.id;
        retrievalVoucher.value.date = response.data.data.date;
        retrievalVoucher.value.number = response.data.data.number;
        retrievalVoucher.value.notes = response.data.data.notes;
        retrievalVoucher.value.Items = response.data.data.Items;
        retrievalVoucher.value.Employee = response.data.data.Employee;
        retrievalVoucher.value.signaturePerson =
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
  isLoading.value = true;

  await retrievalVoucherStore.getEmployees().then(() => { });
  await retrievalVoucherStore.getTypes().then(() => { });
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "RetrievalVoucher.Add";
    retrievalVoucher.value.id = 0;
    retrievalVoucher.value.date = new Date().toISOString().split("T")[0];
  } else {
    retrievalVoucher.value.id = id.value;
    await showData(id.value);
    namePage.value = "RetrievalVoucher.Update";
  }
  await useStockStore().get_stocks();
  await useInputVoucherStore().getAllItemsVSelect();
  isLoading.value = false;
});

const headers = ref<Array<ITableHeader>>([
  { caption: t("ID"), value: "id" },
  { caption: t("Item.Index"), value: "Item" },
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
  <IPage :HeaderTitle="t(namePage)" :is-loading="isLoading">
    <template #HeaderButtons>
      <IButton2 color="green" width="28" :type="EnumButtonType.Outlined" pre-icon="view-grid-plus" :onClick="reset"
        :text="t('New')" />
    </template>
    <IPageContent>
      <IContainer>
        <IForm>
          <IRow col-lg="4" col-md="2" col-sm="1">
            <ICol span="1" span-md="2" span-sm="1">
              <IInput :label="t('RetrievalVoucher.Number')" name="Number" v-model="retrievalVoucher.number"
                :type="EnumInputType.Text" />
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <IInput :label="t('Date')" name="InputVoucherNumber" v-model="retrievalVoucher.date"
                :type="EnumInputType.Date" />
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <div class="md:text-sm text-base mr-3 font-bold text-text dark:text-textLight">
                {{ t("RetrievalVoucher.Employee") }}
              </div>
              <vSelect
                class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
                v-model="retrievalVoucher.Employee" :options="retrievalVoucherEmployees"
                :reduce="(employee: IEmployee) => employee" label="name"
                :getOptionLabel="(employee: IEmployee) => employee.name">
                <template #option="{ name }">
                  <div>
                    <span>{{ name }}</span>
                  </div>
                </template>
              </vSelect>
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <IInput :label="t('InputVoucherSignaturePerson')" name="InputVoucherNumer"
                v-model="retrievalVoucher.signaturePerson" :type="EnumInputType.Text" />
            </ICol>
          </IRow>
          <IFlex>
            <IBasis base="1/4" base-sm="1/2" base-md="1/2">
              <ISelect :label="t('Type')" v-model="retrievalVoucher.TypeId" name="TypeId"
                :options="retrievalVoucherItemTypes" :IsRequire="true" />
            </IBasis>
            <IBasis base="3/4" base-md="1/2" base-sm="1/2">
              <IInput :label="t('Notes')" name="InputVoucherNumer" v-model="retrievalVoucher.notes"
                :type="EnumInputType.Text" />
            </IBasis>
          </IFlex>
          <IRow>
            <ICol>
              <van-button class="border-none duration-500 rounded-lg bg-create hover:bg-createHover" type="success"
                is-link @click="AddPopup()">{{ t("Item.Add") }}
              </van-button>
            </ICol>
          </IRow>
          <IRow>
            <ICol>
              <ITable :items="retrievalVoucher.Items" :headers="headers">
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
                  <van-button class="border-none duration-500 m-2 rounded-lg bg-create hover:bg-createHover"
                    type="success" is-link @click="updatePopup(rowIndex, row)">{{ t("Edit") }}
                  </van-button>
                  |
                  <van-button class="duration-500 rounded-lg m-2 bg-white hover:bg-deleteHover border-red-700 border-2"
                    is-link @click="deleteItem(rowIndex)">{{ t("Delete") }}
                  </van-button>
                </template>
              </ITable>
            </ICol>
          </IRow>
        </IForm>
      </IContainer>
    </IPageContent>
    <IContainer class="w-full">
      <van-popup class="overflow-hidden dark:bg-darkNav" v-model:show="showPop" round position="bottom">
        <!-- for search Item -->

        <IFlex class="p-2">
          <IBasis base="1/4">
            <div class="mb-1 md:text-sm text-base ml-2 font-bold dark:text-gray-300">
              {{ t("Item.Index") }}
            </div>
            <vSelect
              class="capitalize rounded-md border-2 p-2 dark:bg-gray-800 focus:outline-none focus:border focus:border-gray-700 text-gray-800 dark:text-gray-200 mb-10"
              v-model="VoucherItem.InputVoucherItem" :options="inputVoucherItemsVSelect"
              :reduce="(_item: IInputVoucherItem) => _item"
              :get-option-label="(_item: IInputVoucherItem) => _item.Item.name">
              <template #option="{ Item, outValue, inValue }">
                <div class="rtl:text-right border-2 p-2 rounded-md">
                  <div
                    class="rounded-md focus:outline-none focus:border focus:border-gray-700 dark:bg-gray-800 dark:text-gray-100 p-1 mb-1 font-bold">
                    {{ Item.name.toString() }}
                  </div>
                  <cite>
                    <div
                      class="rounded-md focus:outline-none focus:border focus:border-gray-400 bg-gray-500 text-gray-200 p-1 mb-1">
                      <b>{{ t("Code") }} :</b>{{ Item.code.toString() }}
                      <b>{{ t("Category") }} :</b>
                      {{ Item.Category.name.toString() }}
                    </div>
                    <div v-if="Item.serialNumber"
                      class="rounded-md focus:outline-none focus:border focus:border-gray-400 bg-gray-500 text-gray-200 p-1 mb-1">
                      <b>{{ t("SerialNumber") }} :</b>
                      {{ Item.serialNumber.toString() }}
                      <b>{{ t("Available") }} :</b>
                      {{ Number(inValue) - Number(outValue) }}
                    </div>
                    <div
                      class="rounded-md focus:outline-none focus:border focus:border-gray-400 bg-amber-800 text-gray-200 p-1 mb-1">
                      <b>{{ t("Item.Out") }} :</b> {{ Number(outValue) }}
                      <b>{{ t("Item.In") }} :</b> {{ Number(inValue) }}
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
          <IBasis base="3/4" v-if="VoucherItem.InputVoucherItem == null" class="border-2 border-dotted border-gray-600">
            <div class="w-full text-center align-middle border-gray-600">
              <div class="md:text-sm text-base ml-2 font-bold dark:text-gray-300 mt-auto mb-auto w-full">
                قم بأختيار مادة
              </div>
            </div>
          </IBasis>
          <IBasis base="3/4" v-else-if="VoucherItem.InputVoucherItem.Item?.Category.name != ''">
            <IFlex>
              <IBasis base="1/4">
                <ILabel :title="t('Code')">
                  {{ VoucherItem.InputVoucherItem.Item?.code }}</ILabel>
              </IBasis>
              <IBasis base="1/4">
                <ILabel :title="t('Category')">
                  {{ VoucherItem.InputVoucherItem.Item?.Category.name }}</ILabel>
              </IBasis>
              <IBasis base="1/2">
                <ILabel :title="t('Description')">
                  {{ VoucherItem.InputVoucherItem.Item?.description }}</ILabel>
              </IBasis>
            </IFlex>
          </IBasis>
          <IBasis base="3/4" v-else class="border-2 border-dotted border-gray-600">
            <div class="w-full text-center align-middle border-gray-600">
              <div class="md:text-sm text-base ml-2 font-bold dark:text-gray-300 mt-auto mb-auto w-full">
                قم بأختيار مادة
              </div>
            </div>
          </IBasis>
        </IFlex>

        <!-- for insert item proparties -->
        <IRow col-lg="4" col-xl="4" col-md="2" col-sm="1" col-xs="1" v-if="VoucherItem.InputVoucherItem != null">
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <IInput :label="t('Description')" v-model="VoucherItem.InputVoucherItem.description" />
          </ICol>
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <IInput :label="t('Count')" :on-input="ChangeValueTotal" :type="EnumInputType.Number"
              v-model="VoucherItem.count" :max="Number(VoucherItem.InputVoucherItem.inValue) -
                Number(VoucherItem.InputVoucherItem.outValue)
                " :min="1" />
          </ICol>
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <IInput :label="t('Price')" :on-input="ChangeValueTotal" :type="EnumInputType.Number"
              v-model="VoucherItem.InputVoucherItem.price" />
          </ICol>
          <ICol :span="1" span-lg="1" span-xl="1" span-md="1">
            <IInput :label="t('Total')" :type="EnumInputType.Number" v-model="VoucherItem.value" />
          </ICol>
          <ICol :span="2" :span-lg="2" :span-md="2" :span-xl="1">
            <IInput :label="t('Note')" :type="EnumInputType.Text" v-model="VoucherItem.notes" />
          </ICol>
        </IRow>
        <!-- buttons -->
        <IContainer class="flex flex-row my-10">
          <IButton2 :text="t('Add')" color="blue" :type="EnumButtonType.Default" :on-click="AddItem" v-if="IsAdd" />
          <IButton2 :text="t('Update')" color="blue" :type="EnumButtonType.Default" :on-click="EditItem" v-else />
          <IButton2 class="" pre-icon="close-box" :text="t('Close')" color="blue" :type="EnumButtonType.Text"
            :on-click="() => (showPop = false)" />
        </IContainer>
      </van-popup>
    </IContainer>
    <template #Footer>
      <IFooterCrud :isAdd="retrievalVoucher.id == 0" :onCreate="store" :onUpdate="update" :onDelete="Delete" />
    </template>
  </IPage>
</template>
