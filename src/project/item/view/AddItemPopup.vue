<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useItemStore } from "../itemStore";
import { useItemCategoryStore } from "../itemCategoryStore";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { t } from "@/utilities/I18nPlugin";
import { EnumPermission } from "@/utilities/EnumSystem";
import { prepareFormData } from "@/utilities/crudTool";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";
import IButton2 from "@/components/ihec/IButton2.vue";
const emit = defineEmits(["setItem"]);
//region"Props"
const modelValue = defineModel<boolean>()
//#endregion

//#region Vars
const { checkPermissionAccessArray, can } = usePermissionsStore();
const itemStore = useItemStore();
const { item } = storeToRefs(useItemStore());
const itemCategoryStore = useItemCategoryStore();
const { categories } = storeToRefs(useItemCategoryStore());

const errors = ref<String | null>();
const loading = ref(false);
//#endregion
//#region CURD
const store = () => {
  if (!can(EnumPermission.AddItem)) return;
  loading.value = true;
  errors.value = null;
  const formData = prepareFormData(item.value);
  itemStore
    .store(formData)
    .then(async (response) => {
      if (response.status === 200) {
        emit("setItem", response.data.data);
        await useItemStore().get_items();
        reset();
        modelValue.value = false;
        }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = itemStore.getError(error);
    });
  loading.value = false;

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
  reset();
  checkPermissionAccessArray([EnumPermission.ShowItems]);
  await refreshCategories();
  item.value.id = 0;
  //el.value?.focus();
});
const refreshCategories = async () => {
  loading.value = true;
  await useItemCategoryStore().getFast();
  loading.value = false;
};

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

</script>
<template>
  <div class="w-full content-center" v-if="modelValue">
    <Loading v-if="loading" />
     <Alert>
      <AlertTitle>اضافة مادة جديدة</AlertTitle>
      <AlertDescription>
        <div class="bg-slate-200 dark:bg-input center-x rounded-lg shadow-lg">
          <div
            v-if="loading"
            class="h-8 w-8 animate-spin rounded-full fixed top-0 left-0 m-1 bottom-0 bg-slate-300 dark:bg-input border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
            role="status"
          >
            <span
              class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
              >Loading...</span
            >
          </div>
          <div class="p-4 grid lg:grid-cols-2 xs:grid-cols-2">
            <div class="w-12/12">
              <div
                class="mt-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
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
                class="mt-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
              >
                {{ t("Item.Category") }}
              </div>
              <div class="flex flex-row">
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
                <IButton2
                  class="h-full"
                  :text="t('Refresh')"
                  :onClick="refreshCategories"
                  post-icon="refresh"
                  color="blue"
                  :type="EnumButtonType.Outlined"
                />
              </div>
            </div>

            <div class="w-12/12">
              <div
                class="mt-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
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
                class="mt-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
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
          <div class="px-4">
            <div
              class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
            >
              {{ t("Description") }}
            </div>
            <input
              v-model="item.description"
              type="text"
              class="w-full focus:outline-none focus:ring-0 focus:border-gray-900 outline-none h-10 border-2 border-gray-500 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
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
                  class="bg-create focus:outline-none focus:ring-1 focus:bg-gray-900 focus:border-gray-900 hover:bg-createHover ml-1 duration-500 h-10 lg:w-32 xs:w-30 sm:w-30 md:w-30 rounded-lg text-white"
                >
                  {{ t("Add") }}
                </button>
                <button
                  v-if="item.id == 0"
                  @click="()=>{modelValue=false}"
                  class="bg-red-400 focus:outline-none focus:ring-1 focus:bg-gray-900 focus:border-gray-900 hover:bg-createHover ml-1 duration-500 h-10 lg:w-32 xs:w-30 sm:w-30 md:w-30 rounded-lg text-white"
                >
                  {{ t("Close") }}
                </button>
              </div>
            </div>
          </div>
          <div class="border-red-800 border-[1px] content-center rounded-lg p-2 text-center" v-if="errors">
            {{ errors }}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  </div>
</template>
