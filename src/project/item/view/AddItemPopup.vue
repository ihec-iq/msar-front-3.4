<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";
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

const errors = ref<string | null>();
const loading = ref(false);
//#endregion
//#region CURD
const store = () => {
  if (!can(EnumPermission.AddItem)) return;
  if (!item.value.name || !item.value.Category.id) {
    errors.value = t("Item.CategoryRequired");
    return;
  }
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
const innerInput = ref<HTMLInputElement>();
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import IInput from "@/components/inputs/IInput.vue";
import ISelect from "@/components/inputs/ISelect.vue";

const refFocus = ref<typeof IInput>();
async function focus() {
  await nextTick();
  refFocus.value?.focus();
}

defineExpose({ focus });

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
              <IInput ref="refFocus" :label="t('Name')" v-model="item.name" />
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
                  :variant="EnumButtonType.Outlined"
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
          <transition name="fade" mode="out-in">
            <div
              v-if="errors"
              class="flex items-center justify-center gap-2 border border-red-400 bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-200 rounded-lg p-3 my-2 shadow-sm animate-pulse"
            >
              <svg
                class="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 8v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z"
                />
              </svg>
              <span class="font-semibold">{{ errors }}</span>
            </div>
          </transition>
          <transition name="fade">
            <div
              v-if="!errors && !loading"
              class="flex items-center justify-center gap-2 border border-green-400 bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-200 rounded-lg p-3 my-2 shadow-sm"
            >
              <svg
                class="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span class="font-semibold">{{ t("SavedSuccessfully") }}</span>
            </div>
          </transition>
        </div>
      </AlertDescription>
    </Alert>
  </div>
</template>
