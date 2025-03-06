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
const modelValue = defineModel<boolean>();
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

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import IInput from "@/components/inputs/IInput.vue";
import ISelect from "@/components/inputs/ISelect.vue";
</script>
<template>
  <div class="w-full content-center" v-if="modelValue">
    <Loading v-if="loading" />
    <Alert>
      <AlertTitle>اضافة مادة جديدة</AlertTitle>
      <AlertDescription>
        <div class="bg-slate-100 dark:bg-input center-x rounded-lg shadow-lg">
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
              <IInput
                ref="el"
                id="NameItemEnterNew"
                :label="t('Name')"
                v-model="item.name"
              />
            </div>
            <div class="w-12/12 mr-2">
              <div class="flex flex-row">
                <ISelect
                  class="w-[50%]"
                  :label="t('Item.Category')"
                  v-model="item.Category.id"
                  name="inputVoucherStockId"
                  :options="categories"
                  :IsRequire="true"
                />
                <IButton2
                  class="h-full mt-5"
                  :text="t('Refresh')"
                  :onClick="refreshCategories"
                  post-icon="refresh"
                  color="blue"
                  :type="EnumButtonType.Outlined"
                />
              </div>
            </div>

            <div class="flex flex-row">
              <IInput
                class="w-[50%]"
                :label="t('Item.Code')"
                v-model="item.code"
              />
              <IInput
                class="w-[50%]"
                :label="t('Item.Unit')"
                v-model="item.measuringUnit"
              />
            </div>
            <div>
              <IInput :label="t('Description')" v-model="item.description" />
            </div>
          </div>

          <!-- bottom tool bar -->
          <div
            class="dark:bg-bottomTool duration-700 bg-ideNavLight p-2 rounded-lg flex items-center justify-end print:hidden"
          >
            <div class="flex ltr:ml-8 rtl:mr-8">
              <div class="items-center">
                <button
                  v-if="item.id == 0"
                  @click="store()"
                  class="bg-green-200 border-green-500 border-[1px] focus:outline-none focus:ring-1 focus:bg-green-700 focus:text-white focus:border-gray-900 hover:bg-createHover ml-1 duration-500 h-10 lg:w-32 xs:w-30 sm:w-30 md:w-30 rounded-lg text-gray-600 hover:text-white"
                >
                  {{ t("Add") }}
                </button>
                <button
                  v-if="item.id == 0"
                  @click="
                    () => {
                      modelValue = false;
                    }
                  "
                  class="bg-red-200 border-red-500 border-[1px] focus:outline-none focus:ring-1 focus:bg-red-700 focus:text-white focus:border-gray-900 hover:bg-red-700 ml-1 duration-500 h-10 lg:w-32 xs:w-30 sm:w-30 md:w-30 rounded-lg text-gray-600 hover:text-white"
                >
                  {{ t("Close") }}
                </button>
              </div>
            </div>
          </div>
          <div
            class="border-red-800 border-[1px] content-center rounded-lg p-2 text-center"
            v-if="errors"
          >
            {{ errors }}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  </div>
</template>
