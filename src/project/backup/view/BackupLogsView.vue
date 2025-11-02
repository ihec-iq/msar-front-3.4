<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useBackupStore } from "../backupStore";
import { t } from "@/utilities/I18nPlugin";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
import IPage from "@/components/ihec/IPage.vue";
import IPageContent from "@/components/ihec/IPageContent.vue";
import SimpleLoading from "@/components/general/loading.vue";
import dayjs from "dayjs";

const { checkPermissionAccessArray } = usePermissionsStore();
const backupStore = useBackupStore();

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowBackupLogs]);
  await backupStore.getBackupLogs();
});

const formatDate = (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm:ss");

const getStatusColor = (status: string) => {
  switch (status) {
    case "success": return "bg-green-100 text-green-800";
    case "failed": return "bg-red-100 text-red-800";
    case "running": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "success": return "نجح";
    case "failed": return "فشل";
    case "running": return "قيد التشغيل";
    default: return status;
  }
};
</script>

<template>
  <IPage :HeaderTitle="t('Backup.Logs')">
    <IPageContent>
      <div class="bg-white rounded-lg shadow">
        <SimpleLoading v-if="backupStore.isLoadingLogs" />
        <div v-else-if="backupStore.logs.length === 0" class="p-8 text-center text-gray-500">
          لا توجد سجلات
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">#</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النوع</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الرسالة</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="log in backupStore.logs" :key="log.id">
                <td class="px-6 py-4 text-sm text-gray-900">{{ log.id }}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs rounded-full" :class="log.backup_type === 'auto' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'">
                    {{ log.backup_type === "auto" ? "تلقائي" : "يدوي" }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs rounded-full" :class="getStatusColor(log.status)">
                    {{ getStatusLabel(log.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(log.created_at) }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ log.message || "-" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </IPageContent>
  </IPage>
</template>
