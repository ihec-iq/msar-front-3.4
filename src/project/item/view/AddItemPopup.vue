<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useItemStore } from "../itemStore";
import { useItemCategoryStore } from "../itemCategoryStore";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { t } from "@/utilities/I18nPlugin";
import { EnumPermission } from "@/utilities/EnumSystem";
const emit = defineEmits(["setItem"]);
//region"Props"

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionsStore();
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
  reset()
  checkPermissionAccessArray([EnumPermission.ShowItems]);
  await itemCategoryStore.getFast();
  item.value.id = 0;
  //el.value?.focus();
});
</script>
<template>
  <input type="checkbox" id="my_modal_7" class="modal-toggle" />
  <div class="modal w-full">
    <div class="modal-box w-11/12 max-w-5xl bg-slate-300 dark:bg-input">
      <div class="w-full p-4 grid lg:grid-cols-2 xs:grid-cols-2">
        <div class="w-12/12 mx-2">
          <div
            class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
          >
            {{ t("Name") }}
          </div>
          <input
            ref="el"
            id="NameItemEnterNew"
            v-model="item.name"
            type="text"
            class="w-full focus:outline-none focus:ring-0 focus:border-gray-900 outline-none h-10 px-3 py-2 border-2 border-gray-500 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
          />
        </div>
        <div class="w-11/12 mr-2">
          <div
            class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
          >
            {{ t("Item.Category") }}
          </div>

          <select
            v-model="item.Category.id"
            class="w-full focus:outline-none focus:ring-0 focus:border-gray-900 outline-none h-10 px-3 py-2 border-2 border-gray-500 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
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
            {{ t("Item.Code") }}
          </div>
          <input
            v-model="item.code"
            type="text"
            class="w-full focus:outline-none focus:ring-0 focus:border-gray-900 outline-none h-10 px-3 border-2 border-gray-500 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
          />
        </div>
        <div class="w-11/12 mx-2">
          <div
            class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
          >
            {{ t("Item.Unit") }}
          </div>
          <input
            v-model="item.measuringUnit"
            type="text"
            class="w-full focus:outline-none focus:ring-0 focus:border-gray-900 outline-none h-10 px-3 py-2 border-2 border-gray-500 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
          />
        </div>
      </div>
      <div class="w-12/12 mx-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("Description") }}
        </div>
        <input
          v-model="item.description"
          type="text"
          class="w-full focus:outline-none focus:ring-0 focus:border-gray-900 outline-none h-10 px-3 py-2 border-2 border-gray-500 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
        />
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
              class="bg-create focus:outline-none focus:ring-0 focus:border-gray-900 hover:bg-createHover ml-1 duration-500 h-10 lg:w-32 xs:w-30 sm:w-30 md:w-30 rounded-lg text-white"
            >
              {{ t("Create") }}
            </button>
          </div>
        </div>
      </div>
      <div class="border-red-800 border-[1px]" v-if="errors">{{ errors }}</div>
    </div>
    <label class="modal-backdrop visible" for="my_modal_7" id="closePopItem"
      >Close</label
    >
  </div>
</template>