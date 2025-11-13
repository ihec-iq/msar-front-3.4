<script setup lang="ts">
import type { IBackupSettings } from "../../IBackup";

defineProps<{
  formData: IBackupSettings;
}>();
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-300">سياسة الاحتفاظ بالنسخ</h2>
      <p class="text-gray-600 mt-1 dark:text-gray-400">مدة الاحتفاظ بالنسخ الاحتياطية قبل حذفها تلقائياً</p>
    </div>

    <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
      <p class="text-sm text-amber-800">
        تحدد هذه الإعدادات المدة التي سيتم الاحتفاظ بالنسخ الاحتياطية قبل حذفها تلقائياً
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <label class="block font-medium text-gray-900 mb-3">النسخ اليومية</label>
        <input
          type="number"
          v-model.number="formData.keep_daily_days"
          min="0"
          class="w-full px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p class="mt-2 text-sm text-gray-500">عدد الأيام</p>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <label class="block font-medium text-gray-900 mb-3">النسخ الأسبوعية</label>
        <input
          type="number"
          v-model.number="formData.keep_weekly_weeks"
          min="0"
          class="w-full px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p class="mt-2 text-sm text-gray-500">عدد الأسابيع</p>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <label class="block font-medium text-gray-900 mb-3">النسخ الشهرية</label>
        <input
          type="number"
          v-model.number="formData.keep_monthly_months"
          min="0"
          class="w-full px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p class="mt-2 text-sm text-gray-500">عدد الأشهر</p>
      </div>
    </div>
  </div>
</template>
