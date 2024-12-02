<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useArchiveTypeStore } from "../archiveTypeStore";
import { t } from "@/utilities/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import { usePermissionsStore } from "@/project/core/permissionStore";
import ArchiveTypeCard from "./archiveTypeCardComponent.vue";
import { EnumPermission } from "@/utilities/EnumSystem";
import { storeToRefs } from "pinia";
import IPage from "@/components/ihec/IPage.vue";

const { checkPermissionAccessArray } = usePermissionsStore();
const isLoading = ref(false);
const archiveTypeStore = useArchiveTypeStore();
const { archiveTypes } = storeToRefs(useArchiveTypeStore());

const router = useRouter();

onMounted(async () => {
  isLoading.value = true;
  checkPermissionAccessArray([EnumPermission.ShowArchiveTypes]);
  await archiveTypeStore.getBySectionUser();
  isLoading.value = false;
});

const addObject = () => {
  archiveTypeStore.resetData();
  router.push({
    name: "archiveTypeAdd",
  });
};
</script>
<template>
  <IPage :HeaderTitle="t('archiveType')" :is-loading="isLoading">
    <template #HeaderButtons>
      <IButton width="28" :onClick="addObject" :text="t('Add')" />
    </template>
    <IPageContent>
      <IRow :col="4" :col-lg="4" :col-md="3" :col-sm="1" :col-xs="1">
        <ICol
          class="my-2"
          :span="1"
          :span-lg="1"
          :span-md="1"
          v-for="item in archiveTypes"
          :key="item.id"
        >
          <ArchiveTypeCard :item="item" />
        </ICol>
      </IRow>
    </IPageContent>
  </IPage>
  <SimpleLoading v-if="isLoading"></SimpleLoading>
</template>
