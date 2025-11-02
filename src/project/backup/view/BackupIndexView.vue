<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useBackupStore } from "../backupStore";
import { t } from "@/utilities/I18nPlugin";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
import type { IBackupFile, IBackupFileFilter } from "../IBackup";
import SimpleLoading from "@/components/general/loading.vue";
import Swal from "sweetalert2";
import moment from "moment";
import { storeToRefs } from "pinia";

const { checkPermissionAccessArray } = usePermissionsStore();
const router = useRouter();
const backupStore = useBackupStore();

const {
  backupFiles,
  isLoadingBackups,
  isRunningBackup,
  totalBackups,
  totalSizeMB,
  lastBackup,
} = storeToRefs(backupStore);

const {
  getBackupList,
  getBackupListFiltered,
  runBackup,
  deleteBackup,
  deleteAllBackups,
  getTempDownloadLink,
} = backupStore;

const searchQuery = ref("");
const selectedType = ref<"all" | "db" | "files" | "both">("all");
const sortBy = ref<"name" | "size" | "date">("date");
const sortOrder = ref<"asc" | "desc">("desc");

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ShowBackups]);
  await loadBackups();
});

const loadBackups = async () => {
  try {
    await getBackupList();
  } catch (error) {
    console.error("Error loading backups:", error);
    await Swal.fire({
      icon: "error",
      title: "خطأ",
      text: "فشل تحميل قائمة النسخ الاحتياطية",
    });
  }
};

const filteredBackups = computed(() => {
  let filtered = [...backupFiles.value];

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((file) =>
      file.path?.toLowerCase().includes(query)
    );
  }

  // Type filter
  if (selectedType.value !== "all") {
    filtered = filtered.filter((file) => file.type === selectedType.value);
  }

  // Sort
  filtered.sort((a, b) => {
    let compareValue = 0;
    if (sortBy.value === "name") {
      compareValue = (a.path || "").localeCompare(b.path || "");
    } else if (sortBy.value === "size") {
      compareValue = (a.size || 0) - (b.size || 0);
    } else if (sortBy.value === "date") {
      compareValue = (a.lastModified || 0) - (b.lastModified || 0);
    }
    return sortOrder.value === "asc" ? compareValue : -compareValue;
  });

  return filtered;
});

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const formatDate = (timestamp: number): string => {
  return moment.unix(timestamp).format("YYYY-MM-DD HH:mm:ss");
};

const getFileName = (path: string): string => {
  return path.split("/").pop() || path;
};

const handleRunBackup = async () => {
  const { value: backupType } = await Swal.fire({
    title: "إنشاء نسخة احتياطية",
    text: "اختر نوع النسخة الاحتياطية",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "تشغيل",
    cancelButtonText: "إلغاء",
    input: "select",
    inputOptions: {
      both: "كامل (قاعدة البيانات + الملفات)",
      db: "قاعدة البيانات فقط",
      files: "الملفات فقط",
    },
    inputPlaceholder: "اختر نوع النسخة",
    inputValidator: (value) => {
      if (!value) {
        return "يجب اختيار نوع النسخة!";
      }
    },
  });

  if (backupType) {
    try {
      await runBackup({
        backup_type: backupType as "db" | "files" | "both",
      });
      await Swal.fire({
        icon: "success",
        title: "نجح",
        text: "تم إنشاء النسخة الاحتياطية بنجاح",
        timer: 2000,
      });
      await loadBackups();
    } catch (error) {
      console.error("Error running backup:", error);
      await Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "فشل إنشاء النسخة الاحتياطية",
      });
    }
  }
};

const handleDownload = async (file: IBackupFile) => {
  try {
    const response = await getTempDownloadLink(file.path);
    const downloadUrl = response.data.url;
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  } catch (error) {
    console.error("Error downloading backup:", error);
    await Swal.fire({
      icon: "error",
      title: "خطأ",
      text: "فشل تحميل النسخة الاحتياطية",
    });
  }
};

const handleDelete = async (file: IBackupFile) => {
  const result = await Swal.fire({
    title: "هل أنت متأكد؟",
    text: `سيتم حذف النسخة الاحتياطية: ${getFileName(file.path)}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "نعم، احذف",
    cancelButtonText: "إلغاء",
  });

  if (result.isConfirmed) {
    try {
      await deleteBackup(file.path);
      await Swal.fire({
        icon: "success",
        title: "تم الحذف",
        text: "تم حذف النسخة الاحتياطية بنجاح",
        timer: 2000,
      });
    } catch (error) {
      console.error("Error deleting backup:", error);
      await Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "فشل حذف النسخة الاحتياطية",
      });
    }
  }
};

const handleDeleteAll = async () => {
  const result = await Swal.fire({
    title: "هل أنت متأكد؟",
    text: "سيتم حذف جميع النسخ الاحتياطية! هذا الإجراء لا يمكن التراجع عنه.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "نعم، احذف الكل",
    cancelButtonText: "إلغاء",
  });

  if (result.isConfirmed) {
    try {
      await deleteAllBackups();
      await Swal.fire({
        icon: "success",
        title: "تم الحذف",
        text: "تم حذف جميع النسخ الاحتياطية بنجاح",
        timer: 2000,
      });
    } catch (error) {
      console.error("Error deleting all backups:", error);
      await Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "فشل حذف النسخ الاحتياطية",
      });
    }
  }
};

const goToRestore = (file: IBackupFile) => {
  backupStore.setSelectedBackup(file);
  router.push({ name: "backupRestore", params: { id: file.path } });
};

const goToSettings = () => {
  router.push({ name: "backupSettings" });
};
</script>

<template>
  <IPage :HeaderTitle="t('Backup.List')">
    <template #HeaderButtons>
      <IButton
        width="28"
        :onClick="handleRunBackup"
        :text="t('Backup.RunBackup')"
        :disabled="isRunningBackup"
      />
      <IButton
        width="28"
        :onClick="goToSettings"
        :text="t('Settings')"
        class="ms-2"
      />
    </template>

    <IPageContent>
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">إجمالي النسخ</p>
              <p class="text-2xl font-bold text-gray-800">{{ totalBackups }}</p>
            </div>
            <div class="bg-blue-100 rounded-full p-3">
              <svg
                class="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">المساحة المستخدمة</p>
              <p class="text-2xl font-bold text-gray-800">
                {{ formatFileSize(totalSizeMB * 1024 * 1024) }}
              </p>
            </div>
            <div class="bg-green-100 rounded-full p-3">
              <svg
                class="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">آخر نسخة</p>
              <p class="text-sm font-semibold text-gray-800">
                {{
                  lastBackup
                    ? formatDate(lastBackup.lastModified)
                    : "لا توجد نسخ"
                }}
              </p>
            </div>
            <div class="bg-purple-100 rounded-full p-3">
              <svg
                class="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >بحث</label
            >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="ابحث في النسخ..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >النوع</label
            >
            <select
              v-model="selectedType"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">الكل</option>
              <option value="both">كامل</option>
              <option value="db">قاعدة البيانات</option>
              <option value="files">الملفات</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >ترتيب حسب</label
            >
            <select
              v-model="sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">التاريخ</option>
              <option value="name">الاسم</option>
              <option value="size">الحجم</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >الترتيب</label
            >
            <select
              v-model="sortOrder"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">تنازلي</option>
              <option value="asc">تصاعدي</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Backups Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <SimpleLoading v-if="isLoadingBackups" />
        <div v-else-if="filteredBackups.length === 0" class="p-8 text-center">
          <p class="text-gray-500">لا توجد نسخ احتياطية</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  اسم الملف
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  النوع
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الحجم
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  التاريخ
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="file in filteredBackups" :key="file.path">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ getFileName(file.path) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-blue-100 text-blue-800': file.type === 'both',
                      'bg-green-100 text-green-800': file.type === 'db',
                      'bg-yellow-100 text-yellow-800': file.type === 'files',
                    }"
                  >
                    {{
                      file.type === "both"
                        ? "كامل"
                        : file.type === "db"
                        ? "قاعدة بيانات"
                        : "ملفات"
                    }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatFileSize(file.size) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(file.lastModified) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="handleDownload(file)"
                    class="text-blue-600 hover:text-blue-900 me-3"
                    title="تحميل"
                  >
                    <svg
                      class="w-5 h-5 inline"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                  <button
                    @click="goToRestore(file)"
                    class="text-green-600 hover:text-green-900 me-3"
                    title="استعادة"
                  >
                    <svg
                      class="w-5 h-5 inline"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                  <button
                    @click="handleDelete(file)"
                    class="text-red-600 hover:text-red-900"
                    title="حذف"
                  >
                    <svg
                      class="w-5 h-5 inline"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Delete All Button -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            @click="handleDeleteAll"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            :disabled="backupFiles.length === 0"
          >
            حذف جميع النسخ
          </button>
        </div>
      </div>
    </IPageContent>
  </IPage>
</template>
