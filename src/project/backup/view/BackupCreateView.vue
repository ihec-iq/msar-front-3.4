<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useBackupStore } from "../backupStore";
import { t } from "@/utilities/I18nPlugin";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
import Swal from "sweetalert2";

const { checkPermissionAccessArray } = usePermissionsStore();
const router = useRouter();
const backupStore = useBackupStore();

const { isRunningBackup, backupProgress } = backupStore;
const { runBackup } = backupStore;

const selectedType = ref<"db" | "files" | "both">("both");
const isProcessing = ref(false);

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.CreateBackup]);
});

const handleCreateBackup = async () => {
  const result = await Swal.fire({
    title: "تأكيد إنشاء النسخة",
    text: `سيتم إنشاء نسخة احتياطية ${getTypeLabel(selectedType.value)}`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "نعم، أنشئ النسخة",
    cancelButtonText: "إلغاء",
  });

  if (result.isConfirmed) {
    isProcessing.value = true;
    try {
      const response = await runBackup({
        backup_type: selectedType.value,
      });

      await Swal.fire({
        icon: "success",
        title: "نجح",
        text: "تم إنشاء النسخة الاحتياطية بنجاح",
        timer: 2000,
      });

      // Redirect to backup list
      router.push({ name: "backupIndex" });
    } catch (error) {
      console.error("Error creating backup:", error);
      await Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "فشل إنشاء النسخة الاحتياطية",
      });
    } finally {
      isProcessing.value = false;
    }
  }
};

const getTypeLabel = (type: string): string => {
  switch (type) {
    case "both":
      return "كاملة (قاعدة البيانات + الملفات)";
    case "db":
      return "لقاعدة البيانات فقط";
    case "files":
      return "للملفات فقط";
    default:
      return "";
  }
};

const goBack = () => {
  router.push({ name: "backupIndex" });
};
</script>

<template>
  <IPage :HeaderTitle="t('Backup.Create')">
    <template #HeaderButtons>
      <IButton width="28" :onClick="goBack" :text="t('Back')" />
    </template>

    <IPageContent>
      <div class="max-w-2xl mx-auto">
        <!-- Info Card -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-blue-600 mt-0.5 me-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 class="text-blue-800 font-semibold mb-1">
                معلومات حول النسخ الاحتياطي
              </h3>
              <p class="text-blue-700 text-sm">
                يمكنك إنشاء نسخة احتياطية كاملة تشمل قاعدة البيانات والملفات، أو
                نسخة جزئية لأحدهما فقط. يُنصح بإنشاء نسخة كاملة بشكل دوري للحفاظ
                على سلامة البيانات.
              </p>
            </div>
          </div>
        </div>

        <!-- Backup Type Selection -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">
            اختر نوع النسخة الاحتياطية
          </h2>

          <div class="space-y-4">
            <!-- Full Backup -->
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition" :class="{
              'border-blue-500 bg-blue-50': selectedType === 'both',
              'border-gray-200 hover:border-gray-300':
                selectedType !== 'both',
            }">
              <input type="radio" v-model="selectedType" value="both" class="w-5 h-5 text-blue-600 ms-3" />
              <div class="flex-1">
                <div class="flex items-center mb-1">
                  <svg class="w-6 h-6 text-blue-600 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span class="font-semibold text-gray-800">نسخة احتياطية كاملة</span>
                  <span class="ms-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">موصى به</span>
                </div>
                <p class="text-sm text-gray-600">
                  نسخة شاملة تتضمن قاعدة البيانات وجميع الملفات
                </p>
              </div>
            </label>

            <!-- Database Only -->
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition" :class="{
              'border-blue-500 bg-blue-50': selectedType === 'db',
              'border-gray-200 hover:border-gray-300': selectedType !== 'db',
            }">
              <input type="radio" v-model="selectedType" value="db" class="w-5 h-5 text-blue-600 ms-3" />
              <div class="flex-1">
                <div class="flex items-center mb-1">
                  <svg class="w-6 h-6 text-green-600 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  <span class="font-semibold text-gray-800">قاعدة البيانات فقط</span>
                </div>
                <p class="text-sm text-gray-600">
                  نسخة احتياطية لقاعدة البيانات فقط (أسرع وأصغر حجماً)
                </p>
              </div>
            </label>

            <!-- Files Only -->
            <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition" :class="{
              'border-blue-500 bg-blue-50': selectedType === 'files',
              'border-gray-200 hover:border-gray-300':
                selectedType !== 'files',
            }">
              <input type="radio" v-model="selectedType" value="files" class="w-5 h-5 text-blue-600 ms-3" />
              <div class="flex-1">
                <div class="flex items-center mb-1">
                  <svg class="w-6 h-6 text-yellow-600 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <span class="font-semibold text-gray-800">الملفات فقط</span>
                </div>
                <p class="text-sm text-gray-600">
                  نسخة احتياطية للملفات والمجلدات فقط
                </p>
              </div>
            </label>
          </div>
        </div>

        <!-- Progress Bar (shown when processing) -->
        <div v-if="isProcessing || isRunningBackup" class="bg-white rounded-lg shadow p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            جاري إنشاء النسخة الاحتياطية...
          </h3>
          <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div class="bg-blue-600 h-4 rounded-full transition-all duration-300 flex items-center justify-center"
              :style="{ width: `${backupProgress}%` }">
              <span class="text-xs text-white font-semibold">{{ backupProgress }}%</span>
            </div>
          </div>
          <p class="text-sm text-gray-600 mt-2">
            الرجاء الانتظار... قد تستغرق هذه العملية بعض الوقت.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <button @click="goBack"
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              :disabled="isProcessing || isRunningBackup">
              إلغاء
            </button>
            <button @click="handleCreateBackup"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isProcessing || isRunningBackup">
              <svg v-if="isProcessing || isRunningBackup" class="animate-spin h-5 w-5 inline me-2"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ isProcessing || isRunningBackup ? "جاري الإنشاء..." : "إنشاء النسخة الاحتياطية" }}
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
