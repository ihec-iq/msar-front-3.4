<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useItemStore } from "@/stores/item/itemStore";
import { useItemCategoryStore } from "@/stores/item/itemCategoryStore";
import { storeToRefs } from "pinia";
import { usePermissionStore } from "@/stores/permissionStore";
import { t } from "@/utils/I18nPlugin";
import WangEditor from "./WangEditor.vue";
import { EnumPermission } from "@/utils/EnumSystem";
const emit = defineEmits(["setItem"]);
//region"Props"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
const namePage = ref(t("ItemAdd"));

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
  formData.append("Category", JSON.stringify(item.value.Category));
  itemStore
    .store(formData)
    .then(async (response) => {
      if (response.status === 200) {
        emit("setItem", response.data.data);
        await useItemStore().get_items();
        reset();
        let popClose = document.getElementById("closePopItem");
        popClose?.click();
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = itemStore.getError(error);
    });
};
//#endregion
const reset = () => {
  item.value.id = 0;
  item.value.name = "";
  item.value.description = "";
  item.value.code = "";
  item.value.measuringUnit = "";
  item.value.Category.id = 1;
};
const el = ref<HTMLInputElement>();
onMounted(async () => {
  //console.log(can("show items1"));
  checkPermissionAccessArray([EnumPermission.ShowItems]);
  await itemCategoryStore.getFast();
  item.value.id = 0;
  //el.value?.focus();
});
</script>
<template>
  <input type="checkbox" id="my_modal_7" class="modal-toggle" />
  <div class="modal w-full">
    <div class="modal-box w-11/12 max-w-5xl">
      <div class="w-full p-4 grid lg:grid-cols-2 xs:grid-cols-2">
        <div class="w-12/12 mx-2">
          <div class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight">
            {{ t("Name") }}
          </div>
          <input ref="el" v-model="item.name" type="text"
            class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight" />
        </div>
        <div class="w-11/12 mr-2">
          <div class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight">
            {{ t("ItemCategory") }}
          </div>
          <select v-model="item.Category.id"
            class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight">
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="w-12/12 mx-2">
          <div class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight">
            {{ t("ItemCode") }}
          </div>
          <input v-model="item.code" type="text"
            class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight" />
        </div>
        <div class="w-11/12 mx-2">
          <div class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight">
            {{ t("ItemUnit") }}
          </div>
          <input v-model="item.measuringUnit" type="text"
            class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight" />
        </div>
      </div>
      <div class="w-full p-4 lg:grid-cols-1 xs:grid-cols-1 mt-2">
        <div class="w-full mx-2">
          <div class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight">
            {{ t("Description") }}
          </div>
          <WangEditor v-model="item.description"></WangEditor>
        </div>
      </div>
      <!-- bottom tool bar -->
      <div
        class="dark:bg-bottomTool duration-700 mt-5 bg-ideNavLight p-2 rounded-lg flex items-center justify-end print:hidden">
        <div class="flex ltr:ml-8 rtl:mr-8">
          <div class="items-center m-3">
            <button v-if="item.id == 0" @click="store()"
              class="bg-create hover:bg-createHover ml-1 duration-500 h-10 lg:w-32 xs:w-30 sm:w-30 md:w-30 rounded-lg text-white">
              {{ t("Create") }}
            </button>
          </div>
        </div>
      </div>
      <div class="border-red-800 border-[1px]" v-if="errors">{{ errors }}</div>
    </div>
    <label class="modal-backdrop visible" for="my_modal_7" id="closePopItem">Close</label>
  </div>
</template>