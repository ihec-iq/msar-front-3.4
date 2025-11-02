<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useBackupStore } from "../backupStore";
import { t } from "@/utilities/I18nPlugin";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
import type { IBackupLogFilter } from "../IBackup";
import IPage from "@/components/ihec/IPage.vue";
import IPageContent from "@/components/ihec/IPageContent.vue";
import IButton from "@/components/ihec/IButton.vue";
import SimpleLoading from "@/components/general/loading.vue";
import moment from "moment";
import { storeToRefs } from "pinia";

const { checkPermissionAccessArray } = usePermissionsStore();
const backupStore = useBackupStore();
const { logs, isLoadingLogs } = storeToRefs(backupStore);

// Filters
const filters = ref<IBackupLogFilter>({
  status: "all",
  type: "all",
  limit: 50,
  page: 1,
});

// Expanded row for details
const expandedLogId = ref<number | null>(null);

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowBackupLogs]);
  await loadLogs();
});

const loadLogs = async () => {
  try {
    // Remove "all" values from filters before sending to API
    const apiFilters: IBackupLogFilter = { ...filters.value };
    if (apiFilters.status === "all") delete apiFilters.status;
    if (apiFilters.type === "all") delete apiFilters.type;

    await backupStore.getBackupLogs(apiFilters);
  } catch (error) {
    console.error("Error loading logs:", error);
  }
};

const refreshLogs = async () => {
  filters.value.page = 1;
  await loadLogs();
};

const applyFilters = async () => {
  filters.value.page = 1;
  await loadLogs();
};

const clearFilters = async () => {
  filters.value = {
    status: "all",
    type: "all",
    limit: 50,
    page: 1,
  };
  await loadLogs();
};

const toggleExpand = (logId: number) => {
  expandedLogId.value = expandedLogId.value === logId ? null : logId;
};

const formatDate = (date: string) => {
  if (!date) return "-";
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
};

const formatDuration = (duration?: number) => {
  if (!duration) return "-";
  if (duration < 60) return `${duration.toFixed(0)} ثانية`;
  if (duration < 3600) return `${(duration / 60).toFixed(1)} دقيقة`;
  return `${(duration / 3600).toFixed(1)} ساعة`;
};

const formatSize = (size?: number) => {
  if (!size) return "-";
  if (size < 1024) return `${size} بايت`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} كيلوبايت`;
  return `${(size / (1024 * 1024)).toFixed(2)} ميغابايت`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "success": return "bg-green-100 text-green-800";
    case "failed": return "bg-red-100 text-red-800";
    case "running": return "bg-blue-100 text-blue-800";
    case "pending": return "bg-yellow-100 text-yellow-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "success": return "نجح";
    case "failed": return "فشل";
    case "running": return "قيد التشغيل";
    case "pending": return "قيد الانتظار";
    default: return status;
  }
};

const filteredLogsCount = computed(() => logs.value.length);
</script>

<template>
  <IPage :HeaderTitle="t('Backup.Logs')">
    <template #HeaderButtons>
      <IButton
        width="24"
        :onClick="refreshLogs"
        text="تحديث"
        :disabled="isLoadingLogs"
      />
    </template>

    <IPageContent>
      <!-- Filters Section -->
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">الكل</option>
              <option value="success">نجح</option>
              <option value="failed">فشل</option>
              <option value="running">قيد التشغيل</option>
              <option value="pending">قيد الانتظار</option>
            </select>
          </div>

          <!-- Backup Type Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">النوع</label>
            <select
              v-model="filters.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">الكل</option>
              <option value="manual">يدوي</option>
              <option value="auto">تلقائي</option>
            </select>
          </div>

          <!-- Limit Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">عدد النتائج</label>
            <select
              v-model.number="filters.limit"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-end gap-2">
            <button
              @click="applyFilters"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              :disabled="isLoadingLogs"
            >
              تطبيق
            </button>
            <button
              @click="clearFilters"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
              :disabled="isLoadingLogs"
            >
              إعادة تعيين
            </button>
          </div>
        </div>

        <!-- Results Count -->
        <div class="mt-3 text-sm text-gray-600">
          عدد السجلات: <span class="font-semibold">{{ filteredLogsCount }}</span>
        </div>
      </div>

      <!-- Logs Table -->
      <div class="bg-white rounded-lg shadow">
        <SimpleLoading v-if="isLoadingLogs" />
        <div v-else-if="logs.length === 0" class="p-8 text-center text-gray-500">
          <div class="text-4xl mb-2">📝</div>
          <p class="text-lg font-medium">لا توجد سجلات</p>
          <p class="text-sm mt-1">لم يتم العثور على سجلات مطابقة للفلاتر المحددة</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase w-12"></th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">#</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النوع</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحجم</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المدة</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الرسالة</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <template v-for="log in logs" :key="log.id">
                <!-- Main Row -->
                <tr
                  class="hover:bg-gray-50 cursor-pointer transition-colors"
                  @click="toggleExpand(log.id)"
                >
                  <td class="px-4 py-4 text-center">
                    <button class="text-gray-400 hover:text-gray-600">
                      <span v-if="expandedLogId === log.id">▼</span>
                      <span v-else>▶</span>
                    </button>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">{{ log.id }}</td>
                  <td class="px-6 py-4">
                    <span
                      class="px-2 py-1 text-xs rounded-full"
                      :class="log.type === 'auto' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'"
                    >
                      {{ log.type === "auto" ? "تلقائي" : "يدوي" }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs rounded-full" :class="getStatusColor(log.status)">
                      {{ getStatusLabel(log.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ formatSize(log.total_size) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ formatDuration(log.duration) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(log.created_at) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    <span class="truncate max-w-xs block">{{ log.message || "-" }}</span>
                  </td>
                </tr>

                <!-- Expanded Details Row -->
                <tr v-if="expandedLogId === log.id" class="bg-gray-50">
                  <td colspan="8" class="px-6 py-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <!-- Left Column -->
                      <div class="space-y-3">
                        <div>
                          <span class="font-semibold text-gray-700">تشمل الملفات:</span>
                          <span class="ms-2">{{ log.include_files ? "نعم" : "لا" }}</span>
                        </div>

                        <div v-if="log.databases && log.databases.length > 0">
                          <span class="font-semibold text-gray-700">قواعد البيانات:</span>
                          <div class="mt-1 flex flex-wrap gap-1">
                            <span
                              v-for="db in log.databases"
                              :key="db"
                              class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                            >
                              {{ db }}
                            </span>
                          </div>
                        </div>

                        <div v-if="log.checksum">
                          <span class="font-semibold text-gray-700">Checksum:</span>
                          <div class="mt-1 font-mono text-xs bg-gray-100 p-2 rounded break-all">
                            {{ log.checksum }}
                          </div>
                        </div>
                      </div>

                      <!-- Right Column -->
                      <div class="space-y-3">
                        <div v-if="log.started_at">
                          <span class="font-semibold text-gray-700">وقت البدء:</span>
                          <span class="ms-2">{{ formatDate(log.started_at) }}</span>
                        </div>

                        <div v-if="log.completed_at">
                          <span class="font-semibold text-gray-700">وقت الانتهاء:</span>
                          <span class="ms-2">{{ formatDate(log.completed_at) }}</span>
                        </div>

                        <div v-if="log.error_details" class="col-span-2">
                          <span class="font-semibold text-red-700">تفاصيل الخطأ:</span>
                          <div class="mt-1 p-3 bg-red-50 border border-red-200 rounded text-red-800">
                            {{ log.error_details }}
                          </div>
                        </div>

                        <div v-if="log.files && log.files.length > 0">
                          <span class="font-semibold text-gray-700">الملفات المضمنة:</span>
                          <div class="mt-1 text-xs text-gray-600 max-h-20 overflow-y-auto">
                            <div v-for="file in log.files" :key="file" class="py-1">
                              {{ file }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </IPageContent>
  </IPage>
</template>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
