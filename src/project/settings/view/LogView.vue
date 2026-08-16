<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { t } from "@/utilities/I18nPlugin";
import { Icon } from "@iconify/vue";

import { ref, onMounted, computed } from "vue";
import IButton2 from "@/components/ihec/IButton2.vue";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";
import { useSettingsStore } from "../settingsStore"; // ← الستور الجديد

//region Toast
import { useToast, POSITION } from "vue-toastification";
import IRow from "@/components/ihec/IRow.vue";
import ICol from "@/components/ihec/ICol.vue";
import IFooterCrud from "@/components/ihec/IFooterCrud.vue";
const toast = useToast();
const showErrorToast = (message = "") => {
  toast.error(message, {
    position: POSITION.TOP_CENTER,
    timeout: 2500,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
  });
};
const showSuccessToast = (message = "") => {
  toast.success(message, {
    position: POSITION.TOP_CENTER,
    timeout: 2500,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
  });
};
//endregion

//#region Vars (الأصلية)
const { checkPermissionAccessArray } = usePermissionsStore();
const namePage = ref(t("Loges.View"));
const route = useRoute();
const Loading = ref(false);
const router = useRouter();

// ====== إعداد baseURL ديناميكي للستور ======
const settingsStore = useSettingsStore();

// ربط واجهة الصفحة بحالة الستور
const {
  logMeta,
  logTailLines,
  logTailCount,
  logLoading,
  logUploading,
  logClearing,
} = storeToRefs(settingsStore);

// تنسيقات مساعدة
const logSizeHuman = computed(() => {
  const size = logMeta.value?.size ?? 0;
  const units = ["B", "KB", "MB", "GB"];
  let s = size;
  let i = 0;
  while (s >= 1024 && i < units.length - 1) {
    s /= 1024;
    i++;
  }
  return `${s.toFixed(2)} ${units[i]}`;
});
const logUpdatedAtHuman = computed(() => {
  return logMeta.value?.updated_at
    ? new Date(logMeta.value?.updated_at).toLocaleString()
    : "—";
});

// عمليات اللوج عبر الستور
const fetchLogMeta = () =>
  settingsStore
    .get_meta()
    .catch((e) => showErrorToast(e?.message || "فشل في جلب معلومات اللوج"));
const fetchLogTail = () =>
  settingsStore
    .get_tail(logTailCount.value)
    .catch((e) => showErrorToast(e?.message || "فشل في جلب ذيل الملف"));
const openLog = () => {
  const url = settingsStore.download_log();
  // if (!url) return showErrorToast("Base URL غير مهيأ");
  // window.open(url, "_blank");
};
const clearLog = async () => {
  if (!confirm("متأكد تريد تفريغ الملف؟ هذه العملية لا يمكن التراجع عنها."))
    return;
  await settingsStore
    .clear_log()
    .then(() => {
      showSuccessToast("تم تفريغ الملف");
    })
    .catch((e) => showErrorToast(e?.message || "تعذر تفريغ الملف"));
};
const onUploadLog = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  if (file.type && file.type !== "text/plain") {
    showErrorToast("يجب أن يكون الملف نصّي (text/plain)");
    input.value = "";
    return;
  }
  await settingsStore
    .upload_log(file)
    .then(() => showSuccessToast("تم رفع الملف بنجاح"))
    .catch((e) => showErrorToast(e?.message || "تعذر رفع الملف"))
    .finally(() => {
      input.value = "";
    });
};

onMounted(async () => {
  try {
    await fetchLogMeta();
    await fetchLogTail();
  } catch {
    // تجاهل الأخطاء الأولية
  }
});
</script>

<style></style>

<template>
  <IPage :HeaderTitle="namePage">
    <IPageContent>
      <!-- ====== إدارة ملف laravel.log عبر الستور ====== -->
      <div
        class="mt-6 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 md:p-6"
      >
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <div class="flex items-center gap-2">
            <Icon
              icon="mdi:file-document-outline"
              class="w-5 h-5 text-text dark:text-textLight"
            />
            <h2
              class="text-lg md:text-xl font-bold text-text dark:text-textLight"
            >
              إدارة ملف <span class="font-mono">laravel.log</span>
            </h2>
          </div>
          <div class="flex items-center gap-2">
            <IButton2
              :text="'تحديث'"
              :variant="EnumButtonType.Outlined"
              :disabled="logLoading"
              @click="
                () => {
                  fetchLogMeta();
                  fetchLogTail();
                }
              "
            >
              <template #icon>
                <Icon
                  :icon="logLoading ? 'mdi:loading' : 'mdi:refresh'"
                  :class="logLoading ? 'animate-spin' : ''"
                />
              </template>
            </IButton2>

            <IButton2
              :text="'فتح/تنزيل'"
              :variant="EnumButtonType.Primary"
              :disabled="!logMeta?.exists"
              @click="openLog"
            >
              <template #icon>
                <Icon icon="mdi:tray-arrow-down" />
              </template>
            </IButton2>

            <IButton2
              :text="'تفريغ'"
              :variant="EnumButtonType.Outlined"
              :disabled="logClearing || !logMeta?.exists"
              @click="clearLog"
            >
              <template #icon>
                <Icon
                  :icon="logClearing ? 'mdi:loading' : 'mdi:trash-can-outline'"
                  :class="logClearing ? 'animate-spin' : ''"
                />
              </template>
            </IButton2>

            <label
              class="inline-flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
            >
              <Icon
                :icon="logUploading ? 'mdi:loading' : 'mdi:upload'"
                :class="logUploading ? 'animate-spin' : ''"
              />
              <span>{{ logUploading ? "يرفع..." : "رفع ملف" }}</span>
              <input
                type="file"
                class="hidden"
                accept=".log,text/plain"
                @change="onUploadLog"
              />
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div class="bg-lightInput dark:bg-input rounded-xl p-3">
            <div class="text-xs text-gray-500 dark:text-gray-400">الحالة</div>
            <div class="text-base font-medium text-text dark:text-textLight">
              {{ logMeta?.exists ? "موجود" : "غير موجود" }}
            </div>
          </div>
          <div class="bg-lightInput dark:bg-input rounded-xl p-3">
            <div class="text-xs text-gray-500 dark:text-gray-400">الحجم</div>
            <div class="text-base font-medium text-text dark:text-textLight">
              {{ logSizeHuman }}
            </div>
          </div>
          <div class="bg-lightInput dark:bg-input rounded-xl p-3">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              آخر تعديل
            </div>
            <div class="text-base font-medium text-text dark:text-textLight">
              {{ logUpdatedAtHuman }}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3 mt-4 flex-wrap">
          <div class="text-sm text-text dark:text-textLight">
            عدد الأسطر للعرض السريع
          </div>
          <input
            type="number"
            min="10"
            max="5000"
            v-model.number="logTailCount"
            class="w-28 rounded-md border border-gray-300 dark:border-gray-700 bg-lightInput dark:bg-input text-text dark:text-textLight h-9 px-2"
          />
          <IButton2
            :text="'اعرض الذيل'"
            :variant="EnumButtonType.Outlined"
            :disabled="logLoading"
            @click="fetchLogTail"
          >
            <template #icon>
              <Icon
                :icon="logLoading ? 'mdi:loading' : 'mdi:eye-outline'"
                :class="logLoading ? 'animate-spin' : ''"
              />
            </template>
          </IButton2>
        </div>

        <div
          class="mt-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div
            class="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 text-sm text-text dark:text-textLight"
          >
            <span>آخر {{ logTailCount }} سطر</span>
            <span v-if="logLoading" class="opacity-70">جارِ التحميل…</span>
          </div>
          <pre
            class="max-h-[60vh] overflow-auto text-sm leading-6 p-4 whitespace-pre-wrap bg-black text-green-200"
          >
    {{ logTailLines.join("\n") || "لا يوجد محتوى لعرضه." }}
  </pre>
        </div>
      </div>
    </IPageContent>

    <template #Footer>
      <IFooterCrud
        :show-add="false"
        :show-update="false"
        :show-delete="false"
      />
    </template>
  </IPage>
</template>
