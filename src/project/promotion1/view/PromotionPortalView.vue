<script setup lang="ts">
import { onMounted } from "vue";
import { t } from "@/utilities/I18nPlugin";
import { PromotionLinks } from "../PromotionLinks"; // Updated import
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
const { checkPermissionAccessArray } = usePermissionsStore();
import CardPortalComponent from "@/components/CardPortalComponent.vue";

onMounted(async () => {
    checkPermissionAccessArray([EnumPermission.ShowArchives]); // Updated permission
});
</script>
<template>
    <IPage :HeaderTitle="t('Promotion.Portal')"> <!-- Updated title -->
        <IPageContent>
            <CardPortalComponent :links="PromotionLinks"></CardPortalComponent> <!-- Updated links -->
        </IPageContent>
    </IPage>
</template>