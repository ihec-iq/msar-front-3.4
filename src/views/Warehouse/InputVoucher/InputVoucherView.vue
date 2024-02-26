<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { usePermissionStore } from "@/stores/permissionStore";
import { useStockStore } from "@/stores/warehouse/stockStore";
import { useInputVoucherStore } from "@/stores/warehouse/inputVoucherStore";
import { useItemStore } from "@/stores/item/itemStore";
import type { IInputVoucherItem } from "@/types/IInputVoucher";
import { t } from "@/utils/I18nPlugin";
import type { IItem } from "@/types/IItem";
import AddItemPopup from "@/components/AddItemPopup.vue";
import { EnumPermission } from "@/utils/EnumSystem";
import { ITableHeader } from "@/types/core/components/ITable";

const { stocks } = storeToRefs(useStockStore());
const { items } = storeToRefs(useItemStore());
const { item } = storeToRefs(useItemStore());
//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
const namePage = ref("InputVoucherAdd");
const route = useRoute();
const id = ref(Number(route.params.id));
const rtlStore = useRtlStore();
const { is } = storeToRefs(rtlStore);

const inputVoucherStore = useInputVoucherStore();
const { inputVoucher, inputVoucherStates } = storeToRefs(
  useInputVoucherStore(),
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
  Stock: { name: "", id: 0 },
  serialNumber: "",
  count: 0,
  price: 0,
  value: 0,
  notes: "",
});
const AddPopup = () => {
  showPop.value = true;
  resetVoucherItemTemp();
};
const resetVoucherItemTemp = () => {
  IsAdd.value = true
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
    Stock: { id: 1, name: "" },
    serialNumber: "",
    count: 0,
    price: 0,
    value: 0,
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
  IsAdd.value = false;
  showPop.value = true;
  indexSelectedVoucherItem.value = index;
  VoucherItemTemp.value = item;
};
const AddItem = () => {
  VoucherItemTemp.value.value =
    VoucherItemTemp.value.count * VoucherItemTemp.value.price;
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
    VoucherItemTemp.value,
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
  errors.value = null;
  const formData = new FormData();
  formData.append("number", inputVoucher.value.number);
  formData.append("notes", inputVoucher.value.notes);
  formData.append("date", inputVoucher.value.date);
  formData.append("items", JSON.stringify(inputVoucher.value.Items));
  formData.append("State", JSON.stringify(inputVoucher.value.State));
  formData.append("requestedBy", inputVoucher.value.requestedBy);
  formData.append(
    "signaturePerson",
    String(inputVoucher.value.signaturePerson),
  );
  inputVoucherStore
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
  errors.value = null;
  const formData = new FormData();
  formData.append("number", inputVoucher.value.number);
  formData.append("notes", inputVoucher.value.notes);
  formData.append("date", inputVoucher.value.date);
  formData.append("items", JSON.stringify(inputVoucher.value.Items));
  formData.append("State", JSON.stringify(inputVoucher.value.State));
  formData.append("requestedBy", inputVoucher.value.requestedBy);
  formData.append(
    "signaturePerson",
    String(inputVoucher.value.signaturePerson),
  );
  inputVoucherStore
    .update(inputVoucher.value.id, formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
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
            "success",
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
const back = () => {
  router.back();
};

onMounted(async () => {
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
});
const handleEnter = (event: KeyboardEvent) => {
  const enteredValue = (event.target as HTMLInputElement).value;
  const matchingOption = items.value.find(
    (option: IItem) => option.name === enteredValue,
  );
  if (matchingOption === undefined && enteredValue.length > 0) {
    let btn = document.getElementById("my_modal_7");
    item.value.name = enteredValue;
    btn?.click();
  }
};
function clearSelected(event: { target: { value: string } }) {
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
      Stock: { name: "", id: 0 },
      serialNumber: "",
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
  { caption: t("Item"), value: "Item" },
  { caption: t("SerialNumber"), value: "serialNumber" },
  { caption: t("Count"), value: "count" },
  { caption: t("Price"), value: "price" },
  { caption: t("Total"), value: "Total" },
  { caption: t("Stock"), value: "Stock" },
  { caption: t("Notes"), value: "notes" },
  { caption: t("Details"), value: "Actions" },
]);
</script>

<template>
  <IPage :HeaderTitle="t(namePage)">
    <template #HeaderButtons>
      <IButton2 color="green" width="28" type="outlined" pre-icon="autorenew" :onClick="reset" :text="t('New')" />
    </template>
    <IPageContent>
      <IRow>
        <IForm>
          <IRow col-lg="4" col-md="2" col-sm="1">
            <ICol span="3" span-md="2" span-sm="1">
              <IInput :label="t('Name')" name="Name" v-model="inputVoucher.number" type="text" />
            </ICol>
            <ICol span="3" span-md="2" span-sm="1">
              <IInput :label="t('Date')" name="InputVoucherNumer" v-model="inputVoucher.date" type="date" />
            </ICol>
            <ICol span="3" span-md="2" span-sm="1">
              <ISelect :label="t('Section')" v-model="inputVoucher.State.id" name="inputVoucherStateId"
                :options="inputVoucherStates" :IsRequire="true" />
            </ICol>
            <ICol span="3" span-md="2" span-sm="1">
              <IInput :label="t('InputVoucherEmployeeRequest')" name="InputVoucherNumer"
                v-model="inputVoucher.requestedBy" type="text" />
            </ICol>
            <ICol span="3" span-md="2" span-sm="1">
              <IInput :label="t('InputVoucherSignaturePerson')" name="InputVoucherNumer"
                v-model="inputVoucher.signaturePerson" type="text" />
            </ICol>
          </IRow>
          <IRow>
            <ICol>
              <IInput :label="t('Notes')" name="InputVoucherNumer" v-model="inputVoucher.notes" type="text" />
            </ICol>
          </IRow>
          <IRow>
            <ICol>
              <van-button class="border-none duration-500 rounded-lg bg-create hover:bg-createHover" type="primary"
                is-link @click="AddPopup()">Add Items
              </van-button>
            </ICol>
          </IRow>
          <IRow>
            <ICol>
              <ITable :items="inputVoucher.Items" :headers="headers">
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
      </IRow>
      <IRow>
        <ICol>
          <div class="mt-10 p-6">
            <div class="w-full mx-2">
              <van-popup class="bg-content flex" v-model:show="showPop" round position="bottom"
                :style="{ height: '60%' }">
                <div class="flex flex-col overflow-hidden w-full">
                  <div class="flex justify-around w-full mt-4 ml-6">
                    <div class="w-1/5 md:w-1/4 sm:w-1/1">
                      <div class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300">
                        {{ t('Item') }}
                      </div>
                      <vSelect
                        class="capitalize mx-2 rounded-md w-[93%] h-10  bg-gray-800 focus:outline-none focus:border focus:border-gray-700 text-gray-300 p-2 mb-10"
                        v-model="VoucherItemTemp.Item" :options="items" :reduce="(_item: IItem) => _item"
                        :get-option-label="(_item: IItem) => _item.name" @keydown.enter="handleEnter"
                        @input="clearSelected" :create-option="(_item: IItem) => ({
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
                          ">
                        <template #option="{ code, Category, description, name }">
                          <div
                            class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-100 p-1 mb-1 font-bold">
                            {{ name }}
                          </div>
                          <cite>
                            <div
                              class="rounded-md focus:outline-none focus:border focus:border-gray-400 bg-gray-500 text-gray-200 p-1 mb-1">
                              {{ t('Code') }}: {{ code }}
                            </div>
                            <div
                              class="rounded-md focus:outline-none focus:border focus:border-gray-400 bg-gray-500 text-gray-200 p-1 mb-1">
                              {{ t('Category') }}: {{ Category.name }}
                            </div>
                          </cite>
                          <br />
                          <cite>
                            {{ description }}
                          </cite>
                        </template>
                      </vSelect>
                      <!-- Put this part before </body> tag -->
                      <AddItemPopup :setItem="setItemFromChild"></AddItemPopup>
                    </div>
                    <div class="w-4/5  md:w-4/4 sm:w-1/1 rounded-md border-2 border-gray-600 flex " v-if="VoucherItemTemp.Item">
                      <div class="w-1/5" v-if="VoucherItemTemp.Item.code">
                        <div class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300">
                          {{ t('Code') }}
                        </div>
                        <div
                          class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 m-2 font-bold">
                          {{ VoucherItemTemp.Item.code }}
                        </div>
                      </div>
                      <div class="w-1/5">
                        <div class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300">
                          {{ t('Category') }}
                        </div>
                        <div
                          class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 m-2 font-bold">
                          {{ VoucherItemTemp.Item.Category.name }}
                        </div>
                      </div>
                      <div class="w-3/5" v-if="VoucherItemTemp.Item.description">
                        <div class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300">
                          {{ t('Description') }}
                        </div>
                        <div
                          class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 m-2 font-bold">
                          {{ VoucherItemTemp.Item.description }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex justify-around w-full mt-4 ml-6">
                    <div class="w-1/5">
                      <div class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300">
                        {{ t('Stock') }}
                      </div>
                      <select v-model="VoucherItemTemp.Stock"
                        class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight">
                        <option v-for="stock in stocks" :key="stock.id" :value="stock"
                          class="bg-lightInput dark:bg-input text-text dark:text-textLight">
                          {{ stock.name }}
                        </option>
                      </select>
                    </div>
                    <div class="w-1/5">
                      <div class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300">
                        {{ t('SerialNumber') }}
                      </div>
                      <input v-model="VoucherItemTemp.serialNumber" type="text"
                        class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold" />
                    </div>
                    <div class="w-1/5">
                      <div class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300">
                        {{ t('Count') }}
                      </div>
                      <input @input="ChangeValueTotal()" v-model="VoucherItemTemp.count" type="number"
                        class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold" />
                    </div>
                    <div class="w-1/5">
                      <div class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300">
                        {{ t('Price') }}
                      </div>
                      <input @input="ChangeValueTotal()" v-model="VoucherItemTemp.price" type="number"
                        class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold" />
                    </div>
                    <div class="w-1/5">
                      <div class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300">
                        {{ t('Total') }}
                      </div>
                      <input v-model="VoucherItemTemp.value" type="number"
                        class="rounded-md disabled focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold" />
                    </div>
                  </div>
                </div>
                <!-- add close form -->
                <div class="w-full p-2 rounded-lg flex items-center fixed bottom-1 right-3">
                  <div class="flex justify-between">
                    <div class="items-center ml-2">{{ IsAdd }}
                      <button v-if="IsAdd" @click="AddItem()"
                        class="bg-create hover:bg-createHover duration-500 h-10 w-32 rounded-lg text-gray-300">
                        {{ t('Add') }}
                      </button>
                      <button v-else @click="EditItem()"
                        class="bg-update hover:bg-updateHover ml-2 duration-500 h-10 w-32 rounded-lg text-gray-300"
                        is-link>
                        {{ t('Update') }}
                      </button>
                    </div>
                    <van-button
                      class="ml-4 border-none left-0 bg-back duration-500 h-10 w-32 text-gray-300 hover:bg-backHover rounded-lg"
                      type="primary" is-link @click="showPop = false">{{ t('Close') }}</van-button>
                  </div>
                </div>
                <div class="outer w-px h-full m-auto relative overflow-hidden ml-2">
                  <div class="inner absolute w-full h-3/5 bg-gray-500 top-[20%]"></div>
                </div>
              </van-popup>
            </div>
          </div>
        </ICol>
      </IRow>
    </IPageContent>

    <template #Footer>
      <IFooterCrud :isAdd="inputVoucher.id == 0" :onCreate="store" :onUpdate="update" :onDelete="Delete" />
    </template>
  </IPage>
</template>
