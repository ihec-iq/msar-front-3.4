<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { usePermissionStore } from "@/stores/permission";
import { useStockStore } from "@/stores/voucher/stock";
import { useOutputVoucherStore } from "@/stores/voucher/outputVoucher";
import { useInputVoucherStore } from "@/stores/voucher/inputVoucher";
import type { IOutputVoucherItem } from "@/types/IOutputVoucher";
import { useI18n } from "@/stores/i18n/useI18n";
import type { IInputVoucherItem } from "@/types/IInputVoucher";
const { t } = useI18n();
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
  console.log("updatePopup");
  console.log(itemX);
  console.log(VoucherItem.value);
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
const store = () => {
  errors.value = null;
  const formData = new FormData();
  formData.append("number", outputVoucher.value.number.toString());
  formData.append("notes", outputVoucher.value.notes.toString());
  formData.append("date", outputVoucher.value.date.toString());
  formData.append("items", JSON.stringify(outputVoucher.value.items));
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
  formData.append("items", JSON.stringify(outputVoucher.value.items));
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
        outputVoucher.value.items = response.data.data.items;
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
const back = () => {
  router.back();
};

onMounted(async () => {
  checkPermissionAccessArray(["show Item"]);
  await outputVoucherStore.getEmployees().then(() => {});
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = t("OutputVoucher");
    outputVoucher.value.id = 0;
    outputVoucher.value.date = new Date().toISOString().split("T")[0];
  } else {
    outputVoucher.value.id = id.value;
    await showData(id.value);
    namePage.value = t("OutputVoucher");
  }
  await useStockStore().get_stocks();
  await useInputVoucherStore().getItemsVSelect();
});

//#region // selectInputItem2
// const vSelectValue = ref<IInputVoucherItem>({
//   item: {
//     id: 0,
//     name: "",
//     code: "",
//     description: "",
//     itemCategory: {
//       id: 0,
//       name: "",
//     },
//     measuringUnit: "",
//   },
//   stock: {
//     id: 0,
//     name: "",
//   },
//   serialNumber: "",
//   count: 0,
//   price: 0,
//   value: 0,
// });
// function selectInputItem2() {
//   console.log(vSelectValue.value);
//   VoucherItem.value.inputVoucherItem = {
//     id: vSelectValue.value.id,
//     input_voucher_id: 0,
//     item: {
//       id: 0,
//       name: vSelectValue.value.itemName,
//       code: String(vSelectValue.value.code),
//       description: String(vSelectValue.value.notes),
//       itemCategory: {
//         id: 0,
//         name: String(vSelectValue.value.itemCategory),
//       },
//       measuringUnit: "",
//       itemCategoryId: 0,
//     },
//     itemId: 0,
//     stock: {
//       id: 0,
//       name: String(vSelectValue.value.stockName),
//     },
//     stockId: 0,
//     serialNumber: String(vSelectValue.value.serialNumber),
//     count:
//       Number(vSelectValue.value.inValue) - Number(vSelectValue.value.outValue),
//     price: Number(vSelectValue.value.price),
//     value: Number(vSelectValue.value.price),
//     notes: String(vSelectValue.value.notes),
//   };
// }

// watch(
//   () => vSelectValue.value,
//   () => {
//     selectInputItem2();
//   }
// );
//#endregion
</script>
<template>
  <PageTitle> {{ namePage }}</PageTitle>
  <div class="w-full">
    <div class="w-full p-6 grid lg:grid-cols-4 xs:grid-cols-2">
      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("OutputVoucherNumber") }}
        </div>
        <input
          v-model="outputVoucher.number"
          type="text"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightOutput dark:bg-input text-text dark:text-textLight"
        />
      </div>
      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("Date") }}
        </div>
        <input
          v-model="outputVoucher.date"
          type="date"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightOutput dark:bg-input text-text dark:text-textLight"
        />
      </div>
      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("OutputVoucherEmployeeRequest") }}
        </div>
        <select
          v-model="outputVoucher.Employee.id"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightOutput dark:bg-input text-text dark:text-textLight"
        >
          <option
            v-for="employee in outputVoucherEmployees"
            :key="employee.id"
            :value="employee.id"
            class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightOutput dark:bg-input text-text dark:text-textLight"
          >
            {{ employee.name }}
          </option>
        </select>
      </div>
      <div class="w-11/12 mx-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("OutputVoucherSignaturePerson") }}
        </div>
        <input
          v-model="outputVoucher.signaturePerson"
          type="text"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightOutput dark:bg-input text-text dark:text-textLight"
        />
      </div>
    </div>
    <div class="mt-10 p-6">
      <div class="w-full mx-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("Description") }}
        </div>
        <quill-editor
          v-model:content="outputVoucher.notes"
          contentType="html"
          class="text-text dark:text-textLight bg-lightOutput dark:bg-input h-60 custom-quill"
        ></quill-editor>
      </div>
    </div>
    <div class="mt-10 p-6">
      <div class="w-11/12 mx-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        ></div>
        <van-button
          class="border-none duration-500 rounded-lg bg-create hover:bg-createHover"
          type="primary"
          is-link
          @click="AddPopup()"
          >Add Items
        </van-button>
      </div>
    </div>
    <div class="mt-10 p-6">
      <div class="w-12/12 mx-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        ></div>
        <table class="min-w-full text-center">
          <thead class="border-b bg-[#0003] text-gray-300">
            <tr>
              <th scope="col" class="text-sm font-medium px-2 py-2">ID</th>
              <th scope="col" class="text-sm font-medium px-6 py-4">item</th>
              <th scope="col" class="text-sm font-medium px-6 py-4">
                Serial Number
              </th>
              <th scope="col" class="text-sm font-medium px-6 py-4">Count</th>
              <th scope="col" class="text-sm font-medium px-6 py-4">Price</th>
              <th scope="col" class="text-sm font-medium px-6 py-4">Total</th>
              <th scope="col" class="text-sm font-medium px-6 py-4">Stock</th>
              <th scope="col" class="text-sm font-medium px-6 py-4">Notes</th>
              <th scope="col" class="text-sm font-medium px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-[#1f2937]">
            <tr
              v-for="(row, index) in outputVoucher.items"
              :key="row.id"
              class="border-b border-black h-14 text-gray-100"
            >
              <th>{{ row.id }}</th>
              <th>{{ row.Item?.name }}</th>
              <th>{{ row.serialNumber }}</th>
              <th>{{ row.count }}</th>
              <th>{{ row.price.toLocaleString() }}</th>
              <th>{{ (row.count * row.price).toLocaleString() }}</th>
              <th>{{ row.Stock.name }}</th>
              <th>{{ row.notes }}</th>
              <th>
                <van-button
                  class="border-none duration-500 rounded-lg bg-create hover:bg-createHover"
                  type="secondary"
                  is-link
                  @click="updatePopup(index, row)"
                  >Edit
                </van-button>
                |
                <van-button
                  class="border-none duration-500 rounded-lg bg-delete hover:bg-deleteHover"
                  type="secondary"
                  is-link
                  @click="deleteItem(index)"
                  >Delete
                </van-button>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="mt-10 p-6">
      <div class="w-full mx-2">
        <van-popup
          class="bg-content flex"
          v-model:show="showPop"
          round
          position="bottom"
          :style="{ height: '60%' }"
        >
          <!-- <van-button type="primary" is-link @click="show=false">Close</van-button> -->

          <div class="text-gray-300 my-5 pl-8 text-xl">Bill Sale Info</div>
          <div class="flex flex-col overflow-hidden w-full">
            <div class="flex justify-around w-full mt-4 ml-6">
              <div class="w-1/5">
                <div
                  class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300"
                >
                  Item
                </div>
                <!-- v-model="VoucherItem.inputVoucherItem" -->
                <vSelect
                  class="capitalize dir-rtl mx-2 rounded-md h-10 bg-gray-800 focus:outline-none focus:border focus:border-gray-700 text-gray-300 p-2 mb-10"
                  :options="inputVoucherItemsVSelect"
                  :reduce="(_item: IInputVoucherItem) => _item"
                  :get-option-label="(_item: IInputVoucherItem) => _item.Item.name"
                  :create-option="(_item: IInputVoucherItem) => _item"
                  v-model="VoucherItem.inputVoucherItem"
                >
                  <template #option="_item">
                    <div
                      class="rounded-md text-right focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-100 p-1 mb-1 font-bold"
                    >
                      {{ _item.Item.name.toString() }}
                    </div>
                    <cite class="text-right">
                      <div
                        class="rounded-md focus:outline-none focus:border focus:border-gray-600 bg-gray-700 text-gray-200 p-1 mb-1"
                      >
                        {{ t("ItemCode") }}: {{ _item.Item.code.toString() }}
                      </div>
                      <div
                        class="rounded-md focus:outline-none focus:border focus:border-gray-600 bg-gray-700 text-gray-200 p-1 mb-1"
                      >
                        {{ t("ItemCategory") }}:
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
                  </template>
                </vSelect>
              </div>
              <div
                class="w-4/5 rounded-md border-2 border-gray-600 flex"
                v-if="String(VoucherItem.Item?.name).length > 0"
              >
                <div class="w-1/5" v-if="VoucherItem.Item?.code">
                  <div
                    class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300"
                  >
                    Code
                  </div>
                  <div
                    class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 m-2 font-bold"
                  >
                    {{ VoucherItem.Item.code.toString() }}
                  </div>
                </div>
                <div class="w-1/5">
                  <div
                    class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300"
                  >
                    Category
                  </div>
                  <div
                    class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 m-2 font-bold"
                  >
                    {{ String(VoucherItem.Item?.Category.name) }}
                  </div>
                </div>
                <div class="w-2/5" v-if="VoucherItem.Item?.description">
                  <div
                    class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300"
                  >
                    Description
                  </div>
                  <div
                    class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 m-2 font-bold"
                  >
                    {{ VoucherItem.Item?.description }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-around w-full mt-4 ml-6">
              <div class="w-1/5">
                <div
                  class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300"
                >
                  Stock
                </div>
                <input
                  :value="VoucherItem.inputVoucherItem?.Stock.name"
                  type="text"
                  class="rounded-md focus:outline-none disabled focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold"
                />
              </div>
              <div class="w-1/5">
                <div
                  class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300"
                >
                  Serial Number
                </div>
                <input
                  :value="VoucherItem.inputVoucherItem?.serialNumber"
                  type="text"
                  class="rounded-md focus:outline-none disabled focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold"
                />
              </div>
              <div class="w-1/5">
                <div
                  class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300"
                >
                  Count
                </div>
                <input
                  @input="ChangeValueTotal()"
                  v-model="VoucherItem.count"
                  :max="
                    Number(VoucherItem.inputVoucherItem?.inValue) -
                    Number(VoucherItem.inputVoucherItem?.outValue)
                  "
                  min="1"
                  type="number"
                  class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold"
                />
              </div>
              <div class="w-1/5">
                <div
                  class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300"
                >
                  Price
                </div>
                <input
                  @input="ChangeValueTotal()"
                  :value="VoucherItem.inputVoucherItem?.price"
                  type="number"
                  class="rounded-md focus:outline-none disabled focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold"
                />
              </div>
              <div class="w-1/5">
                <div
                  class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300"
                >
                  Total
                </div>
                <input
                  :value="VoucherItem.value"
                  type="number"
                  class="rounded-md disabled focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold"
                />
              </div>
            </div>
            <div class="flex justify-around w-full mt-4 ml-6">
              <div class="w-full">
                <div
                  class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300"
                >
                  Notes
                </div>
                <div
                  class="rounded-md w-full focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 m-2 font-bold"
                >
                  <textarea
                    v-model="VoucherItem.notes"
                    class="rounded-md w-full focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <!-- add close form -->
          <div
            class="w-full p-2 rounded-lg flex items-center fixed bottom-1 right-3"
          >
            <div class="flex justify-between">
              <div class="items-center ml-2">
                <button
                  v-if="VoucherItem.id == 0"
                  @click="AddItem()"
                  class="bg-create hover:bg-createHover duration-500 h-10 w-32 rounded-lg text-gray-300"
                >
                  Add
                </button>
                <button
                  v-else
                  @click="EditItem()"
                  class="bg-update hover:bg-updateHover ml-2 duration-500 h-10 w-32 rounded-lg text-gray-300"
                  is-link
                >
                  Update
                </button>
              </div>
              <van-button
                class="ml-4 border-none left-0 bg-back duration-500 h-10 w-32 text-gray-300 hover:bg-backHover rounded-lg"
                type="primary"
                is-link
                @click="showPop = false"
                >Close</van-button
              >
            </div>
          </div>

          <!-- vr line -->
          <div class="outer w-px h-full m-auto relative overflow-hidden ml-2">
            <div
              class="inner absolute w-full h-3/5 bg-gray-500 top-[20%]"
            ></div>
          </div>

          <!-- filters -->

          <!-- <div
            class="w-1/5 mt-1 ml-2 flex flex-col items-center overflow-hidden"
          >
            <div class="text-gray-300 my-5 pl-8 text-xl">Filter</div>
            <div>
              <div class="ml-3 text-gray-300">Customer Name</div>
              <vSelect
                class="capitalize mx-2 rounded-md h-10 w-56 bg-gray-800 focus:outline-none focus:border focus:border-gray-700 text-gray-300 p-2 mb-10"
                v-model="selectedFilterId"
                label="first_name"
                :options="customerFilterStore.customerDataFilter"
                :reduce="(filter: ICustomer) => filter.id"
              >
              </vSelect>
            </div>
            <div>
              <div class="ml-3 text-gray-300">Phone</div>
              <vSelect
                class="capitalize mx-2 rounded-md h-10 w-56 bg-gray-800 focus:outline-none focus:border focus:border-gray-700 text-gray-300 p-2 mb-10"
                v-model="selectedFilterId"
                label="phone1"
                :options="customerFilterStore.customerDataFilter"
                :reduce="(filter: ICustomer) => filter.id"
              >
              </vSelect>
            </div>
            <div>
              <div class="ml-3 text-gray-300">Passport</div>
              <vSelect
                class="capitalize mx-2 rounded-md h-10 w-56 bg-gray-800 focus:outline-none focus:border focus:border-gray-700 text-gray-300 p-2 mb-10"
                v-model="selectedFilterId"
                label="passport"
                :options="customerFilterStore.customerDataFilter"
                :reduce="(filter: ICustomer) => filter.id"
              >
              </vSelect>
            </div>
          </div> -->
        </van-popup>
      </div>
    </div>
    <!-- bottom tool bar -->
    <div
      :class="{
        'lg:w-[99.2%] xs:w-[97%] lg:mx-2 xs:mx-2 bottom': is,
        'lg:w-[95%] md:w-[90%] xs:w-[75%] lg:mr-0 ltr:xs:ml-3 rtl:xs:mr-3 bottom':
          !is,
      }"
      class="dark:bg-bottomTool duration-700 bg-ideNavLight p-2 rounded-lg flex items-center justify-end fixed bottom-0 print:hidden"
    >
      <div class="flex ltr:ml-8 rtl:mr-8">
        <div class="items-center mr-3">
          <button
            v-if="outputVoucher.id == 0"
            @click="store()"
            class="bg-create hover:bg-createHover ml-1 duration-500 h-10 lg:w-32 xs:w-20 rounded-lg text-white"
          >
            {{ t("Create") }}
          </button>
          <button
            v-else
            @click="update()"
            class="bg-update hover:bg-updateHover ml-1 duration-500 h-10 lg:w-32 xs:w-20 rounded-lg text-white"
          >
            {{ t("Update") }}
          </button>
          <button
            v-if="outputVoucher.id != 0"
            @click="Delete()"
            class="bg-delete hover:bg-deleteHover duration-500 h-10 lg:w-32 xs:w-20 rounded-lg text-white ml-2"
          >
            {{ t("Delete") }}
          </button>
        </div>
      </div>
    </div>
    <div
      :class="{
        'ltr:left-4 rtl:right-4': is,
        'ltr:left-28 rtl:right-28': !is,
      }"
      class="backBtn z-10 fixed bottom-2 lg:ml-3 xs:ml-0 print:hidden"
    >
      <button
        @click="back()"
        class="bg-back hover:bg-backHover h-10 duration-500 lg:w-32 xs:w-20 p-2 rounded-md text-white"
      >
        {{ t("Back") }}
      </button>
    </div>
    <!-- end bottom tool -->
  </div>
</template>
<style scoped>
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

.custom-quill .ql-editor {
  direction: rtl !important;
  text-align: right !important;
}
</style>
