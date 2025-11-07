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

const { checkPermissionAccessArray } = usePermissionsStore();
const backupStore = useBackupStore();

const activeSection = ref<string>("general");
const isSaving = ref(false);

const formData = ref<IBackupSettings>({
  enabled: false,
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

// For managing email and telegram recipients
const newEmailRecipient = ref("");
const newTelegramChatId = ref("");

// Sidebar navigation items
const navigationItems = [
  { id: "general", label: "عام", icon: "⚙️" },
  { id: "auto-backup", label: "النسخ التلقائي", icon: "🤖" },
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

// Email recipients management
const addEmailRecipient = () => {
  if (!formData.value.email_recipients) {
    formData.value.email_recipients = [];
  }
  if (
    newEmailRecipient.value &&
    !formData.value.email_recipients.includes(newEmailRecipient.value)
  ) {
    formData.value.email_recipients.push(newEmailRecipient.value);
    newEmailRecipient.value = "";
  }
};

const removeEmailRecipient = (index: number) => {
  if (formData.value.email_recipients) {
    formData.value.email_recipients.splice(index, 1);
  }
};

// Telegram chat IDs management
const addTelegramChatId = () => {
  if (!formData.value.telegram_chat_ids) {
    formData.value.telegram_chat_ids = [];
  }
  if (
    newTelegramChatId.value &&
    !formData.value.telegram_chat_ids.includes(newTelegramChatId.value)
  ) {
    formData.value.telegram_chat_ids.push(newTelegramChatId.value);
    newTelegramChatId.value = "";
  }
};

const removeTelegramChatId = (index: number) => {
  if (formData.value.telegram_chat_ids) {
    formData.value.telegram_chat_ids.splice(index, 1);
  }
};

// Test functions
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

const testTelegram = async () => {
  if (!formData.value.telegram_bot_token) {
    await Swal.fire({
      icon: "warning",
      title: "تنبيه",
      text: "يرجى إدخال Telegram Bot Token أولاً",
    });
    return;
  }

  if (!formData.value.telegram_chat_ids || formData.value.telegram_chat_ids.length === 0) {
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

    // استدعاء الستور (إن كان يحتاج بارامترات عدّل هنا)
    const response = await backupStore.sendTestTelegram();
    const data = response?.data ?? response;

    // إذا الباكند رجّع مصفوفة نتائج
    const rawResults = Array.isArray(data?.results) ? data.results : null;

    // تطبيع النتائج إلى بنية موحّدة قدر الإمكان
    type Row = {
      chat_id: string | number | null;
      kind: "success" | "error" | "network";
      message?: any;
      error_code?: any;
      description?: any;
      http_status?: number | null; // لو كان فيه بروكسي راجع كود
      extra?: any; // أي حقول إضافية
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
      // ماكو results[] -> نعرض الاستجابة كما هي
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

    // تقسيم المجموعات
    const successes = rows.filter((r) => r.kind === "success");
    const errors = rows.filter((r) => r.kind === "error" && r.http_status != null); // أخطاء مع كود/وصف
    const networks = rows.filter((r) => r.kind !== "success" && r.http_status == null); // مشاكل شبكة/لا رد

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
      const lineCls = isSuccess
        ? "text-green-700"
        : isError
        ? "text-red-700"
        : "text-amber-800";
      const http =
        r.http_status != null
          ? `HTTP ${escapeHtml(r.http_status)}`
          : r.error_code != null
          ? `ERR ${escapeHtml(r.error_code)}`
          : "—";
      const who =
        r.chat_id != null ? `<strong>${escapeHtml(String(r.chat_id))}</strong>` : `#${idx + 1}`;

      // ملخص قصير إضافي (وصف/رسالة) بدون فتح التفاصيل
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
          ${
            short
              ? `<div class="mt-1 text-xs text-gray-600 break-all">${short}</div>`
              : ""
          }
          <details class="mt-2 text-sm">
            <summary class="cursor-pointer select-none text-gray-700 hover:text-gray-900">عرض التفاصيل</summary>
            <div class="mt-2 space-y-2">
              <div>
                <span class="text-xs md:text-sm font-medium text-gray-700">الرد كما هو:</span>
                <pre class="text-xs bg-gray-100 p-2 rounded mt-1 text-left overflow-auto">${escapeHtml(
                  pretty(r.extra)
                )}</pre>
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
      title:
        failed > 0
          ? ok > 0
            ? "تم الإرسال مع بعض الأخطاء"
            : "فشل الإرسال"
          : "تم الإرسال بنجاح",
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


//region test webhook
// === Helpers ===
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

// تختار أفضل حمولة للعرض (نص أو JSON) من أي شكل رد (Axios أو غيره)
const extractPayload = (resp: any) => {
  if (resp == null) return null;

  // Axios-style
  if (resp && Object.prototype.hasOwnProperty.call(resp, "data")) {
    const d = resp.data;
    if (typeof d === "string") return d;
    return pretty(d);
  }

  // إذا كان الرد نفسه نص
  if (typeof resp === "string") return resp;

  // حالات شائعة أخرى
  if (resp?.responseText) return resp.responseText; // XHR
  if (resp?.body && typeof resp.body === "string") return resp.body;

  // fallback: كل الرد JSON
  return pretty(resp);
};

// === The function you asked for ===
const testWebhook = async () => {
  const raw = formData.value.webhook_urls;
  if (!raw || !raw.trim()) {
    await Swal.fire({
      icon: "warning",
      title: "تنبيه",
      text: "يرجى إدخال Webhook URL أو عدة روابط مفصولة بفارزة ,",
    });
    return;
  }

  // جهّز قائمة الروابط (تقسيم بالفارزة + تنظيف + إزالة التكرار)
  const urls = Array.from(
    new Set(
      raw
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean)
    )
  );
  if (urls.length === 0) {
    await Swal.fire({
      icon: "warning",
      title: "تنبيه",
      text: "لم يتم العثور على أي رابط صالح بعد التقسيم.",
    });
    return;
  }

  try {
    Swal.fire({
      icon: "info",
      title: "جاري الإرسال...",
      text: "سيتم إرسال طلب تجريبي لكل رابط",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    // إرسال متوازي لكل رابط
    const settled = await Promise.allSettled(
      urls.map(async (url) => {
        try {
          const resp = await backupStore.sendTestWebhook(url);
          return {
            url,
            kind: "success" as const,
            http_status: resp?.status ?? null,
            headers: resp?.headers ?? null,
            body: extractPayload(resp),
            extra: resp?.data && typeof resp.data === "object" ? resp.data : null,
          };
        } catch (err: any) {
          const r = err?.response;
          return {
            url,
            kind: r ? ("error" as const) : ("network" as const),
            http_status: r?.status ?? null,
            headers: r?.headers ?? null,
            body: extractPayload(r) ?? (err?.message ?? err),
            extra: r?.data && typeof r.data === "object" ? r.data : null,
          };
        }
      })
    );

    // طيّب النتائج
    const results = settled.map((s, i) =>
      s.status === "fulfilled"
        ? s.value
        : {
            url: urls[i] ?? "غير معروف",
            kind: "network" as const,
            http_status: null,
            headers: null,
            body: extractPayload(s.reason) ?? String(s.reason),
            extra: null,
          }
    );

    // تقسيم لمجموعات وعمل إحصاء
    const successes = results.filter((r) => r.kind === "success");
    const errors = results.filter((r) => r.kind === "error");
    const networks = results.filter((r) => r.kind === "network");

    const total = results.length;
    const ok = successes.length;
    const failed = errors.length + networks.length;

    // مولد عنصر سطر مختصر + تفاصيل قابلة للفتح
    const renderItem = (r: any, idx: number) => {
      const isSuccess = r.kind === "success";
      const isError = r.kind === "error";
      const icon = isSuccess ? "✅" : isError ? "❌" : "⚠️";
      const badgeCls = isSuccess ? "bg-green-100 text-green-700 border-green-200"
                    : isError ? "bg-red-100 text-red-700 border-red-200"
                    : "bg-amber-100 text-amber-800 border-amber-200";
      const lineCls = isSuccess ? "text-green-700"
                    : isError ? "text-red-700"
                    : "text-amber-800";
      const http = r.http_status != null ? `HTTP ${escapeHtml(r.http_status)}` : "لا يوجد كود";
      const url = escapeHtml(r.url ?? `#${idx + 1}`);

      return `
        <li class="border rounded-lg p-3 md:p-4 bg-white">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 md:gap-3 ${lineCls}">
              <span class="text-lg">${icon}</span>
              <span class="font-medium break-all">${url}</span>
            </div>
            <span class="text-xs md:text-sm border px-2 py-1 rounded ${badgeCls}">${http}</span>
          </div>

          <details class="mt-2 text-sm">
            <summary class="cursor-pointer select-none text-gray-700 hover:text-gray-900">
              عرض التفاصيل
            </summary>
            <div class="mt-2 space-y-2">
              ${
                r.headers
                  ? `<details>
                      <summary class="cursor-pointer text-xs md:text-sm font-medium text-gray-700">Headers</summary>
                      <pre class="text-xs bg-gray-50 p-2 rounded mt-1 text-left overflow-auto">${escapeHtml(pretty(r.headers))}</pre>
                    </details>`
                  : ""
              }
              <details open>
                <summary class="cursor-pointer text-xs md:text-sm font-medium text-gray-700">الرد كما هو</summary>
                <pre class="text-xs bg-gray-100 p-2 rounded mt-1 text-left overflow-auto">${escapeHtml(pretty(r.body))}</pre>
              </details>
              ${
                r.extra
                  ? `<details>
                       <summary class="cursor-pointer text-xs md:text-sm font-medium text-gray-700">بيانات إضافية</summary>
                       <pre class="text-xs bg-gray-50 p-2 rounded mt-1 text-left overflow-auto">${escapeHtml(pretty(r.extra))}</pre>
                     </details>`
                  : ""
              }
            </div>
          </details>
        </li>`;
    };

    // مقطع مجموعة بعنوان واضح
    const renderGroup = (title: string, items: any[]) => {
      if (!items.length) return "";
      return `
        <section class="mb-4">
          <h4 class="text-sm md:text-base font-semibold text-gray-800 mb-2">${title} (${items.length})</h4>
          <ul class="space-y-2">
            ${items.map(renderItem).join("")}
          </ul>
        </section>`;
    };

    // HTML منسّق ومرتب
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
        ${renderGroup("أخطاء HTTP", errors)}
        ${renderGroup("مشاكل الشبكة / لا يوجد رد", networks)}
      </div>
    `;

    await Swal.fire({
      icon: failed > 0 ? (ok > 0 ? "warning" : "error") : "success",
      title: failed > 0 ? (ok > 0 ? "تم الإرسال مع بعض الأخطاء" : "فشل الإرسال") : "تم الإرسال بنجاح",
      html,
      width: 900,
    });
  } catch (fatal: any) {
    await Swal.fire({
      icon: "error",
      title: "مشكلة غير متوقعة",
      html: `
        <div class="text-right">
          <details open>
            <summary class="cursor-pointer text-sm font-medium">تفاصيل</summary>
            <pre class="text-xs bg-gray-100 p-2 rounded mt-2 text-left overflow-auto">${escapeHtml(pretty(fatal))}</pre>
          </details>
        </div>`,
      width: 700,
    });
  }
};


//endregion


// Helper: Time ago formatter
const timeAgo = (dateString: string | undefined) => {
  if (!dateString) return "لم يتم بعد";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "الآن";
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffMins < 1440) return `منذ ${Math.floor(diffMins / 60)} ساعة`;
  return `منذ ${Math.floor(diffMins / 1440)} يوم`;
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
              <button v-for="item in navigationItems" :key="item.id" @click="activeSection = item.id"
                class="w-full text-right px-4 py-3 rounded-lg transition-all duration-150 flex items-center gap-3 group"
                :class="activeSection === item.id
                  ? 'bg-white text-blue-600 shadow-sm font-medium'
                  : 'text-gray-600 hover:bg-white hover:text-gray-900'
                  ">
                <span class="text-xl"
                  :class="activeSection === item.id ? 'scale-110' : 'group-hover:scale-110 transition-transform'">{{
                    item.icon }}</span>
                <span>{{ item.label }}</span>
              </button>
            </nav>

            <!-- Save Button -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <button @click="saveSettings" :disabled="isSaving"
                class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow">
                {{ isSaving ? "جاري الحفظ..." : "حفظ الإعدادات" }}
              </button>
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 min-w-0">
          <!-- General Settings Section -->
          <div v-show="activeSection === 'general'">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-gray-900">الإعدادات العامة</h2>
              <p class="text-gray-600 mt-1">التحكم في النظام الأساسي للنسخ الاحتياطي</p>
            </div>

            <!-- Enable System - Full Width -->
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">تفعيل نظام النسخ الاحتياطي</h3>
                  <p class="text-sm text-gray-500 mt-1">تشغيل أو إيقاف النظام بالكامل</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="formData.enabled" class="sr-only peer" />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                  </div>
                </label>
              </div>
            </div>

            <!-- Backup Path and Max Storage - Grid Layout -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <!-- Backup Path -->
              <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <label class="block font-medium text-gray-900 mb-3">مسار حفظ النسخ الاحتياطية</label>
                <input type="text" v-model="formData.backup_path" placeholder="storage/app/backups"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <p class="mt-2 text-sm text-gray-500">المسار النسبي لحفظ ملفات النسخ الاحتياطي</p>
              </div>

              <!-- Max Storage -->
              <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <label class="block font-medium text-gray-900 mb-3">الحد الأقصى للمساحة</label>
                <input type="number" v-model.number="formData.max_storage_mb" min="100"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <p class="mt-2 text-sm text-gray-500">
                  {{ (formData.max_storage_mb / 1024).toFixed(2) }} GB
                </p>
              </div>
            </div>
          </div>

          <!-- Auto Backup Section -->
          <div v-show="activeSection === 'auto-backup'">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-gray-900">النسخ الاحتياطي التلقائي</h2>
              <p class="text-gray-600 mt-1">جدولة النسخ التلقائي بفترات محددة</p>
            </div>

            <!-- Enable Auto Backup - Full Width -->
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">تفعيل النسخ التلقائي</h3>
                  <p class="text-sm text-gray-500 mt-1">تشغيل نسخ احتياطية دورية تلقائياً</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="formData.auto_backup_enabled" class="sr-only peer" />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                  </div>
                </label>
              </div>
            </div>

            <!-- Auto Backup Settings -->
            <div v-if="formData.auto_backup_enabled" class="space-y-4">
              <!-- Interval Selection -->
              <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <label class="block font-medium text-gray-900 mb-4">الفترة الزمنية</label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <label v-for="interval in [
                    { value: 60, label: 'كل ساعة', sub: '60 دقيقة' },
                    { value: 360, label: 'كل 6 ساعات', sub: '360 دقيقة' },
                    { value: 720, label: 'كل 12 ساعة', sub: '720 دقيقة' },
                    { value: 1440, label: 'يومياً', sub: '1440 دقيقة' },
                    { value: 10080, label: 'أسبوعياً', sub: '10080 دقيقة' },
                  ]" :key="interval.value"
                    class="relative flex items-center p-3 bg-gray-50 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300"
                    :class="formData.auto_backup_interval === interval.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'">
                    <input type="radio" :value="interval.value" v-model.number="formData.auto_backup_interval"
                      class="sr-only" />
                    <div class="flex-1 text-center">
                      <div class="text-sm font-semibold text-gray-900">{{ interval.label }}</div>
                      <div class="text-xs text-gray-500 mt-0.5">{{ interval.sub }}</div>
                    </div>
                  </label>

                  <label
                    class="relative flex items-center p-3 bg-gray-50 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300"
                    :class="![60, 360, 720, 1440, 10080].includes(formData.auto_backup_interval) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'">
                    <div class="flex-1">
                      <input type="number" v-model.number="formData.auto_backup_interval" min="1"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm font-semibold"
                        placeholder="مخصص" />
                      <div class="text-xs text-gray-500 mt-1 text-center">دقائق</div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Backup Type Selection -->
              <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <label class="block font-medium text-gray-900 mb-4">نوع النسخة الاحتياطية</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label v-for="type in [
                    { value: 'both', label: 'قاعدة البيانات + الملفات', sub: 'نسخة كاملة' },
                    { value: 'db', label: 'قاعدة البيانات فقط', sub: 'نسخة البيانات' },
                    { value: 'files', label: 'الملفات فقط', sub: 'نسخة الملفات' },
                  ]" :key="type.value"
                    class="relative flex items-center p-4 bg-gray-50 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300"
                    :class="formData.auto_backup_type === type.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'">
                    <input type="radio" :value="type.value" v-model="formData.auto_backup_type" class="sr-only" />
                    <div class="flex-1">
                      <div class="text-sm font-semibold text-gray-900">{{ type.label }}</div>
                      <div class="text-xs text-gray-500 mt-1">{{ type.sub }}</div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Last Auto Backup Info -->
              <div v-if="formData.last_auto_backup_at" class="bg-green-50 border border-green-200 rounded-xl p-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span class="text-lg">✓</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-700">آخر نسخة تلقائية</div>
                    <div class="text-xs text-gray-500">{{ timeAgo(formData.last_auto_backup_at) }}</div>
                  </div>
                </div>
              </div>
            </div> <!-- /v-if auto_backup_enabled -->
          </div> <!-- /v-show auto-backup -->

          <!-- Retention Policy Section -->
          <div v-show="activeSection === 'retention'">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-gray-900">سياسة الاحتفاظ بالنسخ</h2>
              <p class="text-gray-600 mt-1">مدة الاحتفاظ بالنسخ الاحتياطية قبل حذفها تلقائياً</p>
            </div>

            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <p class="text-sm text-amber-800">
                تحدد هذه الإعدادات المدة التي سيتم الاحتفاظ بالنسخ الاحتياطية قبل حذفها تلقائياً
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <label class="block font-medium text-gray-900 mb-3">النسخ اليومية</label>
                <input type="number" v-model.number="formData.keep_daily_days" min="0"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <p class="mt-2 text-sm text-gray-500">عدد الأيام</p>
              </div>

              <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <label class="block font-medium text-gray-900 mb-3">النسخ الأسبوعية</label>
                <input type="number" v-model.number="formData.keep_weekly_weeks" min="0"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <p class="mt-2 text-sm text-gray-500">عدد الأسابيع</p>
              </div>

              <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <label class="block font-medium text-gray-900 mb-3">النسخ الشهرية</label>
                <input type="number" v-model.number="formData.keep_monthly_months" min="0"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <p class="mt-2 text-sm text-gray-500">عدد الأشهر</p>
              </div>
            </div>
          </div>

          <!-- Notifications Section -->
          <div v-show="activeSection === 'notifications'">
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-gray-900">إعدادات الإشعارات</h2>
              <p class="text-gray-600 mt-1">التحكم في إشعارات حالة النسخ الاحتياطي</p>
            </div>

            <!-- Master Notification Toggle - Full Width -->
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">تفعيل الإشعارات</h3>
                  <p class="text-sm text-gray-500 mt-1">إرسال إشعارات عن حالة النسخ الاحتياطي</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="formData.notify_enabled" class="sr-only peer" />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                  </div>
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
                          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                        </div>
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
                          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                        </div>
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
                          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Stale Hours -->
                <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <label class="block font-medium text-gray-900 mb-3">عدد الساعات للإشعار بالتأخير</label>
                  <input type="number" v-model.number="formData.stale_hours" min="0"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  <p class="mt-2 text-sm text-gray-500">إرسال إشعار إذا لم يتم تشغيل نسخة احتياطية خلال هذه المدة</p>
                </div>
              </div>

              <!-- Email Notifications -->
              <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-900">إشعارات البريد الإلكتروني</h3>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="formData.email_enabled" class="sr-only peer" />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                    </div>
                  </label>
                </div>

                <div v-if="formData.email_enabled" class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">عناوين البريد الإلكتروني</label>
                    <div class="flex gap-2 mb-2">
                      <input type="email" v-model="newEmailRecipient" placeholder="admin@example.com"
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        @keypress.enter="addEmailRecipient" />
                      <button @click="addEmailRecipient"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                        إضافة
                      </button>
                      <button @click="testEmail"
                        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                        اختبار
                      </button>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="(email, index) in formData.email_recipients" :key="index"
                        class="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">
                        {{ email }}
                        <button @click="removeEmailRecipient(index)"
                          class="ms-2 text-blue-600 hover:text-blue-800 font-bold">
                          ×
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Telegram Notifications -->
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
                    <input type="text" v-model="formData.telegram_bot_token"
                      placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Telegram Chat IDs</label>
                    <div class="flex gap-2 mb-2">
                      <input type="text" v-model="newTelegramChatId" placeholder="123456789"
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        <button @click="removeTelegramChatId(index)"
                          class="ms-2 text-blue-600 hover:text-blue-800 font-bold">
                          ×
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Webhook Notifications -->
              <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-900">إشعارات Webhook</h3>
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
                    <label class="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                    <div class="flex gap-2">
                      <input type="text" v-model="formData.webhook_urls" placeholder="https://your-webhook.com/endpoint"
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <button @click="testWebhook"
                        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                        اختبار
                      </button>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Webhook Secret</label>
                    <input type="password" v-model="formData.webhook_secret" placeholder="your-secret-key"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <p class="mt-1 text-xs text-gray-500">مفتاح سري للتحقق من صحة الطلبات</p>
                  </div>
                </div>
              </div>
            </div> <!-- /v-if notify_enabled -->
          </div> <!-- /v-show notifications -->
        </main>
      </div>
    </IPageContent>

    <template #Footer>
      <IFooterCrud :show-add="false" :show-update="false" :show-delete="false" />
    </template>
  </IPage>
</template>
