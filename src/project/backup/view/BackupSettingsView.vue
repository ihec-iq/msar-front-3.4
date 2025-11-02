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
  emails: "",
  telegram_bot_token: "",
  telegram_chat_ids: "",
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

    await backupStore.updateSettings(formData.value);

    await Swal.fire({
      icon: "success",
      title: "F,-",
      text: "*E -A8 'D%9/'/'* (F,'-",
      timer: 2000,
    });
  } catch (error) {
    console.error("Error saving settings:", error);
    await Swal.fire({
      icon: "error",
      title: ".7#",
      text: "A4D -A8 'D%9/'/'*",
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
    title: "%13'D (1J/ *,1J(J",
    input: "email",
    inputLabel: "'D(1J/ 'D%DC*1HFJ",
    inputPlaceholder: "example@domain.com",
    showCancelButton: true,
    confirmButtonText: "%13'D",
    cancelButtonText: "%D:'!",
  });

  if (email) {
    try {
      await backupStore.sendTestEmail({ email });
      await Swal.fire({
        icon: "success",
        title: "*E 'D%13'D",
        text: "*E %13'D 'D(1J/ 'D*,1J(J (F,'-",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: ".7#",
        text: "A4D %13'D 'D(1J/ 'D*,1J(J",
      });
    }
  }
};

const tabs = [
  { id: "general", label: "9'E", icon: "™" },
  { id: "schedule", label: "'D,/HD)", icon: "=Å" },
  { id: "scope", label: "F7'B 'DF3.", icon: "=æ" },
  { id: "storage", label: "'D*.2JF", icon: "=¾" },
  { id: "notifications", label: "'D%49'1'*", icon: "=" },
  { id: "retention", label: "'D'-*A'8", icon: "=Ä" },
];
</script>

<template>
  <IPage :HeaderTitle="t('Backup.Settings')">
    <template #HeaderButtons>
      <IButton
        width="24"
        :onClick="saveSettings"
        :text="t('Save')"
        :disabled="isSaving"
      />
    </template>

    <IPageContent>
      <div class="bg-white rounded-lg shadow-lg">
        <!-- Tabs Navigation -->
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors"
              :class="
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
            >
              <span class="me-2">{{ tab.icon }}</span>
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- General Tab -->
          <div v-show="activeTab === 'general'" class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">'D%9/'/'* 'D9'E)</h3>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">*A9JD 'DF8'E</label>
                <p class="text-sm text-gray-500">*A9JD #H *97JD F8'E 'DF3. 'D'-*J'7J</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="formData.enabled"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >'DEF7B) 'D2EFJ)</label
              >
              <select
                v-model="formData.timezone"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Asia/Baghdad">(:/'/ (Asia/Baghdad)</option>
                <option value="Asia/Riyadh">'D1J'6 (Asia/Riyadh)</option>
                <option value="Asia/Dubai">/(J (Asia/Dubai)</option>
                <option value="Asia/Kuwait">'DCHJ* (Asia/Kuwait)</option>
                <option value="Europe/London">DF/F (Europe/London)</option>
                <option value="America/New_York">FJHJH1C (America/New_York)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >'D-/ 'D#B5I DDE3'-) (MB)</label
              >
              <input
                type="number"
                v-model.number="formData.max_storage_mb"
                min="100"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p class="mt-1 text-sm text-gray-500">
                {{ (formData.max_storage_mb / 1024).toFixed(2) }} GB
              </p>
            </div>
          </div>

          <!-- Schedule Tab -->
          <div v-show="activeTab === 'schedule'" class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">%9/'/'* 'D,/HD)</h3>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >*9(J1 Cron</label
              >
              <input
                type="text"
                v-model="formData.cron"
                placeholder="0 2 * * *"
                class="w-full px-3 py-2 border border-gray-300 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p class="mt-2 text-sm text-gray-500">
                'D,/HD 'D-'DJ: {{ formData.cron }}
              </p>
              <div class="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 class="font-medium text-blue-900 mb-2">#E+D) Cron:</h4>
                <ul class="text-sm text-blue-800 space-y-1">
                  <li><code>0 2 * * *</code> - CD JHE 'D3'9) 2:00 5('-'K</li>
                  <li><code>0 */6 * * *</code> - CD 6 3'9'*</li>
                  <li><code>0 0 * * 0</code> - CD JHE #-/ EF*5A 'DDJD</li>
                  <li><code>0 3 1 * *</code> - #HD JHE EF CD 4G1 'D3'9) 3:00 5('-'K</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Scope Tab -->
          <div v-show="activeTab === 'scope'" class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">F7'B 'DF3. 'D'-*J'7J</h3>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">*6EJF 'DEDA'*</label>
                <p class="text-sm text-gray-500">F3. 'DEDA'* E9 B'9/) 'D(J'F'*</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="formData.include_files"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700"
                  >F3. 9/) BH'9/ (J'F'*</label
                >
                <p class="text-sm text-gray-500">*A9JD F3. BH'9/ (J'F'* E*9//)</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="formData.multi_db"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >E3'1'* %6'AJ) DDF3.</label
              >
              <div class="flex gap-2 mb-2">
                <input
                  type="text"
                  v-model="includePathsInput"
                  placeholder="/path/to/include"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @keypress.enter="addPath('include')"
                />
                <button
                  @click="addPath('include')"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  %6'A)
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(path, index) in formData.include_paths"
                  :key="index"
                  class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {{ path }}
                  <button
                    @click="removePath('include', index)"
                    class="ms-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >E3'1'* D'3*+F'&G'</label
              >
              <div class="flex gap-2 mb-2">
                <input
                  type="text"
                  v-model="excludePathsInput"
                  placeholder="/path/to/exclude"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @keypress.enter="addPath('exclude')"
                />
                <button
                  @click="addPath('exclude')"
                  class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  %6'A)
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(path, index) in formData.exclude_paths"
                  :key="index"
                  class="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {{ path }}
                  <button
                    @click="removePath('exclude', index)"
                    class="ms-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>
          </div>

          <!-- Storage Tab -->
          <div v-show="activeTab === 'storage'" class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">%9/'/'* 'D*.2JF</h3>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >H,G) 'D*.2JF</label
              >
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="formData.disk"
                    value="local"
                    class="me-2"
                  />
                  <span>E-DJ (Local Storage)</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="formData.disk"
                    value="google"
                    class="me-2"
                  />
                  <span>Google Drive</span>
                </label>
              </div>
            </div>

            <div v-if="formData.disk === 'google'">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >E,D/ Google Drive</label
              >
              <input
                type="text"
                v-model="formData.drive_folder"
                placeholder="Backups"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >E/) 5D'-J) 1'(7 'D*-EJD (/B'&B)</label
              >
              <input
                type="number"
                v-model.number="formData.temp_link_expiry"
                min="1"
                max="1440"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">*A9JD Checksum</label>
                <p class="text-sm text-gray-500">'D*-BB EF 3D'E) 'DEDA'*</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="formData.checksum_enabled"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>
          </div>

          <!-- Notifications Tab -->
          <div v-show="activeTab === 'notifications'" class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">%9/'/'* 'D%49'1'*</h3>

            <div class="flex items-center justify-between">
              <div>
                <label class="text-sm font-medium text-gray-700">*A9JD 'D%49'1'*</label>
                <p class="text-sm text-gray-500">%13'D %49'1'* 9F -'D) 'DF3.</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  v-model="formData.notify_enabled"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                ></div>
              </label>
            </div>

            <div v-if="formData.notify_enabled">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >'D%49'1 9F/</label
              >
              <select
                v-model="formData.notify_on"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="success">'DF,'- AB7</option>
                <option value="failure">'DA4D AB7</option>
                <option value="both">CD'GE'</option>
              </select>
            </div>

            <div v-if="formData.notify_enabled">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >'D(1J/ 'D%DC*1HFJ</label
              >
              <div class="flex gap-2 mb-2">
                <input
                  type="email"
                  v-model="newEmail"
                  placeholder="admin@example.com"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @keypress.enter="addEmail"
                />
                <button
                  @click="addEmail"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  %6'A)
                </button>
                <button
                  @click="testEmail"
                  class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  '.*('1
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(email, index) in emailsArray"
                  :key="index"
                  class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {{ email }}
                  <button
                    @click="removeEmail(index)"
                    class="ms-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>

            <div v-if="formData.notify_enabled">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Telegram Bot Token</label
              >
              <input
                type="text"
                v-model="formData.telegram_bot_token"
                placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div v-if="formData.notify_enabled">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Telegram Chat IDs</label
              >
              <input
                type="text"
                v-model="formData.telegram_chat_ids"
                placeholder="123456789, 987654321"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p class="mt-1 text-sm text-gray-500">'A5D (JFG' (A'5D)</p>
            </div>
          </div>

          <!-- Retention Tab -->
          <div v-show="activeTab === 'retention'" class="space-y-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">3J'3) 'D'-*A'8</h3>

            <div class="bg-yellow-50 border-r-4 border-yellow-500 p-4 mb-6">
              <p class="text-sm text-yellow-800">
                *-// G0G 'D%9/'/'* 'DE/) 'D*J 3J*E 'D'-*A'8 ('DF3. 'D'-*J'7J) B(D -0AG'
                *DB'&J'K
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >'DF3. 'DJHEJ) (#J'E)</label
                >
                <input
                  type="number"
                  v-model.number="formData.keep_daily_days"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >'DF3. 'D#3(H9J) (#3'(J9)</label
                >
                <input
                  type="number"
                  v-model.number="formData.keep_weekly_weeks"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >'DF3. 'D4G1J) (#4G1)</label
                >
                <input
                  type="number"
                  v-model.number="formData.keep_monthly_months"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >'DF3. 'D3FHJ) (3FH'*)</label
                >
                <input
                  type="number"
                  v-model.number="formData.keep_yearly_years"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button (Fixed at bottom) -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div class="flex justify-end gap-4">
            <button
              @click="router.push({ name: 'backupIndex' })"
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              %D:'!
            </button>
            <button
              @click="saveSettings"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              :disabled="isSaving"
            >
              {{ isSaving ? ",'1J 'D-A8..." : "-A8 'D%9/'/'*" }}
            </button>
          </div>
        </div>
      </div>
    </IPageContent>
  </IPage>
</template>
