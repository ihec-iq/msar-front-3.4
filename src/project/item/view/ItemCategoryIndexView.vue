<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useItemCategoryStore } from "../itemCategoryStore";
import type { IItemCategory, IItemCategoryFilter } from "../IItem";
import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utilities/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import { usePermissionStore } from "@/project/user/permissionStore";
const { checkPermissionAccessArray } = usePermissionStore();

const isLoading = ref(false);
const data = ref<Array<IItemCategory>>([]);
const dataPage = ref();
const dataBase = ref<Array<IItemCategory>>([]);
const { category } = useItemCategoryStore();
const itemCategoryStore = useItemCategoryStore();
import CardItemCategoryIndex from "./CardItemCategoryIndex.vue";

import { limits } from "@/utilities/defaultParams";
import { EnumPermission } from "@/utilities/EnumSystem";
import IPage from "@/components/ihec/IPage.vue";

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
  category.id = 0;
  category.name = "";
  router.push({
    name: "itemCategoryAdd",
  });
};

//#region Fast Search
const fastSearch = ref("");
const filterByIDName = (item: IItemCategory) => {
  if (item.name.includes(fastSearch.value)) {
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
const searchFilter = ref<IItemCategoryFilter>({
  name: "",
  limit: 10,
});
const getFilterData = async (page: number = 1) => {
  isLoading.value = true;
  searchFilter.value.name = fastSearch.value;
  await itemCategoryStore
    .get_filter(searchFilter.value, page)
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
    name: "itemCategoryUpdate",
    params: { id: id },
  });
};

//#region Pagination
//#endregion
onMounted(async () => {
  isLoading.value = true;
  checkPermissionAccessArray([EnumPermission.ShowCategoriesItem]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";
console.log("in index catitem");

  await getFilterData(1);
  isLoading.value = false;
});
</script>
<template>
  <IPage :HeaderTitle="t('Item.Category')" :is-loading="isLoading">
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
          <CardItemCategoryIndex :item="item" />
          <SimpleLoading v-if="isLoading"></SimpleLoading>
        </ICol>
      </IRow>
      <IRow>
        <div class="py-4 min-w-full w-full h-full lg:px-8">
          <!-- card -->
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
          <SimpleLoading v-if="isLoading"></SimpleLoading>
          <!-- end card -->
        </div>
      </IRow>
    </IPageContent>
  </IPage>
</template>
@/utilities/I18nPlugin@/utilities/defaultParams@/utilities/EnumSystem
