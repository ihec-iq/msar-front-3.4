<script setup lang="ts">
import { ref } from "vue";
import type { IBackupSettings } from "../../IBackup";
import { useBackupStore } from "../../backupStore";
import Swal from "sweetalert2";
import { t } from "@/utilities/I18nPlugin";

const props = defineProps<{
  formData: IBackupSettings;
}>();

const backupStore = useBackupStore();
const newTelegramChatId = ref("");

// Telegram chat IDs management
const addTelegramChatId = () => {
  if (!props.formData.telegram_chat_ids) {
    props.formData.telegram_chat_ids = [];
  }
  if (newTelegramChatId.value && !props.formData.telegram_chat_ids.includes(newTelegramChatId.value)) {
    props.formData.telegram_chat_ids.push(newTelegramChatId.value);
    newTelegramChatId.value = "";
  }
};

const removeTelegramChatId = (index: number) => {
  if (props.formData.telegram_chat_ids) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn m-2 bg-red-700",
        cancelButton: "btn bg-grey-400",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: t("Are You Sure?"),
        text: t("You Won't Be Able To Revert This!"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: t("Yes, delete it!"),
        cancelButtonText: t("No, cancel!"),
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          await backupStore.updateSettings(dataToSave);

          await archiveTypeStore._delete(archiveType.id).then(() => {
            swalWithBootstrapButtons.fire(
              t("Deleted!"),
              t("Deleted successfully ."),
              "success"
            );
            props.formData.telegram_chat_ids.splice(index, 1);

          });
        }
      })
      .catch((error) => {
        ErrorToast();
      });
  };
}
};

// Helper functions
const escapeHtml = (val: any) =>
  String(val ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const pretty = (v: any) => {
  if (v == null) return "null";
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
};

// Test Telegram
const testTelegram = async () => {
  if (!props.formData.telegram_bot_token) {
    await Swal.fire({
      icon: "warning",
      title: "تنبيه",
      text: "يرجى إدخال Telegram Bot Token أولاً",
    });
    return;
  }

  if (!props.formData.telegram_chat_ids || props.formData.telegram_chat_ids.length === 0) {
    await Swal.fire({
      icon: "warning",
      title: "تنبيه",
      text: "يرجى إضافة Chat IDs أولاً",
    });
    return;
  }

  try {
    Swal.fire({
      icon: "info",
      title: "جاري الإرسال...",
      text: "يتم إرسال رسالة تجريبية إلى Telegram",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const response = await backupStore.sendTestTelegram();
    const data = response?.data ?? response;
    const rawResults = Array.isArray(data?.results) ? data.results : null;

    type Row = {
      chat_id: string | number | null;
      kind: "success" | "error" | "network";
      message?: any;
      error_code?: any;
      description?: any;
      http_status?: number | null;
      extra?: any;
    };

    let rows: Row[] = [];

    if (rawResults) {
      rows = rawResults.map((r: any) => {
        const status = (r?.status ?? "").toString().toLowerCase();
        const kind: Row["kind"] =
          status === "success" || status === "ok" || status === "completed"
            ? "success"
            : status === "error" || status === "failed" || status === "failure"
              ? "error"
              : "error";

        return {
          chat_id: r?.chat_id ?? null,
          kind,
          message: r?.message ?? r?.text ?? r?.description,
          error_code: r?.error_code,
          description: r?.description,
          http_status: r?.http_code ?? null,
          extra: r,
        };
      });
    } else {
      const html = `
        <div dir="rtl" class="text-right">
          <h3 class="text-base md:text-lg font-bold text-gray-900 mb-2">الاستجابة كما هي</h3>
          <pre class="text-xs bg-gray-100 p-2 rounded mt-1 text-left overflow-auto">${escapeHtml(pretty(data))}</pre>
        </div>
      `;
      await Swal.fire({
        icon: "info",
        title: "نتيجة الإرسال",
        html,
        width: 800,
      });
      return;
    }

    const successes = rows.filter((r) => r.kind === "success");
    const errors = rows.filter((r) => r.kind === "error" && r.http_status != null);
    const networks = rows.filter((r) => r.kind !== "success" && r.http_status == null);

    const total = rows.length;
    const ok = successes.length;
    const failed = total - ok;

    const renderItem = (r: Row, idx: number) => {
      const isSuccess = r.kind === "success";
      const isError = r.kind === "error" && r.http_status != null;
      const icon = isSuccess ? "✅" : isError ? "❌" : "⚠️";
      const badgeCls = isSuccess
        ? "bg-green-100 text-green-700 border-green-200"
        : isError
          ? "bg-red-100 text-red-700 border-red-200"
          : "bg-amber-100 text-amber-800 border-amber-200";
      const lineCls = isSuccess ? "text-green-700" : isError ? "text-red-700" : "text-amber-800";
      const http =
        r.http_status != null
          ? `HTTP ${escapeHtml(r.http_status)}`
          : r.error_code != null
            ? `ERR ${escapeHtml(r.error_code)}`
            : "—";
      const who = r.chat_id != null ? `<strong>${escapeHtml(String(r.chat_id))}</strong>` : `#${idx + 1}`;

      const short =
        r.description != null
          ? ` — ${escapeHtml(String(r.description))}`
          : r.message != null
            ? ` — ${escapeHtml(typeof r.message === "string" ? r.message : "")}`
            : "";

      return `
        <li class="border rounded-lg p-3 md:p-4 bg-white">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 md:gap-3 ${lineCls}">
              <span class="text-lg">${icon}</span>
              <span class="font-medium break-all">${who}</span>
            </div>
            <span class="text-xs md:text-sm border px-2 py-1 rounded ${badgeCls}">${http}</span>
          </div>
          ${short ? `<div class="mt-1 text-xs text-gray-600 break-all">${short}</div>` : ""}
          <details class="mt-2 text-sm">
            <summary class="cursor-pointer select-none text-gray-700 hover:text-gray-900">عرض التفاصيل</summary>
            <div class="mt-2 space-y-2">
              <div>
                <span class="text-xs md:text-sm font-medium text-gray-700">الرد كما هو:</span>
                <pre class="text-xs bg-gray-100 p-2 rounded mt-1 text-left overflow-auto">${escapeHtml(pretty(r.extra))}</pre>
              </div>
            </div>
          </details>
        </li>
      `;
    };

    const renderGroup = (title: string, items: Row[]) => {
      if (!items.length) return "";
      return `
        <section class="mb-4">
          <h4 class="text-sm md:text-base font-semibold text-gray-800 mb-2">${title} (${items.length})</h4>
          <ul class="space-y-2">
            ${items.map(renderItem).join("")}
          </ul>
        </section>
      `;
    };

    const html = `
      <div dir="rtl" class="text-right">
        <div class="mb-3">
          <h3 class="text-base md:text-lg font-bold text-gray-900 mb-1">ملخص الإرسال</h3>
          <div class="flex flex-wrap gap-2 text-sm">
            <span class="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">🔵 الإجمالي: ${total}</span>
            <span class="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded">✅ نجح: ${ok}</span>
            <span class="inline-flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded">❌ فشل: ${failed}</span>
          </div>
        </div>

        ${renderGroup("الناجحة", successes)}
        ${renderGroup("أخطاء Telegram", errors)}
        ${renderGroup("مشاكل الشبكة / لا يوجد رد", networks)}
      </div>
    `;

    await Swal.fire({
      icon: failed > 0 ? (ok > 0 ? "warning" : "error") : "success",
      title: failed > 0 ? (ok > 0 ? "تم الإرسال مع بعض الأخطاء" : "فشل الإرسال") : "تم الإرسال بنجاح",
      html,
      width: 900,
    });
  } catch (error: any) {
    const html = `
      <div dir="rtl" class="text-right">
        <div class="mb-2 text-red-600"><strong>حدث خطأ أثناء الإرسال.</strong></div>
        <details open>
          <summary class="cursor-pointer text-sm font-medium">تفاصيل</summary>
          <pre class="text-xs bg-gray-100 p-2 rounded mt-2 text-left overflow-auto">${escapeHtml(pretty(error?.response ?? error))}</pre>
        </details>
      </div>
    `;
    await Swal.fire({
      icon: "error",
      title: "مشكلة غير متوقعة",
      html,
      width: 800,
    });
  }
};
</script>

<template>
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <div class="flex-1">
        <h3 class="font-medium text-gray-900">إشعارات Telegram</h3>
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
        <input type="text" v-model="formData.telegram_bot_token" placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
          class="w-full px-3 py-2 border  text-gray-600  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Telegram Chat IDs</label>
        <div class="flex gap-2 mb-2">
          <input type="text" v-model="newTelegramChatId" placeholder="123456789"
            class="flex-1 px-3 py-2 border border-gray-300 text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keypress.enter="addTelegramChatId" />
          <button @click="addTelegramChatId"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            إضافة
          </button>
          <button @click="testTelegram"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
            اختبار
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <span v-for="(chatId, index) in formData.telegram_chat_ids" :key="index"
            class="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">
            {{ chatId }}
            <button @click="removeTelegramChatId(index)" class="ms-2 text-blue-600 hover:text-blue-800 font-bold">
              ×
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
