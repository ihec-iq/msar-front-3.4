<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { usePermissionStore } from "@/stores/permission";
import { useStockStore } from "@/stores/voucher/stock";
import { useCorruptedVoucherStore } from "@/stores/voucher/corruptedVoucher";
import { useInputVoucherStore } from "@/stores/voucher/inputVoucher";
import type { IOutputVoucherItem } from "@/types/IOutputVoucher";
import { useI18n } from "@/stores/i18n/useI18n";
import type { IInputVoucherItem } from "@/types/IInputVoucher";
const { t } = useI18n();
const { stocks } = storeToRefs(useStockStore());
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

const corruptedVoucherStore = useCorruptedVoucherStore();
const { corruptedVoucher } = storeToRefs(useCorruptedVoucherStore());
const { SelectedOutItemCorrupted } = storeToRefs(corruptedVoucherStore);

const Loading = ref(false);
const router = useRouter();
const errors = ref<String | null>();

//#endregion
const back = () => {
  router.back();
};
const showData = async (id: number) => {
  Loading.value = true;
  await corruptedVoucherStore
    .show(id)
    .then((response) => {
      if (response.status == 200) {
        console.log(response.data.data);
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
onMounted(async () => {
  checkPermissionAccessArray(["show Item"]);
  await corruptedVoucherStore.getEmployees().then(() => {});
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = t("OutputVoucher");
    corruptedVoucher.value.id = 0;
    corruptedVoucher.value.date = new Date().toISOString().split("T")[0];
  } else {
    corruptedVoucher.value.id = id.value;
    await showData(id.value);
    namePage.value = t("OutputVoucher");
  }
  await useStockStore().get_stocks();
  await useInputVoucherStore().getItemsVSelect();
});
</script>
<template>
  <PageTitle> {{ namePage }}</PageTitle>
  <div class="w-full">
    <div class="w-full p-6 grid lg:grid-cols-4 xs:grid-cols-2"></div>

    <div class="mt-10 p-6">
      <div class="w-12/12 mx-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        ></div>
        <table class="min-w-full text-center">
          <thead class="border-b bg-[#0003] text-gray-300">
            <tr>
              <th scope="col" class="text-sm font-medium px-2 py-2">ID</th>
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
                {{ t("Notes") }}
              </th>
              <th scope="col" class="text-sm font-medium px-6 py-4">
                {{ t("Actions") }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-[#1f2937]">
            <tr
              v-for="(row, index) in SelectedOutItemCorrupted"
              :key="row.id"
              class="border-b border-black h-14 text-gray-100"
            >
              <th>{{ row.id }}</th>
              <th>{{ row.Voucher.Item.name }}</th>
              <th>{{ row.Voucher.serialNumber }}</th>
              <th>
                <input class="w-[50px]" type="number" :value="row.count" />
              </th>
              <th>
                <input type="text" class="w-[50px]" :value="row.notes" />
              </th>
              <th>
                <van-button
                  class="border-none duration-500 rounded-lg bg-delete hover:bg-deleteHover"
                  type="secondary"
                  is-link
                  @click="console.log('delete' + index)"
                  >Delete
                </van-button>
              </th>
            </tr>
          </tbody>
        </table>
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
            v-if="corruptedVoucher.id == 0"
            @click="console.log('store')"
            class="bg-create hover:bg-createHover ml-1 duration-500 h-10 lg:w-32 xs:w-20 rounded-lg text-white"
          >
            {{ t("Create") }}
          </button>
          <button
            v-else
            @click="console.log('update')"
            class="bg-update hover:bg-updateHover ml-1 duration-500 h-10 lg:w-32 xs:w-20 rounded-lg text-white"
          >
            {{ t("Update") }}
          </button>
          <button
            v-if="corruptedVoucher.id != 0"
            @click="console.log('delete Bill')"
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
