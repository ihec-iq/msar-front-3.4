<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useArchiveTypeStore } from "@/views/Archive/archiveType/archiveTypeStore";
import { t } from "@/utils/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import { usePermissionStore } from "@/stores/permissionStore";
import ArchiveTypeCard from "./archiveTypeCardComponent.vue";
import { EnumPermission } from "@/utils/EnumSystem";

const { checkPermissionAccessArray } = usePermissionStore();
const isLoading = ref(false);
const archiveTypeStore = useArchiveTypeStore();
const router = useRouter();

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowArchiveTypes]);
  await getObjects();
});

const getObjects = async () => {
  isLoading.value = true;
  await archiveTypeStore
    .getBySection()
    .then((response) => {
      archiveTypeStore.archiveTypes = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
  isLoading.value = false;
};

const addObject = () => {
  archiveTypeStore.resetData();
  router.push({
    name: "archiveTypeAdd",
  });
};
</script>
<template>
  <IPage :HeaderTitle="t('archiveType')">
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
          v-for="item in archiveTypeStore.archiveTypes"
          :key="item.id"
        >
          <ArchiveTypeCard :item="item" />
        </ICol>
      </IRow>
    </IPageContent>
  </IPage>
  <SimpleLoading v-if="isLoading"></SimpleLoading>
</template>
