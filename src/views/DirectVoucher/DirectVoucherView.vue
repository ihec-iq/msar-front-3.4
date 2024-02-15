<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { usePermissionStore } from "@/stores/permissionStore";
import { useDirectVoucherStore } from "@/stores/voucher/directVoucher";
import type { IDirectVoucherItem } from "@/types/IDirectVoucher";
import { t } from "@/utils/I18nPlugin";
const { directVoucherItemsVSelect } = storeToRefs(useDirectVoucherStore());
const directVoucherStore = useDirectVoucherStore();
const { directVoucher, directVoucherEmployees } = storeToRefs(useDirectVoucherStore());
//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
const namePage = ref(".....");
const route = useRoute();
const id = ref(Number(route.params.id));
const rtlStore = useRtlStore();
const { is } = storeToRefs(rtlStore);
const Loading = ref(false);
const router = useRouter();
const errors = ref<String | null>();
//#endregion

//#region popUp
const showPop = ref(false);
const VoucherItem = ref<IDirectVoucherItem>({
  id: 0,
  item: "",
  serialNumber: "",
  count: 1,
  price: 0,
  value: 0,
  notes: "",
  Employee: { id: 1, name: "" },
});
const AddPopup = () => {
  showPop.value = true;
  resetVoucherItem();
};
const resetVoucherItem = () => {
  IsUpdateItem.value = false;
  indexSelectedVoucherItem.value = 0;
  VoucherItem.value = {
    id: 0,
    item: "",
    serialNumber: "",
    count: 1,
    price: 0,
    value: 0,
    notes: "",
    Employee: { id: 1, name: "" },
  };
};
//#endregion
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
        directVoucherStore.removeItem(index);
      }
    });
};
const IsUpdateItem = ref(false);
const updatePopup = (index: number, itemX: IDirectVoucherItem) => {
  IsUpdateItem.value = true;
  showPop.value = true;
  indexSelectedVoucherItem.value = index;
  VoucherItem.value = itemX;
};
const AddItem = () => {
  ChangeValueTotal();
  directVoucherStore.addItem(VoucherItem.value);
  resetVoucherItem();
  showPop.value = false;
};
const ChangeValueTotal = () => {
  VoucherItem.value.value = VoucherItem.value.count * VoucherItem.value.price;
};
const indexSelectedVoucherItem = ref(0);
const EditItem = () => {
  ChangeValueTotal();
  directVoucherStore.editItem(indexSelectedVoucherItem.value, VoucherItem.value);
  resetVoucherItem();
  showPop.value = false;
};

// const handleEnter = (event: KeyboardEvent) => {
//   const enteredValue = (event.target as HTMLInputElement).value;
//   VoucherItem.value.item = enteredValue;
// };

//#region CURD
const store = () => {
  errors.value = null;
  const formData = new FormData();
  formData.append("number", directVoucher.value.number.toString());
  formData.append("notes", directVoucher.value.notes.toString());
  formData.append("date", directVoucher.value.date.toString());
  formData.append("items", JSON.stringify(directVoucher.value.Items));
  formData.append("employeeRequestId", directVoucher.value.Employee.id.toString());
  formData.append("signaturePerson", String(directVoucher.value.signaturePerson));
  directVoucherStore
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
      errors.value = directVoucherStore.getError(error);
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
  formData.append("number", directVoucher.value.number.toString());
  formData.append("notes", String(directVoucher.value.notes));
  formData.append("date", directVoucher.value.date.toString());
  formData.append("items", JSON.stringify(directVoucher.value.Items));
  formData.append("employeeRequestId", directVoucher.value.Employee.id.toString());
  formData.append("signaturePerson", String(directVoucher.value.signaturePerson));
  directVoucherStore
    .update(directVoucher.value.id, formData)
    .then(async (response) => {
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your Item has been updated",
          showConfirmButton: false,
          timer: 1500,
        });
        showData(directVoucher.value.id);
        await useDirectVoucherStore().getItemsVSelect();
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = directVoucherStore.getError(error);
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
        await directVoucherStore._delete(directVoucher.value.id).then(() => {
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
  await directVoucherStore
    .show(id)
    .then((response) => {
      if (response.status == 200) {
        directVoucher.value.id = response.data.data.id;
        directVoucher.value.date = response.data.data.date;
        directVoucher.value.number = response.data.data.number;
        directVoucher.value.notes = response.data.data.notes;
        directVoucher.value.Items = response.data.data.Items;
        directVoucher.value.Employee = response.data.data.Employee;
        directVoucher.value.signaturePerson = response.data.data.signaturePerson;
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
  checkPermissionAccessArray(["show directVouchers"]);
  await directVoucherStore.getEmployees().then(() => {});
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = t("DirectVoucher");
    directVoucher.value.id = 0;
    directVoucher.value.date = new Date().toISOString().split("T")[0];
  } else {
    directVoucher.value.id = id.value;
    await showData(id.value);
    namePage.value = t("DirectVoucher");
  }
  await useDirectVoucherStore().getItemsVSelect();
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
          v-model="directVoucher.number"
          type="text"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightDirect dark:bg-input text-text dark:text-textLight"
        />
      </div>
      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("Date") }}
        </div>
        <input
          v-model="directVoucher.date"
          type="date"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightDirect dark:bg-input text-text dark:text-textLight"
        />
      </div>
      <div class="w-11/12 mr-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("InputVoucherEmployeeRequest") }}
        </div>
        <select
          v-model="directVoucher.Employee.id"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightDirect dark:bg-input text-text dark:text-textLight"
        >
          <option
            v-for="employee in directVoucherEmployees"
            :key="employee.id"
            :value="employee.id"
            class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightDirect dark:bg-input text-text dark:text-textLight"
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
          v-model="directVoucher.signaturePerson"
          type="text"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightDirect dark:bg-input text-text dark:text-textLight"
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
          v-model:content="directVoucher.notes"
          contentType="html"
          class="text-text dark:text-textLight bg-lightDirect dark:bg-input h-60 custom-quill"
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
              <th scope="col" class="text-sm font-medium px-2 py-2">
                {{ t("ID") }}
              </th>
              <th scope="col" class="text-sm font-medium px-6 py-4">
                {{ t("Item") }}
              </th>
              <th scope="col" class="text-sm font-medium px-6 py-4">
                {{ t("SerialNumber") }}
              </th>
              <th scope="col" class="text-sm font-medium px-6 py-4">
                {{ t("Count") }}
              </th>
              <th scope="col" class="text-sm font-medium px-6 py-4">
                {{ t("Price") }}
              </th>
              <th scope="col" class="text-sm font-medium px-6 py-4">
                {{ t("Total") }}
              </th>
              <th scope="col" class="text-sm font-medium px-6 py-4">
                {{ t("Notes") }}
              </th>
              <th scope="col" class="text-sm font-medium px-6 py-4">
                {{ t("Actions") }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-[#1f2937]">
            <tr
              v-for="(row, index) in directVoucher.Items"
              :key="row.id"
              class="border-b border-black h-14 text-gray-100"
            >
              <th>{{ index }}/{{ row.id }}</th>
              <th>{{ row.item }}</th>
              <th>{{ row.serialNumber }}</th>
              <th>{{ row.count }}</th>
              <th>{{ row.price.toLocaleString() }}</th>
              <th>{{ (row.count * row.price).toLocaleString() }}</th>
              <th>{{ row.notes }}</th>
              <th>
                <van-button
                  class="border-none duration-500 rounded-lg bg-create hover:bg-createHover"
                  type="success"
                  is-link
                  @click="updatePopup(index, row)"
                  >Edit
                </van-button>
                |
                <van-button
                  class="border-none duration-500 rounded-lg bg-delete hover:bg-deleteHover"
                  type="success"
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
                <div class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300">
                  Item
                </div>
                <!-- v-model="VoucherItem.directVoucherItem" -->
                <!-- <vSelect
                  class="capitalize dir-rtl mx-2 rounded-md h-10 bg-gray-800 focus:outline-none focus:border focus:border-gray-700 text-gray-300 p-2 mb-10"
                  :options="directVoucherItemsVSelect"
                  :reduce="(_item: IDirectVoucherItem) => _item"
                  :get-option-label="(_item: IDirectVoucherItem) => _item.item"
                  :create-option="(_item: IDirectVoucherItem) => _item"
                  v-model="VoucherItem.item"
                  @input="handleEnter"
                >
                  <template #option="_item">
                    <div
                      class="rounded-md text-right focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-100 p-1 mb-1 font-bold"
                    >
                      {{ _item.item.toString() }}
                    </div>
                  </template>
                </vSelect> -->
                <input
                  v-model="VoucherItem.item"
                  type="text"
                  class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold"
                />
              </div>
            </div>
            <div class="flex justify-around w-full mt-4 ml-6">
              <div class="w-1/5">
                <div class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300">
                  Serial Number
                </div>
                <input
                  v-model="VoucherItem.serialNumber"
                  type="text"
                  class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold"
                />
              </div>
              <div class="w-1/5">
                <div class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300">
                  Count
                </div>
                <input
                  @input="ChangeValueTotal()"
                  v-model.number="VoucherItem.count"
                  min="1"
                  type="number"
                  class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold"
                />
              </div>
              <div class="w-1/5">
                <div class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300">
                  Price
                </div>
                <input
                  @input="ChangeValueTotal()"
                  v-model.number="VoucherItem.price"
                  type="number"
                  class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold"
                />
              </div>
              <div class="w-1/5">
                <div class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300">
                  Total
                </div>
                <input
                  :value="VoucherItem.value"
                  type="number"
                  class="rounded-md focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-gray-300 p-2 mb-10 font-bold"
                />
              </div>
            </div>
            <div class="flex justify-around w-full mt-4 ml-6">
              <div class="w-full">
                <div class="mb-1 md:text-sm text-base ml-2 font-bold text-gray-300">
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
          <div class="w-full p-2 rounded-lg flex items-center fixed bottom-1 right-3">
            <div class="flex justify-between">
              <div class="items-center ml-2">
                <button
                  v-if="IsUpdateItem == false"
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
            <div class="inner absolute w-full h-3/5 bg-gray-500 top-[20%]"></div>
          </div>
        </van-popup>
      </div>
    </div>
    <!-- bottom tool bar -->
    <div
      :class="{
        'lg:w-[99.2%] xs:w-[97%] lg:mx-2 xs:mx-2 bottom': is,
        'lg:w-[95%] md:w-[90%] xs:w-[75%] lg:mr-0 ltr:xs:ml-3 rtl:xs:mr-3 bottom': !is,
      }"
      class="dark:bg-bottomTool duration-700 bg-ideNavLight p-2 rounded-lg flex items-center justify-end fixed bottom-0 print:hidden"
    >
      <div class="flex ltr:ml-8 rtl:mr-8">
        <div class="items-center mr-3">
          <button
            v-if="directVoucher.id == 0"
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
            v-if="directVoucher.id != 0"
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
@/stores/voucher1/directVoucher@/stores/voucher1/directVoucher@/stores/permissionStore