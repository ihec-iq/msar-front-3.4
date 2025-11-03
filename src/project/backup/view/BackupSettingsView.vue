<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useBackupStore } from "../backupStore";
import { t } from "@/utilities/I18nPlugin";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
import type { IBackupSettings } from "../IBackup";
import IPage from "@/components/ihec/IPage.vue";
import IPageContent from "@/components/ihec/IPageContent.vue";
import IButton from "@/components/ihec/IButton.vue";
import Swal from "sweetalert2";

const { checkPermissionAccessArray } = usePermissionsStore();
const backupStore = useBackupStore();
const router = useRouter();

const activeTab = ref<string>("general");
const isSaving = ref(false);

const formData = ref<IBackupSettings>({
  enabled: false,
  cron: "0 2 * * *",
  timezone: "Asia/Baghdad",
  max_storage_mb: 10240,
  include_files: true,
  include_paths: [],
  exclude_paths: [],
  multi_db: false,
  selected_databases: [],
  disk: "local",
  drive_folder: "",
  temp_link_expiry: 60,
  checksum_enabled: true,
  notify_enabled: false,
  notify_on: "both",
  email_enabled: false,
  emails: "",
  telegram_enabled: false,
  telegram_bot_token: "",
  telegram_chat_ids: "",
  webhook_enabled: false,
  webhook_urls: "",
  webhook_secret: "",
  keep_daily_days: 7,
  keep_weekly_weeks: 4,
  keep_monthly_months: 6,
  keep_yearly_years: 1,
});

// For multi-input fields
const includePathsInput = ref("");
const excludePathsInput = ref("");
const emailsArray = ref<string[]>([]);
const newEmail = ref("");

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ManageBackupSettings]);
  await loadSettings();
});

const loadSettings = async () => {
  try {
    const response = await backupStore.getSettings();
    if (response.data) {
      formData.value = { ...response.data };

      // Parse comma-separated values
      if (formData.value.emails) {
        emailsArray.value = formData.value.emails.split(",").map(e => e.trim()).filter(e => e);
      }
    }
  } catch (error) {
    console.error("Error loading settings:", error);
  }
};

const saveSettings = async () => {
  isSaving.value = true;
  try {
    // Convert arrays back to comma-separated strings
    formData.value.emails = emailsArray.value.join(", ");
    const response = await backupStore.updateSettings(formData.value);
    console.log("Update response:", response);
    if(response.data) {
      console.log("Settings updated:", response.data);
    }
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

const addEmail = () => {
  if (newEmail.value && !emailsArray.value.includes(newEmail.value)) {
    emailsArray.value.push(newEmail.value);
    newEmail.value = "";
  }
};

const removeEmail = (index: number) => {
  emailsArray.value.splice(index, 1);
};

const addPath = (type: "include" | "exclude") => {
  if (type === "include" && includePathsInput.value) {
    formData.value.include_paths.push(includePathsInput.value);
    includePathsInput.value = "";
  } else if (type === "exclude" && excludePathsInput.value) {
    formData.value.exclude_paths.push(excludePathsInput.value);
    excludePathsInput.value = "";
  }
};

const removePath = (type: "include" | "exclude", index: number) => {
  if (type === "include") {
    formData.value.include_paths.splice(index, 1);
  } else {
    formData.value.exclude_paths.splice(index, 1);
  }
};

const testEmail = async () => {
  const { value: email } = await Swal.fire({
    title: "إرسال بريد تجريبي",
    input: "email",
    inputLabel: "البريد الإلكتروني",
    inputPlaceholder: "example@domain.com",
    showCancelButton: true,
    confirmButtonText: "إرسال",
    cancelButtonText: "إلغاء",
  });

  if (email) {
    try {
      await backupStore.sendTestEmail({ email });
      await Swal.fire({
        icon: "success",
        title: "تم الإرسال",
        text: "تم إرسال البريد التجريبي بنجاح",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "فشل إرسال البريد التجريبي",
      });
    }
  }
};

const tabs = [
  { id: "general", label: "عام", icon: "⚙" },
  { id: "schedule", label: "الجدولة", icon: "📅" },
  { id: "scope", label: "نطاق النسخ", icon: "📦" },
  { id: "storage", label: "التخزين", icon: "💾" },
  { id: "notifications", label: "الإشعارات", icon: "🔔" },
  { id: "retention", label: "الاحتفاظ", icon: "🗓" },
];
</script>

<template>
  <IPage :HeaderTitle="t('Backup.Settings')">
    <template #HeaderButtons>
      <IButton width="24" :onClick="saveSettings" :text="t('Save')" :disabled="isSaving" />
    </template>
    <IPageContent>
      <div class="bg-white rounded-lg shadow-lg">
        <!-- Tabs Navigation -->
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px overflow-x-auto">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
              class="whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors" :class="activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ">
              <span class="me-2">{{ tab.icon }}</span>
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- General Tab -->
          <div v-show="activeTab === 'general'" class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">الإعدادات العامة</h3>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">تفعيل النظام</label>
                <p class="text-sm text-gray-500">تفعيل أو تعطيل نظام النسخ الاحتياطي</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="formData.enabled" class="sr-only peer" />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                </div>
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">المنطقة الزمنية</label>
              <select v-model="formData.timezone"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Asia/Baghdad">بغداد (Asia/Baghdad)</option>
                <option value="Asia/Riyadh">الرياض (Asia/Riyadh)</option>
                <option value="Asia/Dubai">دبي (Asia/Dubai)</option>
                <option value="Asia/Kuwait">الكويت (Asia/Kuwait)</option>
                <option value="Europe/London">لندن (Europe/London)</option>
                <option value="America/New_York">نيويورك (America/New_York)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الحد الأقصى للمساحة (ميغابايت)</label>
              <input type="number" v-model.number="formData.max_storage_mb" min="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p class="mt-1 text-sm text-gray-500">
                {{ (formData.max_storage_mb / 1024).toFixed(2) }} GB
              </p>
            </div>
          </div>

          <!-- Schedule Tab -->
          <div v-show="activeTab === 'schedule'" class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">إعدادات الجدولة</h3>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">تعبير Cron</label>
              <input type="text" v-model="formData.cron" placeholder="0 2 * * *"
                class="w-full px-3 py-2 border border-gray-300 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p class="mt-2 text-sm text-gray-500">
                الجدول الحالي: {{ formData.cron }}
              </p>
              <div class="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 class="font-medium text-blue-900 mb-2">أمثلة Cron:</h4>
                <ul class="text-sm text-blue-800 space-y-1">
                  <li><code>0 2 * * *</code> - كل يوم الساعة 2:00 صباحاً</li>
                  <li><code>0 */6 * * *</code> - كل 6 ساعات</li>
                  <li><code>0 0 * * 0</code> - كل يوم أحد منتصف الليل</li>
                  <li><code>0 3 1 * *</code> - أول يوم من كل شهر الساعة 3:00 صباحاً</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Scope Tab -->
          <div v-show="activeTab === 'scope'" class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">نطاق النسخ الاحتياطي</h3>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">تضمين الملفات</label>
                <p class="text-sm text-gray-500">نسخ الملفات مع قاعدة البيانات</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="formData.include_files" class="sr-only peer" />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                </div>
              </label>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">نسخ عدة قواعد بيانات</label>
                <p class="text-sm text-gray-500">تفعيل نسخ قواعد بيانات متعددة</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="formData.multi_db" class="sr-only peer" />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                </div>
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">مسارات إضافية للنسخ</label>
              <div class="flex gap-2 mb-2">
                <input type="text" v-model="includePathsInput" placeholder="/path/to/include"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @keypress.enter="addPath('include')" />
                <button @click="addPath('include')"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  إضافة
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <span v-for="(path, index) in formData.include_paths" :key="index"
                  class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {{ path }}
                  <button @click="removePath('include', index)" class="ms-2 text-blue-600 hover:text-blue-800">
                    ×
                  </button>
                </span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">مسارات لاستثناءها</label>
              <div class="flex gap-2 mb-2">
                <input type="text" v-model="excludePathsInput" placeholder="/path/to/exclude"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @keypress.enter="addPath('exclude')" />
                <button @click="addPath('exclude')" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                  إضافة
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <span v-for="(path, index) in formData.exclude_paths" :key="index"
                  class="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  {{ path }}
                  <button @click="removePath('exclude', index)" class="ms-2 text-red-600 hover:text-red-800">
                    ×
                  </button>
                </span>
              </div>
            </div>
          </div>

          <!-- Storage Tab -->
          <div v-show="activeTab === 'storage'" class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">إعدادات التخزين</h3>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">وجهة التخزين</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="radio" v-model="formData.disk" value="local" class="me-2" />
                  <span>محلي (Local Storage)</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="formData.disk" value="google" class="me-2" />
                  <span>Google Drive</span>
                </label>
              </div>
            </div>

            <div v-if="formData.disk === 'google'">
              <label class="block text-sm font-medium text-gray-700 mb-2">مجلد Google Drive</label>
              <input type="text" v-model="formData.drive_folder" placeholder="Backups"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">مدة صلاحية رابط التحميل (دقائق)</label>
              <input type="number" v-model.number="formData.temp_link_expiry" min="1" max="1440"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">تفعيل Checksum</label>
                <p class="text-sm text-gray-500">التحقق من سلامة الملفات</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="formData.checksum_enabled" class="sr-only peer" />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                </div>
              </label>
            </div>
          </div>

          <!-- Notifications Tab -->
          <div v-show="activeTab === 'notifications'" class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">إعدادات الإشعارات</h3>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">تفعيل الإشعارات</label>
                <p class="text-sm text-gray-500">إرسال إشعارات عن حالة النسخ</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="formData.notify_enabled" class="sr-only peer" />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                </div>
              </label>
            </div>

            <div v-if="formData.notify_enabled">
              <label class="block text-sm font-medium text-gray-700 mb-2">الإشعار عند</label>
              <select v-model="formData.notify_on"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="success">النجاح فقط</option>
                <option value="failure">الفشل فقط</option>
                <option value="both">كلاهما</option>
              </select>
            </div>

            <!-- Email Notifications Section -->
            <div v-if="formData.notify_enabled" class="border-t pt-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <label class="text-sm font-medium text-gray-700">تفعيل إشعارات البريد الإلكتروني</label>
                  <p class="text-sm text-gray-500">إرسال إشعارات عبر البريد الإلكتروني</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="formData.email_enabled" class="sr-only peer" />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                  </div>
                </label>
              </div>

              <div v-if="formData.email_enabled">
                <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                <div class="flex gap-2 mb-2">
                  <input type="email" v-model="newEmail" placeholder="admin@example.com"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @keypress.enter="addEmail" />
                  <button @click="addEmail" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    إضافة
                  </button>
                  <button @click="testEmail" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    اختبار
                  </button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <span v-for="(email, index) in emailsArray" :key="index"
                    class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {{ email }}
                    <button @click="removeEmail(index)" class="ms-2 text-blue-600 hover:text-blue-800">
                      ×
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <!-- Telegram Notifications Section -->
            <div v-if="formData.notify_enabled" class="border-t pt-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <label class="text-sm font-medium text-gray-700">تفعيل إشعارات Telegram</label>
                  <p class="text-sm text-gray-500">إرسال إشعارات عبر Telegram</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="formData.telegram_enabled" class="sr-only peer" />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                  </div>
                </label>
              </div>

              <div v-if="formData.telegram_enabled" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Telegram Bot Token</label>
                  <input type="text" v-model="formData.telegram_bot_token"
                    placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Telegram Chat IDs</label>
                  <input type="text" v-model="formData.telegram_chat_ids" placeholder="123456789, 987654321"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <p class="mt-1 text-sm text-gray-500">افصل بينها بفاصلة</p>
                </div>
              </div>
            </div>

            <!-- Webhook Notifications Section -->
            <div v-if="formData.notify_enabled" class="border-t pt-6">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <label class="text-sm font-medium text-gray-700">تفعيل إشعارات Webhook</label>
                  <p class="text-sm text-gray-500">إرسال إشعارات عبر Webhook</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="formData.webhook_enabled" class="sr-only peer" />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                  </div>
                </label>
              </div>

              <div v-if="formData.webhook_enabled" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Webhook URLs</label>
                  <input type="text" v-model="formData.webhook_urls" placeholder="https://your-webhook.com/endpoint"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <p class="mt-1 text-sm text-gray-500">إذا كان لديك أكثر من webhook، افصل بينها بفاصلة</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Webhook Secret</label>
                  <input type="password" v-model="formData.webhook_secret" placeholder="your-secret-key"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <p class="mt-1 text-sm text-gray-500">مفتاح سري للتحقق من صحة الطلبات</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Retention Tab -->
          <div v-show="activeTab === 'retention'" class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">سياسة الاحتفاظ</h3>

            <div class="bg-yellow-50 border-r-4 border-yellow-500 p-4 mb-6">
              <p class="text-sm text-yellow-800">
                تحدد هذه الإعدادات المدة التي سيتم الاحتفاظ بالنسخ الاحتياطية قبل حذفها تلقائياً
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">النسخ اليومية (أيام)</label>
                <input type="number" v-model.number="formData.keep_daily_days" min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">النسخ الأسبوعية (أسابيع)</label>
                <input type="number" v-model.number="formData.keep_weekly_weeks" min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">النسخ الشهرية (أشهر)</label>
                <input type="number" v-model.number="formData.keep_monthly_months" min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">النسخ السنوية (سنوات)</label>
                <input type="number" v-model.number="formData.keep_yearly_years" min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button (Fixed at bottom) -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div class="flex justify-end gap-4">
            <button @click="router.push({ name: 'backupIndex' })"
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              إلغاء
            </button>
            <button @click="saveSettings"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              :disabled="isSaving">
              {{ isSaving ? "جاري الحفظ..." : "حفظ الإعدادات" }}
            </button>
          </div>
        </div>
      </div>
    </IPageContent>
    <template #Footer>
      <IFooterCrud :show-add="false" :show-update="false" :show-delete="false" />
    </template>
  </IPage>
</template>
