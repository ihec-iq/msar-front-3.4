<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useItemStore } from "../itemStore";
import type { IItem, IItemFilter } from "../IItem";
import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utilities/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import { usePermissionsStore } from "@/project/core/permissionStore";
const { checkPermissionAccessArray } = usePermissionsStore();

const isLoading = ref(false);
const data = ref<Array<IItem>>([]);
const dataPage = ref();
const dataBase = ref<Array<IItem>>([]);
const { item, get_filter } = useItemStore();

import { limits } from "@/utilities/defaultParams";
import { EnumPermission } from "@/utilities/EnumSystem";
import CardItemIndex from "./CardItemIndex.vue";

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
  item.id = 0;
  item.name = "";
  item.Category = { name: "", id: 0 };
  item.code = "";
  item.description = "";
  router.push({
    name: "itemAdd",
  });
};

//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (item: IItem) => {
  if (
    item.name.includes(fastSearch.value) ||
    item.code.includes(fastSearch.value)
  ) {
    return true;
  } else return false;
};
const makeFastSearch = () => {
  // eslint-disable-next-line no-self-assign
  if (fastSearch.value == "") data.value = dataBase.value;
  else {
    data.value = dataBase.value.filter(filterByIDName);
  }
};
//#endregion
//#region Search
const searchFilter = ref<IItemFilter>({
  name: "",
  limit: 10,
  description: "",
});
const getFilterData = async (page = 1) => {
  isLoading.value = true;
  searchFilter.value.name = fastSearch.value;
  await get_filter(searchFilter.value, page)
    .then((response) => {
      if (response.status == 200) {
        dataPage.value = response.data.data;
        data.value = response.data.data.data;
        dataBase.value = response.data.data.data;
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
    name: "itemUpdate",
    params: { id: id },
  });
};

//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowItems]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";

  await getFilterData(1);
});
</script>
<template>
  <IPage :HeaderTitle="t('Item')">
    <template #HeaderButtons>
      <IButton width="28" :onClick="addItem" :text="t('Add')" />
    </template>
    <IPageContent>
      <IRow :col="5" :col-md="2" :col-lg="4">
        <ISearchBar :getDataButton="getFilterData">
          <ICol :span-lg="1" :span-md="2" :span="1" :span-sm="4">
            <IInput
              :label="t('Search')"
              :placeholder="t('Search')"
              v-model="fastSearch"
              type="text"
              :OnKeyEnter="getFilterData"
            />
          </ICol>
        </ISearchBar>
      </IRow>
      <IRow :col="2" :colMd="2" :colLg="2">
        <ICol class="p-3" :span="2" v-for="item in data" :key="item.id">
          <CardItemIndex :item="item" />
          <SimpleLoading v-if="isLoading"></SimpleLoading>
        </ICol>
      </IRow>
      <IRow>
        <div class="rounded-xl" v-if="isLoading == false">
          <div
            v-motion
            :initial="{ opacity: 0, y: -15 }"
            :enter="{ opacity: 1, y: 0 }"
            :variants="{ custom: { scale: 2 } }"
            :delay="200"
            v-if="data.length > 0"
          >
            <div class="w-full flex flex-row">
              <div class="basis-4/5 overflow-x-auto font-Tajawal">
                <TailwindPagination
                  class="flex justify-center mt-6"
                  :data="dataPage"
                  @pagination-change-page="getFilterData"
                  :limit="searchFilter.limit"
                />
              </div>
              <div class="basis-1/5" v-if="data.length >= limits[0].id">
                <ISelect
                  :label="t('Limit')"
                  v-model="searchFilter.limit"
                  name="archiveTypeId"
                  :options="limits"
                  :IsRequire="true"
                  @onChange="getFilterData()"
                />
              </div>
            </div>
          </div>
        </div>
      </IRow>
    </IPageContent>
  </IPage>
</template>./CardItemIndex.vue@/project/user/permissionStore
@/utilities/I18nPlugin@/utilities/defaultParams@/utilities/EnumSystem