<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useItemCategoryStore } from "@/stores/item/itemCategoryStore";
import PageTitle from "@/components/general/namePage.vue";
import type { IItemCategory, IItemCategoryFilter } from "@/types/IItem";
import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utils/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import EditButton from "@/components/dropDown/EditButton.vue";
import { usePermissionStore } from "@/stores/permissionStore";
const { checkPermissionAccessArray } = usePermissionStore();

const isLoading = ref(false);
const data = ref<Array<IItemCategory>>([]);
const dataPage = ref();
const dataBase = ref<Array<IItemCategory>>([]);
const { category } = useItemCategoryStore();
const itemCategoryStore = useItemCategoryStore();

import { limits } from "@/utils/defaultParams";
import IDropdown from "@/components/ihec/IDropdown.vue";

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
  checkPermissionAccessArray(["show categories item"]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";

  await getFilterData(1);
});
</script>
<template>
  <IPage :HeaderTitle="t('ItemCategory')">
    <template #HeaderButtons>
      <IButton width="28" :onClick="addItem" :text="t('Add')" />
    </template>
    <IPageContent>
      <IRow :col="5" :col-md="2" :col-lg="4">
        <ISearchBar :getDataButton="getFilterData">
          <ICol :span-lg="1" :span-md="2" :span="1" :span-sm="4">
            <IInput :label="t('Search')" :placeholder="t('Search')" v-model="fastSearch" type="text" />
          </ICol>
        </ISearchBar>
      </IRow>
      <IRow>
        <div class="inline-block min-w-full">
          <!-- card -->
          <div class="rounded-xl" v-if="isLoading == false">
            <div v-motion :initial="{ opacity: 0, y: -15 }" :enter="{ opacity: 1, y: 0 }"
              :variants="{ custom: { scale: 2 } }" :delay="200" v-if="data.length > 0">
              <div class="max-w-full relative">
                <div class="grid lg:grid-cols-2 md:grid-cols-2 xs:grid-cols-1 gap-10 lg:m-0 xs:mx-3">
                  <!-- card -->
                  <div
                    class="bg-cardLight dark:bg-card flex w-full p-5 rounded-lg border border-gray-600 shadow-md shadow-gray-900 duration-500 hover:border hover:border-gray-400 hover:shadow-md hover:shadow-gray-600"
                    v-for="item in data" :key="item.id">
                    <div class="w-3/4 overflow-hidden">
                      <div class="ltr:ml-2 rtl:mr-2 ltr:text-left rtl:text-right">
                        <div class="text-2xl text-text dark:text-textLight mb-2">
                          {{ item.name }}
                        </div>
                      </div>
                      <div class="flex justify-betweens">
                        <div class="text-text dark:text-textGray" v-html="item.description"></div>
                      </div>
                    </div>

                    <IDropdown>
                      <li>
                        <EditButton @click="update(item.id)" />
                      </li>
                    </IDropdown>
                  </div>
                  <!-- end card -->
                </div>
                <div class="py-4 min-w-full w-full h-full lg:px-8">
                  <!-- card -->
                  <div class="rounded-xl" v-if="isLoading == false">
                    <div v-motion :initial="{ opacity: 0, y: -15 }" :enter="{ opacity: 1, y: 0 }"
                      :variants="{ custom: { scale: 2 } }" :delay="200" v-if="data.length > 0">
                      <div class="w-full flex flex-row">
                        <div class="basis-4/5 overflow-x-auto font-Tajawal">
                          <TailwindPagination class="flex justify-center mt-6" :data="dataPage"
                            @pagination-change-page="getFilterData" :limit="searchFilter.limit" />
                        </div>
                        <div class="basis-1/5" v-if="searchFilter.limit > limits[0].id">
                          <ISelect :label="t('Limit')" v-model="searchFilter.limit" name="archiveTypeId" :options="limits"
                            :IsRequire="true" @onChange="getFilterData()" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <SimpleLoading v-if="isLoading"></SimpleLoading>
                  <!-- end card -->
                </div>
              </div>
            </div>
          </div>
          <!-- end card -->
        </div>
      </IRow>
    </IPageContent>
  </IPage>
</template>
