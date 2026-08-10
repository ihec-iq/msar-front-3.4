<script setup lang="ts">
import type { IBackupSettings } from "../../IBackup";
import { useBackupStore } from "../../backupStore";
import Swal from "sweetalert2";

const formData = defineModel<IBackupSettings>("formData", {
  required: true,
});

const backupStore = useBackupStore();

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

const extractPayload = (resp: any) => {
  if (resp == null) return null;

  if (resp && Object.prototype.hasOwnProperty.call(resp, "data")) {
    const d = resp.data;
    if (typeof d === "string") return d;
    return pretty(d);
  }

  if (typeof resp === "string") return resp;
  if (resp?.responseText) return resp.responseText;
  if (resp?.body && typeof resp.body === "string") return resp.body;

  return pretty(resp);
};

// Test Webhook
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
            extra:
              resp?.data && typeof resp.data === "object" ? resp.data : null,
          };
        } catch (err: any) {
          const r = err?.response;
          return {
            url,
            kind: r ? ("error" as const) : ("network" as const),
            http_status: r?.status ?? null,
            headers: r?.headers ?? null,
            body: extractPayload(r) ?? err?.message ?? err,
            extra: r?.data && typeof r.data === "object" ? r.data : null,
          };
        }
      })
    );

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

    const successes = results.filter((r) => r.kind === "success");
    const errors = results.filter((r) => r.kind === "error");
    const networks = results.filter((r) => r.kind === "network");

    const total = results.length;
    const ok = successes.length;
    const failed = errors.length + networks.length;

    const renderItem = (r: any, idx: number) => {
      const isSuccess = r.kind === "success";
      const isError = r.kind === "error";
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
          : "لا يوجد كود";
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
      title:
        failed > 0
          ? ok > 0
            ? "تم الإرسال مع بعض الأخطاء"
            : "فشل الإرسال"
          : "تم الإرسال بنجاح",
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
</script>

<template>
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <div class="flex-1">
        <h3 class="font-medium text-gray-900">إشعارات Webhook</h3>
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          v-model="formData.webhook_enabled"
          class="sr-only peer"
        />
        <div
          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
        ></div>
      </label>
    </div>

    <div v-if="formData.webhook_enabled" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Webhook URL</label
        >
        <div class="flex gap-2">
          <input
            type="text"
            v-model="formData.webhook_urls"
            placeholder="https://your-webhook.com/endpoint"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="testWebhook"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
          >
            اختبار
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Webhook Secret</label
        >
        <input
          type="password"
          v-model="formData.webhook_secret"
          placeholder="your-secret-key"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p class="mt-1 text-xs text-gray-500">
          مفتاح سري للتحقق من صحة الطلبات
        </p>
      </div>
    </div>
  </div>
</template>
