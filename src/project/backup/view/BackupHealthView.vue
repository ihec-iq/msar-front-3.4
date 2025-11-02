<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useBackupStore } from "../backupStore";
import { t } from "@/utilities/I18nPlugin";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
import IPage from "@/components/ihec/IPage.vue";
import IPageContent from "@/components/ihec/IPageContent.vue";
import IButton from "@/components/ihec/IButton.vue";
import SimpleLoading from "@/components/general/loading.vue";

const { checkPermissionAccessArray } = usePermissionsStore();
const backupStore = useBackupStore();

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowBackupHealth]);
  await loadHealth();
});

const loadHealth = async () => {
  await backupStore.getHealthCheck();
};

const overallStatusColor = computed(() => {
  if (!backupStore.healthCheck) return "gray";
  switch (backupStore.healthCheck.overall_status) {
    case "healthy": return "green";
    case "warning": return "yellow";
    case "error": return "red";
    default: return "gray";
  }
});

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pass": return "✅";
    case "warning": return "⚠️";
    case "fail": return "❌";
    default: return "❓";
  }
};
</script>

<template>
  <IPage :HeaderTitle="t('Backup.Health')">
    <template #HeaderButtons>
      <IButton width="28" :onClick="loadHealth" :text="t('Refresh')" />
    </template>
    <IPageContent>
      <SimpleLoading v-if="backupStore.isLoadingHealth" />
      <div v-else-if="!backupStore.healthCheck" class="p-8 text-center text-gray-500">
        فشل تحميل حالة النظام
      </div>
      <div v-else class="space-y-6">
        <div class="bg-white rounded-lg shadow p-8 text-center">
          <div class="text-6xl mb-4">
            {{ overallStatusColor === "green" ? "✅" : overallStatusColor === "yellow" ? "⚠️" : "❌" }}
          </div>
          <h2 class="text-2xl font-bold mb-2" :class="`text-${overallStatusColor}-700`">
            {{ backupStore.healthCheck.overall_status === "healthy" ? "النظام يعمل بشكل صحيح" :
               backupStore.healthCheck.overall_status === "warning" ? "تحذير" : "خطأ" }}
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold">آخر نسخة ناجحة</h3>
              <span class="text-2xl">{{ getStatusIcon(backupStore.healthCheck.checks.last_backup_success.status) }}</span>
            </div>
            <p class="text-sm text-gray-600">{{ backupStore.healthCheck.checks.last_backup_success.message }}</p>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold">مساحة القرص</h3>
              <span class="text-2xl">{{ getStatusIcon(backupStore.healthCheck.checks.disk_space.status) }}</span>
            </div>
            <p class="text-sm text-gray-600">{{ backupStore.healthCheck.checks.disk_space.message }}</p>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold">الإعدادات</h3>
              <span class="text-2xl">{{ getStatusIcon(backupStore.healthCheck.checks.configuration.status) }}</span>
            </div>
            <p class="text-sm text-gray-600">{{ backupStore.healthCheck.checks.configuration.message }}</p>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold">تحذير النسخ القديمة</h3>
              <span class="text-2xl">{{ getStatusIcon(backupStore.healthCheck.checks.stale_backup.status) }}</span>
            </div>
            <p class="text-sm text-gray-600">{{ backupStore.healthCheck.checks.stale_backup.message }}</p>
          </div>
        </div>
      </div>
    </IPageContent>
  </IPage>
</template>
