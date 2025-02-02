<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useInputVoucherStateStore } from "../inputVoucherStateStore";
import type { IInputVoucherState } from "../IInputVoucherState";
import { t } from "@/utilities/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import { usePermissionsStore } from "@/project/core/permissionStore";
const { checkPermissionAccessArray } = usePermissionsStore();

const isLoading = ref(false);
const data = ref<Array<IInputVoucherState>>([]);
const dataPage = ref();
const dataBase = ref<Array<IInputVoucherState>>([]);
const { inputVoucherState } = useInputVoucherStateStore();
const InputVoucherStateStore = useInputVoucherStateStore();
import CardInputVoucherStateIndex from "./CardInputVoucherStateIndex.vue";

import { EnumPermission } from "@/utilities/EnumSystem";
import IPage from "@/components/ihec/IPage.vue";
import IInput from "@/components/inputs/IInput.vue";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";

const route = useRoute();
const router = useRouter();
watch(
  () => route.params.search,
  async (newValue) => {
    if (route.params.search != undefined)
      fastSearch.value = newValue.toString() || "";
    await getFilterData(1);
  }
);
const addItem = () => {
  inputVoucherState.id = 0;
  inputVoucherState.name = "";
  router.push({
    name: "inputVoucherStateAdd",
  });
};

//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (item: IInputVoucherState) => {
  if (item.name.includes(fastSearch.value)) {
    return true;
  } else return false;
};
const makeFastSearch = () => {
  if (fastSearch.value == "") data.value = dataBase.value;
  else {
    data.value = dataBase.value.filter(filterByIDName);
  }
};
//#endregion
//#region Search
 
const getFilterData = async (page: number = 1) => {
  isLoading.value = true;
   await InputVoucherStateStore
    .get()
     .then((response) => {
      if (response.status == 200) {
        dataPage.value = response.data;
        data.value = response.data.data;
        dataBase.value = response.data.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  isLoading.value = false;
};
//#endregion
const update = (id: number) => {
  router.push({
    name: "stockUpdate",
    params: { id: id },
  });
};

//#region Pagination
//#endregion
onMounted(async () => {
  isLoading.value = true;
  //checkPermissionAccessArray([EnumPermission.ShowCategoriesItem]);
  checkPermissionAccessArray([EnumPermission.ShowWarehouseSettings]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
  await getFilterData(1);
  isLoading.value = false;
});
</script>
<template>
  <IPage :HeaderTitle="t('Warehouse.InputVoucherState.Index')" :is-loading="isLoading">
    <template #HeaderButtons>
      <IButton width="28" :onClick="addItem" :text="t('Warehouse.InputVoucherState.Add')" />
    </template>
    <IPageContent>
      <IRow :col="5" :col-md="2" :col-lg="4">
        <ISearchBar :getDataButton="getFilterData">
          <ICol :span-lg="1" :span-md="2" :span="1" :span-sm="4">
            <IInput
              :label="t('Search')"
              :placeholder="t('Search')"
              v-model="fastSearch"
              :type="EnumInputType.Text"
              :OnKeyEnter="getFilterData"
            />
          </ICol>
        </ISearchBar>
      </IRow>
      <IRow :col="2" :colMd="2" :colLg="2">
        <ICol class="p-3" :span="2" v-for="item in data" :key="item.id">
          <CardInputVoucherStateIndex :item="item" />
          <SimpleLoading v-if="isLoading"></SimpleLoading>
        </ICol>
      </IRow> 
    </IPageContent>
    <IFooterCrud :is-add="true" :show-add="false"/>
  </IPage>
</template>
