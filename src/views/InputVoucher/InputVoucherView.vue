<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { usePermissionStore } from "@/stores/permission";
import { useStockStore } from "@/stores/Voucher/stock";
import { useInputVoucherStore } from "@/stores/Voucher/inputVoucher";
import { useItemStore } from "@/stores/Item/item";
import type {
  IInputVoucher,
  IInputVoucherEmployee,
  IInputVoucherFilter,
  IInputVoucherItem,
  IInputVoucherState,
} from "@/types/IInputVoucher";
import { useI18n } from "@/stores/i18n/useI18n";
import type { IItem } from "@/types/IItem";
const { t } = useI18n();
const { stocks } = storeToRefs(useStockStore());
const { items } = storeToRefs(useItemStore());

//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
const namePage = ref(".....");
const route = useRoute();
const id = ref(Number(route.params.id));
const rtlStore = useRtlStore();
const { is } = storeToRefs(rtlStore);

const inputVoucherStore = useInputVoucherStore();
const { inputVoucher, inputVoucherStates, inputVoucherEmployees } = storeToRefs(
  useInputVoucherStore()
);
//#region popUp
const showPop = ref(false);
const VoucherItem = ref<IInputVoucherItem>({
  id: 0,
  input_voucher_id: 0,
  item: {
    name: "",
    id: 0,
    code: "",
    description: "",
    itemCategory: { id: 0, name: "" },
    measuringUnit: "",
  },
  stock: { name: "", id: 0 },
  serialNumber: "",
  count: 0,
  price: 0,
  value: 0,
  notes: "",
});
const AddPopup = () => {
  showPop.value = true;
  VoucherItem.value = {
    id: 0,
    input_voucher_id: 0,
    item: {
      name: "",
      id: 0,
      code: "",
      description: "",
      itemCategory: { id: 0, name: "" },
      measuringUnit: "",
    },
    stock: { name: "", id: 0 },
    serialNumber: "",
    count: 0,
    price: 0,
    value: 0,
    notes: "",
  };
};
const ItemTemp = ref<IItem>({
  id: 0,
  name: "",
  code: "",
  description: "",
  itemCategory: { id: 0, name: "" },
  measuringUnit: "",
});
const deleteItem = (index: number) => {
  //showPop.value = true;
  inputVoucherStore.removeItem(index);
};
const updatePopup = (item: IInputVoucherItem) => {
  showPop.value = true;
  VoucherItem.value = item;
};
const AddItem = () => {
  VoucherItem.value.value = VoucherItem.value.count * VoucherItem.value.price;
  //VoucherItem.value.item = ItemTemp.value;
  console.log(VoucherItem.value.item);
  inputVoucherStore.addItem(VoucherItem.value);
  showPop.value = false;
};
//#endregion

const Loading = ref(false);

const router = useRouter();
const errors = ref<String | null>();
//#endregion
//#region CURD
const store = () => {
  errors.value = null;
  const formData = new FormData();
  formData.append("number", inputVoucher.value.number.toString());
  formData.append("notes", inputVoucher.value.notes.toString());
  formData.append("date", inputVoucher.value.date.toString());
  formData.append(
    "inputVoucherStateId",
    inputVoucher.value.inputVoucherStateId.toString()
  );
  formData.append(
    "employeeRequestId",
    inputVoucher.value.employeeRequestId.toString()
  );
  formData.append(
    "signaturePerson",
    String(inputVoucher.value.signaturePerson)
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
  formData.append("number", inputVoucher.value.number.toString());
  formData.append("notes", inputVoucher.value.notes.toString());
  formData.append("date", inputVoucher.value.date.toString());
  formData.append(
    "inputVoucherStateId",
    inputVoucher.value.inputVoucherStateId.toString()
  );
  formData.append(
    "employeeRequestId",
    inputVoucher.value.employeeRequestId.toString()
  );
  formData.append(
    "signaturePerson",
    String(inputVoucher.value.signaturePerson)
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
        console.log(response.data.data);
        inputVoucher.value.id = response.data.data.id;
        inputVoucher.value.date = response.data.data.date;
        inputVoucher.value.number = response.data.data.number;
        inputVoucher.value.notes = response.data.data.notes;
        inputVoucher.value.items = response.data.data.items;
        inputVoucher.value.employeeRequest = response.data.data.employeeRequest;
        inputVoucher.value.employeeRequestId =
          response.data.data.employeeRequestId;
        inputVoucher.value.signaturePerson = response.data.data.signaturePerson;
        inputVoucher.value.inputVoucherStateId = response.data.data.state.id;
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
  router.push({
    name: "inputVoucherIndex",
  });
};
onMounted(async () => {
  //console.log(can("show items1"));
  checkPermissionAccessArray(["show Item"]);
  await inputVoucherStore.getState();
  await inputVoucherStore.getEmployees();
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = t("InputVoucher");
    inputVoucher.value.id = 0;
  } else {
    inputVoucher.value.id = id.value;
    await showData(id.value);
    namePage.value = t("InputVoucher");
  }
  await useStockStore().get_stocks();
  await useItemStore().get_items();
});
</script>
<template>
  <PageTitle> {{ namePage }}</PageTitle>

  <div class="w-full">
    <div class="w-full p-6 grid lg:grid-cols-4 xs:grid-cols-2">
      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("InputVoucherNumber") }}
        </div>
        <input
          v-model="inputVoucher.number"
          type="text"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
        />
      </div>
      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("Date") }}
        </div>
        <input
          v-model="inputVoucher.date"
          type="date"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
        />
      </div>
      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("ItemCategory") }}
        </div>
        <select v-model="inputVoucher.inputVoucherStateId" class="p-2">
          <option
            v-for="state in inputVoucherStates"
            :key="state.id"
            :value="state.id"
          >
            {{ state.name }}
          </option>
        </select>
      </div>
      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("InputVoucherEmployeeRequest") }}
        </div>
        <select v-model="inputVoucher.employeeRequestId" class="p-2">
          <option
            v-for="employee in inputVoucherEmployees"
            :key="employee.id"
            :value="employee.id"
          >
            {{ employee.name }}
          </option>
        </select>
      </div>
      <div class="w-11/12 mx-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("InputVoucherSignaturePerson") }}
        </div>
        <input
          v-model="inputVoucher.signaturePerson"
          type="text"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
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
          v-model:content="inputVoucher.notes"
          contentType="html"
          class="text-text dark:text-textLight bg-lightInput dark:bg-input h-60 custom-quill"
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
              <th scope="col" class="text-sm font-medium px-6 py-4">count</th>
              <th scope="col" class="text-sm font-medium px-6 py-4">Price</th>
              <th scope="col" class="text-sm font-medium px-6 py-4">Total</th>
              <th scope="col" class="text-sm font-medium px-6 py-4">Stock</th>
              <th scope="col" class="text-sm font-medium px-6 py-4">Notes</th>
              <th scope="col" class="text-sm font-medium px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-[#1f2937]">
            <tr
              v-for="(row, index) in inputVoucher.items?.slice().reverse()"
              :key="row.id"
              class="border-b border-black h-14 text-gray-100"
            >
              <th>{{ row.id }}</th>
              <th>{{ row.item.name }}</th>
              <th>{{ row.serialNumber }}</th>
              <th>{{ row.count }}</th>
              <th>{{ row.price }}</th>
              <th>{{ row.value }}</th>
              <th>{{ row.stock.name }}</th>
              <th>{{ row.notes }}</th>
              <th>
                <van-button
                  class="border-none duration-500 rounded-lg bg-create hover:bg-createHover"
                  type="secondary"
                  is-link
                  @click="AddPopup()"
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
                <vSelect
                  class="capitalize mx-2 rounded-md h-10 w-56 bg-gray-800 focus:outline-none focus:border focus:border-gray-700 text-gray-300 p-2 mb-10"
                  v-model="VoucherItem.item"
                  label="name"
                  :options="items"
                  :reduce="(item: IItem) => item"
                >
                </vSelect>
              </div>
              <div class="w-4/5 rounded-md border-2 border-gray-600 flex">
                <div class="w-1/5">
                  <div
                    class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300"
                  >
                    Code
                  </div>
                  <input
                    v-model="VoucherItem.item.code"
                    type="text"
                    class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold"
                  />
                </div>
                <div class="w-1/5">
                  <div
                    class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300"
                  >
                    Category
                  </div>
                  <input
                    v-model="VoucherItem.item.itemCategory.name"
                    type="text"
                    class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold"
                  />
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
                <select v-model="VoucherItem.stock" class="p-2">
                  <option
                    v-for="stock in stocks"
                    :key="stock.id"
                    :value="stock"
                  >
                    {{ stock.name }}
                  </option>
                </select>
              </div>
              <div class="w-1/5">
                <div
                  class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300"
                >
                  Serial Number
                </div>
                <input
                  v-model="VoucherItem.serialNumber"
                  type="text"
                  class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold"
                />
              </div>
              <div class="w-1/5">
                <div
                  class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300"
                >
                  Count
                </div>
                <input
                  v-model="VoucherItem.count"
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
                  v-model="VoucherItem.price"
                  type="number"
                  class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold"
                />
              </div>
              <div class="w-1/5">
                <div
                  class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300"
                >
                  Total
                </div>
                <input
                  v-model="VoucherItem.value"
                  type="number"
                  class="rounded-md disabled focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold"
                />
              </div>
            </div>
          </div>
          <!-- add close form -->
          <div
            class="w-full p-2 rounded-lg flex justify-between items-center fixed bottom-1 right-3"
          >
            <van-button
              class="ml-4 border-none bg-back duration-500 h-10 w-32 text-gray-300 hover:bg-backHover rounded-lg"
              type="primary"
              is-link
              @click="showPop = false"
              >Close</van-button
            >
            <div class="flex">
              <div class="items-center ml-2">
                <button
                  @click="AddItem()"
                  class="bg-create hover:bg-createHover duration-500 h-10 w-32 rounded-lg text-gray-300"
                >
                  Add
                </button>
                <button
                  @click="console.log('update')"
                  class="bg-update hover:bg-updateHover ml-2 duration-500 h-10 w-32 rounded-lg text-gray-300"
                  is-link
                >
                  Update
                </button>
              </div>
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
            v-if="inputVoucher.id == 0"
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
            v-if="inputVoucher.id != 0"
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
