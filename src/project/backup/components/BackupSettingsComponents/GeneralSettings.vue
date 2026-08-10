<script setup lang="ts">
import type { IBackupSettings } from "../../IBackup";

const formData = defineModel<IBackupSettings>("formData", {
  required: true,
});
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-300">
        الإعدادات العامة
      </h2>
      <p class="text-gray-600 mt-1 dark:text-gray-400">
        التحكم في النظام الأساسي للنسخ الاحتياطي
      </p>
    </div>

    <!-- Backup Path and Max Storage - Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Backup Path -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <label class="block font-medium text-gray-900 mb-3"
          >مسار حفظ النسخ الاحتياطية</label
        >
        <input
          type="text"
          v-model="formData.backup_path"
          placeholder="storage/app/backups"
          class="w-full px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p class="mt-2 text-sm text-gray-500">
          المسار النسبي لحفظ ملفات النسخ الاحتياطي
        </p>
      </div>

      <!-- Max Storage -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <label class="block font-medium text-gray-900 mb-3"
          >الحد الأقصى للمساحة</label
        >
        <input
          type="number"
          v-model.number="formData.max_storage_mb"
          min="100"
          class="w-full px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p class="mt-2 text-sm text-gray-500">
          {{ (formData.max_storage_mb / 1024).toFixed(2) }} GB
        </p>
      </div>
    </div>
  </div>
</template>
