<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useBackupStore } from "../backupStore";
import { t } from "@/utilities/I18nPlugin";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
import type { IBackupSettings } from "../IBackup";
import IPage from "@/components/ihec/IPage.vue";
import IPageContent from "@/components/ihec/IPageContent.vue";
import IFooterCrud from "@/components/ihec/IFooterCrud.vue";
import Swal from "sweetalert2";

// Import Components
import GeneralSettings from "../components/BackupSettingsComponents/GeneralSettings.vue";
import AutoBackupSettings from "../components/BackupSettingsComponents/AutoBackupSettings.vue";
import RetentionPolicy from "../components/BackupSettingsComponents/RetentionPolicy.vue";
import NotificationSettings from "../components/BackupSettingsComponents/NotificationSettings.vue";

const { checkPermissionAccessArray } = usePermissionsStore();
const backupStore = useBackupStore();

const activeSection = ref<string>("general");
const isSaving = ref(false);

const formData = ref<IBackupSettings>({
  backup_path: "storage/app/backups",
  max_storage_mb: 10240,
  auto_backup_enabled: false,
  auto_backup_interval: 1440,
  auto_backup_type: "both",
  keep_daily_days: 7,
  keep_weekly_weeks: 4,
  keep_monthly_months: 6,
  notify_enabled: false,
  notify_on_success: true,
  notify_on_failure: true,
  stale_hours: 48,
  notify_admins: false,
  email_enabled: false,
  email_recipients: null,
  telegram_enabled: false,
  telegram_bot_token: null,
  telegram_chat_ids: null,
  webhook_enabled: false,
  webhook_urls: null,
  webhook_secret: null,
});

// Sidebar navigation items
const navigationItems = [
  { id: "general", label: "الإعدادات العامة", icon: "⚙️" },
  { id: "retention", label: "سياسة الاحتفاظ", icon: "🗓️" },
  { id: "notifications", label: "الإشعارات", icon: "🔔" },
];

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ManageBackupSettings]);
  await loadSettings();
});

const loadSettings = async () => {
  try {
    const response = await backupStore.getSettings();
    if (response.data) {
      const data = response.data;

      // Map old structure to new structure
      formData.value = {
        id: data.id,
        enabled: data.enabled || false,
        backup_path: data.backup_path || "storage/app/backups",
        max_storage_mb: data.max_storage_mb || 10240,
        auto_backup_enabled: data.auto_backup_enabled || false,
        auto_backup_interval: data.auto_backup_interval || 1440,
        auto_backup_type: data.auto_backup_type || "both",
        last_auto_backup_at: data.last_auto_backup_at,
        keep_daily_days: data.keep_daily_days || 7,
        keep_weekly_weeks: data.keep_weekly_weeks || 4,
        keep_monthly_months: data.keep_monthly_months || 6,
        notify_enabled: data.notify_enabled || false,
        notify_on_success:
          data.notify_on_success !== undefined
            ? data.notify_on_success
            : data.notify_on === "success" || data.notify_on === "both",
        notify_on_failure:
          data.notify_on_failure !== undefined
            ? data.notify_on_failure
            : data.notify_on === "failure" || data.notify_on === "both",
        stale_hours: data.stale_hours || 48,
        notify_admins: data.notify_admins || false,
        email_enabled: data.email_enabled || false,
        email_recipients:
          data.email_recipients ||
          (data.emails
            ? data.emails
              .split(",")
              .map((e: string) => e.trim())
              .filter((e: string) => e)
            : []),
        telegram_enabled: data.telegram_enabled || false,
        telegram_bot_token: data.telegram_bot_token || null,
        telegram_chat_ids:
          data.telegram_chat_ids && typeof data.telegram_chat_ids === "string"
            ? data.telegram_chat_ids
              .split(",")
              .map((id: string) => id.trim())
              .filter((id: string) => id)
            : Array.isArray(data.telegram_chat_ids)
              ? data.telegram_chat_ids
              : [],
        webhook_enabled: data.webhook_enabled || false,
        webhook_urls:
          data.webhook_url ||
          (data.webhook_urls ? data.webhook_urls.split(",")[0]?.trim() : null),
        webhook_secret: data.webhook_secret || null,
        created_at: data.created_at,
        updated_at: data.updated_at,
      } as any;
    }
  } catch (error) {
    console.error("Error loading settings:", error);
  }
};

const saveSettings = async () => {
  isSaving.value = true;
  try {
    // Convert arrays to comma-separated strings for backend
    const dataToSave: any = {
      ...formData.value,
      email_recipients:
        formData.value.email_recipients &&
          Array.isArray(formData.value.email_recipients)
          ? formData.value.email_recipients.join(",")
          : formData.value.email_recipients,
      telegram_chat_ids:
        formData.value.telegram_chat_ids &&
          Array.isArray(formData.value.telegram_chat_ids)
          ? formData.value.telegram_chat_ids.join(",")
          : formData.value.telegram_chat_ids,
      // Ensure webhook_url is a string (not array)
      webhook_urls:
        formData.value.webhook_urls && Array.isArray(formData.value.webhook_urls)
          ? formData.value.webhook_urls[0]
          : formData.value.webhook_urls,
    };

    const response = await backupStore.updateSettings(dataToSave);
    await Swal.fire({
      icon: "success",
      title: "نجاح",
      text: "تم حفظ الإعدادات بنجاح",
      timer: 2000,
    });
  } catch (error) {
    console.error("Error saving settings:", error);
    await Swal.fire({
      icon: "error",
      title: "خطأ",
      text: "فشل حفظ الإعدادات",
    });
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <IPage :HeaderTitle="t('Backup.Settings')">
    <IPageContent>
      <div class="flex gap-6">
        <!-- Sidebar Navigation -->
        <aside class="w-72 flex-shrink-0">
          <div class="bg-gray-50 rounded-xl p-2 sticky top-4">
            <nav class="space-y-1">
              <button
                v-for="item in navigationItems"
                :key="item.id"
                @click="activeSection = item.id"
                class="w-full text-right px-4 py-3 rounded-lg transition-all duration-150 flex items-center gap-3 group"
                :class="
                  activeSection === item.id
                    ? 'bg-blue-100 text-blue-600 shadow-sm font-medium'
                    : 'text-gray-600 hover:bg-blue-300 hover:text-gray-900'
                "
              >
                <span
                  class="text-xl"
                  :class="
                    activeSection === item.id ? 'scale-110' : 'group-hover:scale-110 transition-transform'
                  "
                  >{{ item.icon }}</span
                >
                <span>{{ item.label }}</span>
              </button>
            </nav>

            <!-- Save Button -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <button
                @click="saveSettings"
                :disabled="isSaving"
                class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow"
              >
                {{ isSaving ? "جاري الحفظ..." : "حفظ الإعدادات" }}
              </button>
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 min-w-0">
          <!-- General Settings Section (merged with Auto Backup) -->
          <div v-show="activeSection === 'general'" class="space-y-6">
            <GeneralSettings :formData="formData" />
            <AutoBackupSettings :formData="formData" />
          </div>

          <!-- Retention Policy Section -->
          <RetentionPolicy v-show="activeSection === 'retention'" :formData="formData" />

          <!-- Notifications Section -->
          <NotificationSettings v-show="activeSection === 'notifications'" :formData="formData" />
        </main>
      </div>
    </IPageContent>

    <template #Footer>
      <IFooterCrud :show-add="false" :show-update="false" :show-delete="false" />
    </template>
  </IPage>
</template>
