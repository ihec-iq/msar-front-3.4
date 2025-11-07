<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useBackupStore } from "../backupStore";
import { storeToRefs } from "pinia";
import { t } from "@/utilities/I18nPlugin";
import { usePermissionsStore } from "@/project/core/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
import type { IBackupAdmin } from "../IBackup";
import IPage from "@/components/ihec/IPage.vue";
import IPageContent from "@/components/ihec/IPageContent.vue";
import IButton from "@/components/ihec/IButton.vue";
import SimpleLoading from "@/components/general/loading.vue";
import Swal from "sweetalert2";

const { checkPermissionAccessArray } = usePermissionsStore();
const backupStore = useBackupStore();
const { admins, isLoadingAdmins } = storeToRefs(backupStore);

const showDialog = ref(false);
const isEditing = ref(false);
const formData = ref<IBackupAdmin>({
  name: "",
  email: "",
  telegram_id: "",
  webhook_url: "",
  notify_via: [],
  active: true,
});

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ManageBackupAdmins]);
  await backupStore.getAdmins();
});

const openAddDialog = () => {
  isEditing.value = false;
  formData.value = {
    name: "",
    email: "",
    telegram_id: "",
    webhook_url: "",
    notify_via: [],
    active: true,
  };
  showDialog.value = true;
};

const openEditDialog = (admin: IBackupAdmin) => {
  isEditing.value = true;
  formData.value = { ...admin };
  showDialog.value = true;
};

// Toggle notify_via channel
const toggleNotifyVia = (channel: "email" | "telegram" | "webhook") => {
  const index = formData.value.notify_via.indexOf(channel);
  if (index > -1) {
    formData.value.notify_via.splice(index, 1);
  } else {
    formData.value.notify_via.push(channel);
  }
};

// Validation
const isFormValid = computed(() => {
  if (!formData.value.name.trim()) return false;

  // Conditional validation - only if channel is selected
  if (formData.value.notify_via.includes("email") && !formData.value.email.trim()) {
    return false;
  }
  if (formData.value.notify_via.includes("telegram") && !formData.value.telegram_id?.trim()) {
    return false;
  }
  if (formData.value.notify_via.includes("webhook") && !formData.value.webhook_url?.trim()) {
    return false;
  }

  return true;
});

const saveAdmin = async () => {
  if (!isFormValid.value) {
    await Swal.fire({
      icon: "error",
      title: "خطأ في التحقق",
      text: "يرجى ملء جميع الحقول المطلوبة",
    });
    return;
  }

  try {
    if (isEditing.value && formData.value.id) {
      await backupStore.updateAdmin(formData.value.id, formData.value);
    } else {
      await backupStore.createAdmin(formData.value);
    }
    await Swal.fire({
      icon: "success",
      title: "نجح",
      text: "تم الحفظ بنجاح",
      timer: 2000,
    });
    showDialog.value = false;
    await backupStore.getAdmins();
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "فشل الحفظ";
    await Swal.fire({ icon: "error", title: "خطأ", text: errorMessage });
  }
};

const deleteAdmin = async (id: number) => {
  const result = await Swal.fire({
    title: "هل أنت متأكد؟",
    text: "سيتم حذف هذا المسؤول نهائياً",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم، احذف",
    cancelButtonText: "إلغاء",
    confirmButtonColor: "#dc2626",
  });
  if (result.isConfirmed) {
    try {
      await backupStore.deleteAdmin(id);
      await Swal.fire({ icon: "success", title: "تم الحذف", timer: 2000 });
    } catch (error) {
      await Swal.fire({ icon: "error", title: "خطأ", text: "فشل الحذف" });
    }
  }
};

const closeDialog = () => {
  showDialog.value = false;
};
</script>

<template>
  <IPage :HeaderTitle="t('Backup.Admins')">
    <template #HeaderButtons>
      <IButton width="28" :onClick="openAddDialog" :text="t('Add')" />
    </template>
    <IPageContent>
      <SimpleLoading v-if="isLoadingAdmins" />

      <!-- Empty State -->
      <div
        v-else-if="admins.length === 0"
        class="bg-white rounded-lg shadow p-12 text-center"
      >
        <div class="text-6xl mb-4">👥</div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">لا يوجد مسؤولون</h3>
        <p class="text-gray-500 mb-6">ابدأ بإضافة مسؤول لتلقي الإشعارات</p>
        <button
          @click="openAddDialog"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          إضافة مسؤول جديد
        </button>
      </div>

      <!-- Admins Table -->
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الاسم
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                قنوات الإشعار
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                البريد الإلكتروني
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                معرف تليجرام
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Webhook URL
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الحالة
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="admin in admins" :key="admin.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ admin.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-if="admin.notify_via.includes('email')"
                    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    بريد إلكتروني
                  </span>
                  <span
                    v-if="admin.notify_via.includes('telegram')"
                    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-sky-100 text-sky-800"
                  >
                    تليجرام
                  </span>
                  <span
                    v-if="admin.notify_via.includes('webhook')"
                    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    Webhook
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate" :title="admin.email">
                  {{ admin.email || "-" }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate" :title="admin.telegram_id">
                  {{ admin.telegram_id || "-" }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate" :title="admin.webhook_url">
                  {{ admin.webhook_url || "-" }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="
                    admin.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  "
                >
                  {{ admin.active ? "فعال" : "غير فعال" }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button
                  @click="openEditDialog(admin)"
                  class="text-blue-600 hover:text-blue-900 me-4"
                >
                  تعديل
                </button>
                <button
                  @click="deleteAdmin(admin.id!)"
                  class="text-red-600 hover:text-red-900"
                >
                  حذف
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </IPageContent>
    <template #Footer>
      <IFooterCrud :show-add="false" :show-update="false" :show-delete="false" />
    </template>
  </IPage>

  <!-- Dialog (Outside IPage to cover full viewport) -->
  <Teleport to="body">
    <div
      v-if="showDialog"
      class="fixed inset-0 z-[9999] overflow-y-auto"
      @click="closeDialog"
    >
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      <!-- Dialog Container -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl transform transition-all"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 class="text-xl font-bold text-gray-900">
              {{ isEditing ? "تعديل مسؤول" : "إضافة مسؤول جديد" }}
            </h3>
            <button
              @click="closeDialog"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-6 max-h-[70vh] overflow-y-auto">
            <div class="space-y-5">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  الاسم <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="formData.name"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل اسم المسؤول"
                />
              </div>

              <!-- Notify Via -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  قنوات الإشعار
                </label>
                <div class="flex gap-4">
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      :checked="formData.notify_via.includes('email')"
                      @change="toggleNotifyVia('email')"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span class="ms-2 text-sm text-gray-700">بريد إلكتروني</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      :checked="formData.notify_via.includes('telegram')"
                      @change="toggleNotifyVia('telegram')"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span class="ms-2 text-sm text-gray-700">تليجرام</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      :checked="formData.notify_via.includes('webhook')"
                      @change="toggleNotifyVia('webhook')"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span class="ms-2 text-sm text-gray-700">Webhook</span>
                  </label>
                </div>
                <p class="text-xs text-gray-500 mt-2">اختياري - يمكن اختيار قناة أو أكثر أو لا شيء</p>
              </div>

              <!-- Email -->
              <div v-if="formData.notify_via.includes('email')">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="formData.email"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="example@domain.com أو example1@domain.com,example2@domain.com"
                />
                <p class="text-xs text-gray-500 mt-1">
                  يمكنك إدخال عدة عناوين بريد مفصولة بفاصلة
                </p>
              </div>

              <!-- Telegram -->
              <div v-if="formData.notify_via.includes('telegram')">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  معرف تليجرام (Chat ID) <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="formData.telegram_id"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123456789 أو 123456789,987654321"
                />
                <p class="text-xs text-gray-500 mt-1">
                  يمكنك إدخال عدة معرفات مفصولة بفاصلة
                </p>
              </div>

              <!-- Webhook -->
              <div v-if="formData.notify_via.includes('webhook')">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  عنوان Webhook <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="formData.webhook_url"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/webhook"
                />
                <p class="text-xs text-gray-500 mt-1">
                  يمكنك إدخال عدة عناوين مفصولة بفاصلة
                </p>
              </div>

              <!-- Active Status -->
              <div class="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                <div>
                  <label class="text-sm font-medium text-gray-700">حالة المسؤول</label>
                  <p class="text-xs text-gray-500 mt-0.5">تفعيل أو تعطيل استقبال الإشعارات</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="formData.active"
                    class="sr-only peer"
                  />
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                  ></div>
                  <span class="ms-3 text-sm font-medium text-gray-700">
                    {{ formData.active ? "فعال" : "غير فعال" }}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              @click="closeDialog"
              class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              إلغاء
            </button>
            <button
              @click="saveAdmin"
              :disabled="!isFormValid"
              class="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {{ isEditing ? "حفظ التعديلات" : "إضافة" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
