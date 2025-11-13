<script setup lang="ts">
import type { IBackupSettings } from "../../IBackup";

defineProps<{
  formData: IBackupSettings;
}>();

// Helper: Time ago formatter
const timeAgo = (dateString: string | undefined) => {
  if (!dateString) return "لم يتم بعد";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "الآن";
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffMins < 1440) return `منذ ${Math.floor(diffMins / 60)} ساعة`;
  return `منذ ${Math.floor(diffMins / 1440)} يوم`;
};
</script>

<template>
  <div>
    <div class="mb-6 pt-6 border-t border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-300">النسخ الاحتياطي التلقائي</h2>
      <p class="text-gray-600 mt-1 dark:text-gray-400">جدولة النسخ التلقائي بفترات محددة</p>
    </div>

    <!-- Enable Auto Backup - Full Width -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h3 class="font-medium text-gray-900">تفعيل النسخ التلقائي</h3>
          <p class="text-sm text-gray-500 mt-1">تشغيل نسخ احتياطية دورية تلقائياً</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="formData.auto_backup_enabled" class="sr-only peer" />
          <div
            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
          </div>
        </label>
      </div>
    </div>

    <!-- Auto Backup Settings -->
    <div v-if="formData.auto_backup_enabled" class="space-y-4">
      <!-- Interval Selection -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <label class="block font-medium text-gray-900 mb-4">الفترة الزمنية</label>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <label
            v-for="interval in [
              { value: 60, label: 'كل ساعة', sub: '60 دقيقة' },
              { value: 360, label: 'كل 6 ساعات', sub: '360 دقيقة' },
              { value: 720, label: 'كل 12 ساعة', sub: '720 دقيقة' },
              { value: 1440, label: 'يومياً', sub: '1440 دقيقة' },
              { value: 10080, label: 'أسبوعياً', sub: '10080 دقيقة' },
            ]"
            :key="interval.value"
            class="relative flex items-center p-3 bg-gray-50 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300"
            :class="
              formData.auto_backup_interval === interval.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
            "
          >
            <input
              type="radio"
              :value="interval.value"
              v-model.number="formData.auto_backup_interval"
              class="sr-only"
            />
            <div class="flex-1 text-center">
              <div class="text-sm font-semibold text-gray-900">{{ interval.label }}</div>
              <div class="text-xs text-gray-500 mt-0.5">{{ interval.sub }}</div>
            </div>
          </label>

          <label
            class="relative flex items-center p-3 bg-gray-50 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300"
            :class="
              ![60, 360, 720, 1440, 10080].includes(formData.auto_backup_interval)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
            "
          >
            <div class="flex-1">
              <input
                type="number"
                v-model.number="formData.auto_backup_interval"
                min="1"
                class="w-full px-2 py-1 border border-gray-300  text-gray-600 rounded text-center text-sm font-semibold"
                placeholder="مخصص"
              />
              <div class="text-xs text-gray-500 mt-1 text-center">دقائق</div>
            </div>
          </label>
        </div>
      </div>

      <!-- Backup Type Selection -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <label class="block font-medium text-gray-900 mb-4">نوع النسخة الاحتياطية</label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label
            v-for="type in [
              { value: 'both', label: 'قاعدة البيانات + الملفات', sub: 'نسخة كاملة' },
              { value: 'db', label: 'قاعدة البيانات فقط', sub: 'نسخة البيانات' },
              { value: 'files', label: 'الملفات فقط', sub: 'نسخة الملفات' },
            ]"
            :key="type.value"
            class="relative flex items-center p-4 bg-gray-50 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300"
            :class="
              formData.auto_backup_type === type.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            "
          >
            <input type="radio" :value="type.value" v-model="formData.auto_backup_type" class="sr-only" />
            <div class="flex-1">
              <div class="text-sm font-semibold text-gray-900">{{ type.label }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ type.sub }}</div>
            </div>
          </label>
        </div>
      </div>

      <!-- Last Auto Backup Info -->
      <div v-if="formData.last_auto_backup_at" class="bg-green-50 border border-green-200 rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="text-lg">✓</span>
          </div>
          <div>
            <div class="text-sm font-medium text-gray-700">آخر نسخة تلقائية</div>
            <div class="text-xs text-gray-500">{{ timeAgo(formData.last_auto_backup_at) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
