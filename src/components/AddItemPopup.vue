<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useItemStore } from "@/stores/Item/item";
import { useItemCategoryStore } from "@/stores/Item/itemCategory";
import Swal from "sweetalert2";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { usePermissionStore } from "@/stores/permission";

import { useI18n } from "@/stores/i18n/useI18n";
import { pop } from "@vueuse/motion";
const { t } = useI18n();
const ItemName = ref<HTMLInputElement | null>(null);

//region"Drag and Drop"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
const namePage = ref(".....");
const rtlStore = useRtlStore();
const { is } = storeToRefs(rtlStore);

const itemStore = useItemStore();
const { item } = storeToRefs(useItemStore());
const itemCategoryStore = useItemCategoryStore();
const { categories } = storeToRefs(useItemCategoryStore());

const errors = ref<String | null>();
//#endregion
//#region CURD
const store = () => {
  errors.value = null;
  const formData = new FormData();
  formData.append("id", item.value.id.toString());
  formData.append("name", item.value.name.toString());
  formData.append("description", item.value.description.toString());
  formData.append("code", item.value.code.toString());
  formData.append("measuringUnit", item.value.measuringUnit.toString());
  formData.append("itemCategoryId", String(item.value.itemCategoryId));
  itemStore
    .store(formData)
    .then((response) => {
      if (response.status === 200) {
        let popClose = document.getElementById("closePop");
        popClose?.click;
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = itemStore.getError(error);
      Swal.fire({
        icon: "error",
        title: "create new data fails!!!",
        text: error.response.data.message,
        footer: "",
      });
    });
};
//#endregion
const setFocus = () => {
  if (ItemName.value) {
    ItemName.value.focus();
  }
};
onMounted(async () => {
  //console.log(can("show items1"));
  checkPermissionAccessArray(["show Item"]);
  await itemCategoryStore.getFast();
  namePage.value = t("ItemAdd");
  item.value.id = 0;
});
</script>
<template>
  <input type="checkbox" id="my_modal_7" class="modal-toggle" />
  <div class="modal w-full">
    <div class="modal-box w-11/12 max-w-5xl">
      <div class="w-full p-4 grid lg:grid-cols-2 xs:grid-cols-2">
        <div class="w-12/12 mx-2">
          <div
            class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
          >
            {{ t("Name") }}
          </div>
          <input
            v-model="item.name"
            ref="ItemName"
            type="text"
            class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
          />
        </div>
        <div class="w-11/12 mr-2">
          <div
            class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
          >
            {{ t("ItemCategory") }}
          </div>
          <select
            v-model="item.itemCategoryId"
            class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
          >
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="w-12/12 mx-2">
          <div
            class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
          >
            {{ t("ItemCode") }}
          </div>
          <input
            v-model="item.code"
            type="text"
            class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
          />
        </div>
        <div class="w-11/12 mx-2">
          <div
            class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
          >
            {{ t("ItemUnit") }}
          </div>
          <input
            v-model="item.measuringUnit"
            type="text"
            class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
          />
        </div>
      </div>
      <div class="w-full p-4 lg:grid-cols-1 xs:grid-cols-1 mt-2">
        <div class="w-full mx-2">
          <div
            class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
          >
            {{ t("Description") }}
          </div>
          <quill-editor
            v-model:content="item.description"
            contentType="html"
            theme="snow"
            class="text-text dark:text-textLight bg-lightInput dark:bg-input"
          ></quill-editor>
        </div>
      </div>
      <!-- bottom tool bar -->
      <div
        class="dark:bg-bottomTool duration-700 mt-5 bg-ideNavLight p-2 rounded-lg flex items-center justify-end print:hidden"
      >
        <div class="flex ltr:ml-8 rtl:mr-8">
          <div class="items-center m-3">
            <button
              v-if="item.id == 0"
              @click="store()"
              class="bg-create hover:bg-createHover ml-1 duration-500 h-10 lg:w-32 xs:w-30 sm:w-30 md:w-30 rounded-lg text-white"
            >
              {{ t("Create") }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <label class="modal-backdrop" for="my_modal_7" id="closePop">Close</label>
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
</style>
