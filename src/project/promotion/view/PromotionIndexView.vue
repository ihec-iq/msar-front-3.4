<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePromotionStore } from "../promotionStore"; // Updated store import
import { storeToRefs } from "pinia";

import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utilities/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import type { IPromotion, IPromotionFilter } from "../IPromotion"; // Updated type import
import { usePermissionsStore } from "@/project/core/permissionStore";
import { limits } from "@/utilities/defaultParams"; // Added limits import
import IButton from "@/components/ihec/IButton.vue"; // Added button component
import ISelect from "@/components/inputs/ISelect.vue"; // Added select component
import { EnumPermission } from "@/utilities/EnumSystem"; // Added permission enum
import type { ITableHeader } from "@/types/core/components/ITable"; // Added table header type
import IPage from "@/components/ihec/IPage.vue"; // Added page component
import router from "@/router";

const { checkPermissionAccessArray } = usePermissionsStore();
const isLoading = ref(false);

const data = ref<Array<IPromotion>>([]); // Updated type
const dataPage = ref();
const dataBase = ref<Array<IPromotion>>([]); // Updated type
const { get_filter } = usePromotionStore(); // Updated store method

const fastSearch = ref("");
const searchFilter = ref<IPromotionFilter>({ // Updated filter type
  title: "",
  limit: 10,
  employeeName: "",
  isBound: false,
});

const add = () => {
    usePromotionStore().resetData();
    router.push({
        name: "promotionAdd",
    });
};

const getFilterData = async (page = 1) => {
  // ...
  searchFilter.value.employeeName = fastSearch.value.toString(); // Updated to use fastSearch
  // ...
};

const update = (id: number) => {
  router.push({ // Updated to use router
    name: "promotionUpdate", // Updated route name
    params: { id: id },
  });
};

onMounted(async () => {
  isLoading.value = true; // Existing loading state
  checkPermissionAccessArray([EnumPermission.ShowPromotions]); // Updated permission check
  // ... existing code ...
  await getFilterData(1); // Existing data fetch
  isLoading.value = false; // Existing loading state
});

// Updated headers to match the structure of BonusIndexView
const headers = ref<Array<ITableHeader>>([
  { caption: t("Title"), value: "title" },
  { caption: t("Details"), value: "actions" },
  { caption: t("Employee.Title"), value: "EmployeeName" },
  { caption: t("Date"), value: "issueDate" },
  { caption: t("Promotion.DegreeStage"), value: "PromotionDegreeStage" },
  { caption: t("Promotion.JobTitle"), value: "PromotionJobTitle" },
  { caption: t("Promotion.Study"), value: "PromotionStudy" },
]); // Updated headers
</script>
<template>
  <IPage :HeaderTitle="t('Promotion.Index')" :is-loading="isLoading"> <!-- Updated title -->
    <template #HeaderButtons>
      <IButton width="28" :onClick="add" :text="t('Promotion.Add')" /> <!-- Updated button text -->
    </template>
    <IPageContent>
      <IRow :col="3" :col-md="2" :col-lg="3">
        <ISearchBar :getDataButton="getFilterData">
          <ICol :span-lg="2" :span-md="2" :span="2" :span-sm="4">
            <IInput :label="t('SearchForUser')" :placeholder="t('SearchForUser')" v-model="fastSearch" type="text"
              :OnKeyEnter="getFilterData" />
          </ICol>
        </ISearchBar>
      </IRow>
      <IRow>
        <ITable :items="data" :headers="headers">
          <template v-slot:EmployeeName="{ row }">
            <span>{{ row.Employee.name }}</span>
          </template>
          <template v-slot:PromotionJobTitle="{ row }">
            <span>{{ row.PromotionJobTitle.name }}</span>
          </template>
          <template v-slot:PromotionStudy="{ row }">
            <span>{{ row.PromotionStudy.name }}</span>
          </template>
          <template v-slot:PromotionDegreeStage="{ row }">
            <span>{{ row.PromotionDegreeStage.title }}</span>
          </template>
          <template v-slot:actions="{ row }">
            <IDropdown>
              <li>
                <OpenButton @click="update(row.id)" />
              </li>
            </IDropdown>
          </template>
        </ITable>
        <IRow v-if="data.length > 0">
          <div class="w-full flex flex-row">
            <div class="basis-4/5 overflow-auto">
              <TailwindPagination class="flex justify-center mt-6" :data="dataPage"
                @pagination-change-page="getFilterData" :limit="searchFilter.limit" />
            </div>
            <div class="basis-1/5" v-if="data.length >= limits[0].id">
              <ISelect name="limit" :label="t('Limit')" v-model="searchFilter.limit" :options="limits" :IsRequire="true"
                @onChange="getFilterData()" />
            </div>
          </div>
          <SimpleLoading v-if="isLoading">.</SimpleLoading>
        </IRow>
      </IRow>
      <IRow>
        <div id="PageDataEnd"></div>
      </IRow>
    </IPageContent>
    <IFooterCrud :is-add="true" :show-add="false"> </IFooterCrud>
  </IPage>
</template>