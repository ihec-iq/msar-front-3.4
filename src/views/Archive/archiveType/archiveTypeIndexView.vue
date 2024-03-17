<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useArchiveStore } from "@/stores/archives/archiveStore";
import type { IItemCategoryFilter } from "@/types/IItem";
import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utils/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import { usePermissionStore } from "@/stores/permissionStore";
import ArchiveTypeCard from "./archiveTypeCardComponent.vue";
import { limits } from "@/utils/defaultParams";
import { EnumPermission } from "@/utils/EnumSystem";
import { IArchiveType } from "@/types/archives/IArchive";

/**
 * ! should change the data and dataPage
 */
const { checkPermissionAccessArray } = usePermissionStore();
const isLoading = ref(false);
const data = ref<Array<IArchiveType>>([]);
const dataPage = ref();
const archiveStore = useArchiveStore();
const route = useRoute();
const router = useRouter();

//#region LifeCycle
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowArchiveTypes]);
  if (route.params.search != undefined)
    fastSearch.value = route.params.search.toString() || "";

  await getFilterData(1);
});

watch(
  () => route.params.search,
  async (newValue) => {
    if (route.params.search != undefined)
      fastSearch.value = newValue.toString() || "";
    await getFilterData(1);
  }
);
//#endregion

//#region Search and filtering
const fastSearch = ref("");

const searchFilter = ref<IItemCategoryFilter>({
  name: "",
  limit: 10,
});

const getFilterData = async (page: number = 1) => {
  isLoading.value = true;
  await archiveStore.getArchiveTypes();
  isLoading.value = false;
};
//#endregion

//#region Add and Update
const addItem = () => {
  archiveStore.resetArchiveType();
  router.push({
    name: "archiveTypeAdd",
  });
};
//#endregion
</script>
<template>
  <IPage :HeaderTitle="t('archiveType')">
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

      <IRow :col="4" :col-lg="4" :col-md="3" :col-sm="1" :col-xs="1">
        <ICol
          class="my-2"
          :span="1"
          :span-lg="1"
          :span-md="1"
          v-for="item in archiveStore.archiveTypes"
          :key="item.id"
        >
          <!-- card -->
          <ArchiveTypeCard :item="item" />
          <!-- end card -->
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
  <SimpleLoading v-if="isLoading"></SimpleLoading>
</template>
