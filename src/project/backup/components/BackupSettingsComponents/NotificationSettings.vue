<script setup lang="ts">
import type { IBackupSettings } from "../../IBackup";
import EmailNotifications from "./EmailNotifications.vue";
import TelegramNotifications from "./TelegramNotifications.vue";
import WebhookNotifications from "./WebhookNotifications.vue";

defineProps<{
  formData: IBackupSettings;
}>();
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-300">إعدادات الإشعارات</h2>
      <p class="text-gray-600 mt-1 dark:text-gray-400">التحكم في إشعارات حالة النسخ الاحتياطي</p>
    </div>

    <!-- Master Notification Toggle - Full Width -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h3 class="font-medium text-gray-900 ">تفعيل الإشعارات</h3>
          <p class="text-sm text-gray-500 mt-1">إرسال إشعارات عن حالة النسخ الاحتياطي</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="formData.notify_enabled" class="sr-only peer" />
          <div
            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
          ></div>
        </label>
      </div>
    </div>

    <!-- Notification Settings -->
    <div v-if="formData.notify_enabled" class="space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Notification Conditions -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 class="font-medium text-gray-900 mb-4">حالات الإشعار</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex-1">
                <label class="text-sm font-medium text-gray-700">إشعار عند النجاح</label>
                <p class="text-xs text-gray-500 mt-0.5">إرسال إشعار عند نجاح النسخ الاحتياطي</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="formData.notify_on_success" class="sr-only peer" />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex-1">
                <label class="text-sm font-medium text-gray-700">إشعار عند الفشل</label>
                <p class="text-xs text-gray-500 mt-0.5">إرسال إشعار عند فشل النسخ الاحتياطي</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="formData.notify_on_failure" class="sr-only peer" />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex-1">
                <label class="text-sm font-medium text-gray-700">إشعار المسؤولين</label>
                <p class="text-xs text-gray-500 mt-0.5">إرسال إشعارات للمسؤولين المسجلين</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="formData.notify_admins" class="sr-only peer" />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Stale Hours -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <label class="block font-medium text-gray-900 mb-3">عدد الساعات للإشعار بالتأخير</label>
          <input
            type="number"
            v-model.number="formData.stale_hours"
            min="0"
            class="w-full px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p class="mt-2 text-sm text-gray-500">
            إرسال إشعار إذا لم يتم تشغيل نسخة احتياطية خلال هذه المدة
          </p>
        </div>
      </div>

      <!-- Email Notifications -->
      <EmailNotifications :formData="formData" />

      <!-- Telegram Notifications -->
      <TelegramNotifications :formData="formData" />

      <!-- Webhook Notifications -->
      <WebhookNotifications :formData="formData" />
    </div>
  </div>
</template>
