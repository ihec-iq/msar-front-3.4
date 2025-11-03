<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useBackupStore } from "../backupStore";
import { t } from "@/utilities/I18nPlugin";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
import IPage from "@/components/ihec/IPage.vue";
import IPageContent from "@/components/ihec/IPageContent.vue";
import IButton from "@/components/ihec/IButton.vue";
import SimpleLoading from "@/components/general/loading.vue";
import { storeToRefs } from "pinia";
import moment from "moment";

const { checkPermissionAccessArray } = usePermissionsStore();
const backupStore = useBackupStore();
const { healthCheck, isLoadingHealth } = storeToRefs(backupStore);

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowBackupHealth]);
  await loadHealth();
});

const loadHealth = async () => {
  try {
    await backupStore.getHealthCheck();
  } catch (error) {
    console.error("Error loading health check:", error);
  }
};

const statusColor = computed(() => {
  if (!healthCheck.value) return "gray";
  switch (healthCheck.value.status) {
    case "ok": return "green";
    case "warning": return "yellow";
    case "error": return "red";
    default: return "gray";
  }
});

const statusIcon = computed(() => {
  if (!healthCheck.value) return "❓";
  switch (healthCheck.value.status) {
    case "ok": return "✅";
    case "warning": return "⚠️";
    case "error": return "❌";
    default: return "❓";
  }
});

const statusText = computed(() => {
  if (!healthCheck.value) return "غير معروف";
  switch (healthCheck.value.status) {
    case "ok": return "النظام يعمل بشكل صحيح";
    case "warning": return "تحذير";
    case "error": return "خطأ";
    default: return "غير معروف";
  }
});

const formatDate = (date: string) => {
  if (!date) return "-";
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
};

const timeSinceLastBackup = computed(() => {
  if (!healthCheck.value?.last_success_at) return null;
  const lastBackup = moment(healthCheck.value.last_success_at);
  const now = moment();
  const hours = now.diff(lastBackup, 'hours');
  const minutes = now.diff(lastBackup, 'minutes') % 60;

  if (hours < 1) return `منذ ${minutes} دقيقة`;
  if (hours < 24) return `منذ ${hours} ساعة و ${minutes} دقيقة`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} يوم و ${hours % 24} ساعة`;
});
</script>

<template>
  <IPage :HeaderTitle="t('Backup.Health')">
    <template #HeaderButtons>
      <IButton width="28" :onClick="loadHealth" text="تحديث" :disabled="isLoadingHealth" />
    </template>

    <IPageContent>
      <SimpleLoading v-if="isLoadingHealth" />

      <div v-else-if="!healthCheck" class="p-8 text-center text-gray-500">
        <div class="text-4xl mb-2">❌</div>
        <p class="text-lg font-medium">فشل تحميل حالة النظام</p>
        <p class="text-sm mt-1">تعذر الاتصال بالخادم</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Overall Status Card -->
        <div class="bg-white rounded-lg shadow-lg p-8 text-center">
          <div class="text-6xl mb-4">
            {{ statusIcon }}
          </div>
          <h2 class="text-2xl font-bold mb-2" :class="`text-${statusColor}-700`">
            {{ statusText }}
          </h2>
          <p class="text-gray-600 text-sm">
            آخر فحص: {{ formatDate(healthCheck.last_success_at) }}
          </p>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Last Successful Backup -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="font-semibold text-lg text-gray-900">آخر نسخة احتياطية ناجحة</h3>
                <p class="text-sm text-gray-500 mt-1">آخر مرة تم فيها إنشاء نسخة احتياطية بنجاح</p>
              </div>
              <span class="text-3xl">💾</span>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span class="text-sm font-medium text-gray-700">التاريخ والوقت</span>
                <span class="text-sm text-gray-900">{{ formatDate(healthCheck.last_success_at) }}</span>
              </div>

              <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span class="text-sm font-medium text-gray-700">منذ</span>
                <span class="text-sm text-gray-900">{{ timeSinceLastBackup }}</span>
              </div>
            </div>
          </div>

          <!-- System Status -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="font-semibold text-lg text-gray-900">حالة النظام</h3>
                <p class="text-sm text-gray-500 mt-1">الحالة العامة لنظام النسخ الاحتياطي</p>
              </div>
              <span class="text-3xl">{{ statusIcon }}</span>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between items-center p-3 rounded"
                :class="statusColor === 'green' ? 'bg-green-50' : statusColor === 'yellow' ? 'bg-yellow-50' : 'bg-red-50'">
                <span class="text-sm font-medium"
                  :class="statusColor === 'green' ? 'text-green-700' : statusColor === 'yellow' ? 'text-yellow-700' : 'text-red-700'">
                  الحالة
                </span>
                <span class="text-sm font-semibold"
                  :class="statusColor === 'green' ? 'text-green-900' : statusColor === 'yellow' ? 'text-yellow-900' : 'text-red-900'">
                  {{ statusText }}
                </span>
              </div>

              <div class="p-3 bg-blue-50 rounded">
                <p class="text-sm text-blue-800">
                  {{ healthCheck.status === 'ok'
                    ? 'جميع أنظمة النسخ الاحتياطي تعمل بشكل طبيعي'
                    : 'يرجى التحقق من إعدادات النسخ الاحتياطي' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Info Box -->
        <div class="bg-blue-50 border-r-4 border-blue-500 p-4 rounded">
          <div class="flex items-start">
            <span class="text-2xl me-3">ℹ️</span>
            <div>
              <h4 class="font-semibold text-blue-900 mb-1">معلومات</h4>
              <p class="text-sm text-blue-800">
                يتم فحص حالة النظام تلقائياً. إذا كانت هناك أي مشاكل، سيتم إرسال إشعارات للمسؤولين.
                آخر نسخة احتياطية ناجحة كانت {{ timeSinceLastBackup }}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </IPageContent>
    <template #Footer>
      <IFooterCrud :show-add="false" :show-update="false" :show-delete="false" />
    </template>
  </IPage>
</template>
