<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBackupStore } from "../backupStore";
import { t } from "@/utilities/I18nPlugin";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
import IPage from "@/components/ihec/IPage.vue";
import IPageContent from "@/components/ihec/IPageContent.vue";
import IButton from "@/components/ihec/IButton.vue";
import Swal from "sweetalert2";

const { checkPermissionAccessArray } = usePermissionsStore();
const backupStore = useBackupStore();
const route = useRoute();
const router = useRouter();

const backupPath = ref<string>("");
const restoreDatabase = ref(true);
const restoreFiles = ref(true);
const verifyChecksum = ref(true);
const isRestoring = ref(false);

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.RestoreBackup]);
  backupPath.value = route.params.id as string;
});

const restore = async () => {
  const result = await Swal.fire({
    title: "تأكيد الاستعادة",
    html: `
      <p>سيتم استعادة النسخة الاحتياطية</p>
      <p class="text-red-600 font-bold mt-4">تحذير: سيتم استبدال البيانات الحالية!</p>
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم، استعد",
    cancelButtonText: "إلغاء",
    confirmButtonColor: "#d33",
  });

  if (result.isConfirmed) {
    isRestoring.value = true;
    try {
      await backupStore.restoreBackup({
        backup_log_id: 0,
        restore_database: restoreDatabase.value,
        restore_files: restoreFiles.value,
        verify_checksum: verifyChecksum.value,
      });

      await Swal.fire({
        icon: "success",
        title: "نجحت الاستعادة",
        text: "تم استعادة النسخة الاحتياطية بنجاح",
      });

      router.push({ name: "backupIndex" });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "فشلت عملية الاستعادة",
      });
    } finally {
      isRestoring.value = false;
    }
  }
};

const cancel = () => {
  router.push({ name: "backupIndex" });
};
</script>

<template>
  <IPage :HeaderTitle="t('Backup.Restore')">
    <template #HeaderButtons>
      <IButton width="24" :onClick="restore" :text="t('Restore')" :disabled="isRestoring" />
      <IButton width="24" :onClick="cancel" :text="t('Cancel')" class="ms-2 bg-gray-500 hover:bg-gray-600" />
    </template>

    <IPageContent>
      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">استعادة نسخة احتياطية</h2>

          <div class="mb-6 p-4 bg-red-50 border-r-4 border-red-500 rounded">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="me-3">
                <h3 class="text-sm font-medium text-red-800">تحذير مهم</h3>
                <p class="mt-2 text-sm text-red-700">
                  عملية الاستعادة ستستبدل البيانات الحالية بالبيانات من النسخة الاحتياطية. هذا الإجراء لا يمكن التراجع عنه.
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">النسخة الاحتياطية</label>
              <input type="text" :value="backupPath" disabled class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" />
            </div>

            <div class="space-y-4">
              <h3 class="font-medium text-gray-900">خيارات الاستعادة</h3>
              
              <div class="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <label class="font-medium text-gray-700">استعادة قاعدة البيانات</label>
                  <p class="text-sm text-gray-500">استعادة جميع بيانات قاعدة البيانات</p>
                </div>
                <input type="checkbox" v-model="restoreDatabase" class="w-5 h-5" />
              </div>

              <div class="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <label class="font-medium text-gray-700">استعادة الملفات</label>
                  <p class="text-sm text-gray-500">استعادة جميع الملفات والمجلدات</p>
                </div>
                <input type="checkbox" v-model="restoreFiles" class="w-5 h-5" />
              </div>

              <div class="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <label class="font-medium text-gray-700">التحقق من Checksum</label>
                  <p class="text-sm text-gray-500">التأكد من سلامة الملفات قبل الاستعادة</p>
                </div>
                <input type="checkbox" v-model="verifyChecksum" class="w-5 h-5" />
              </div>
            </div>

            <div v-if="isRestoring" class="mt-6">
              <div class="flex justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">جاري الاستعادة...</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-blue-600 h-2.5 rounded-full animate-pulse" style="width: 100%"></div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-4 mt-8">
            <button @click="cancel" class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" :disabled="isRestoring">
              إلغاء
            </button>
            <button @click="restore" class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50" :disabled="isRestoring || (!restoreDatabase && !restoreFiles)">
              {{ isRestoring ? "جاري الاستعادة..." : "استعادة الآن" }}
            </button>
          </div>
        </div>
      </div>
    </IPageContent>
  </IPage>
</template>
