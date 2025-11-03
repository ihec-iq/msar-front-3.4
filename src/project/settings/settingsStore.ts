import { ref } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";

type LogMeta = {
  exists: boolean;
  size: number;
  updated_at: string | null;
};

export const useSettingsStore = defineStore("settingsStore", () => {
  // حالة مشتركة قابلة للاستخدام داخل الصفحات
  const logMeta = ref<LogMeta | null>(null);
  const logTailLines = ref<string[]>([]);
  const logTailCount = ref<number>(100);

  // فلاغات بسيطة لحالة التحميل/الرفع/التفريغ
  const logLoading = ref<boolean>(false);
  const logUploading = ref<boolean>(false);
  const logClearing = ref<boolean>(false);
  // مسار أساس للراوتات الخاصة باللوج في الباك
  const pathUrl = `/logs`;

  // جلب معلومات الملف (meta)
  async function get_meta() {
    logLoading.value = true;
    try {
      const response = await Api.get(`${pathUrl}`);
      logMeta.value = response.data as LogMeta;
      return response;
    } finally {
      logLoading.value = false;
    }
  }

  // جلب آخر N أسطر
  async function get_tail(lines: number = logTailCount.value) {
    logLoading.value = true;
    try {
      const response = await Api.get(`${pathUrl}/tail`, { params: { lines } });
      logTailLines.value = (response.data?.lines as string[]) || [];
      return response;
    } finally {
      logLoading.value = false;
    }
  }

  // رابط التحميل/الفتح المباشر (يفتح تبويب جديد)
  function getDownloadUrl(): string {
    const base = (Api.defaults.baseURL || "").replace(/\/+$/, "");
    return `${base}${pathUrl}/download`;
  }
  async function download_log(): Promise<void> {
    // XHR مع credentials → Sanctum لن يحاول redirect
     const res = await Api.get(`${pathUrl}/download`, {
      responseType: "blob",
    });
    const blob = new Blob([res.data], { type: "text/plain;charset=utf-8" });

    // افتح في تبويب/نزّل الملف بشكل آمن
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "laravel.log"; // لو تريده يفتح تبويب: علّق هالسطر وخلي target
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // تفريغ الملف
  async function clear_log() {
    logClearing.value = true;
    try {
      const response = await Api.delete(`${pathUrl}`);
      // بعد التفريغ نحدّث الحالة
      await get_meta();
      logTailLines.value = [];
      return response;
    } finally {
      logClearing.value = false;
    }
  }

  // رفع ملف جديد (استبدال)
  async function upload_log(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    logUploading.value = true;
    try {
      const response = await Api.post(`${pathUrl}/upload`, fd);
      // بعد الرفع نحدّث الحالة
      await Promise.all([get_meta(), get_tail()]);
      return response;
    } finally {
      logUploading.value = false;
    }
  }

  return {
    // state
    logMeta,
    logTailLines,
    logTailCount,
    logLoading,
    logUploading,
    logClearing,
    // actions
    get_meta,
    get_tail,
    clear_log,
    upload_log,
    getDownloadUrl,
    download_log,
  };
});
