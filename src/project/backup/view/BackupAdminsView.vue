<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useBackupStore } from "../backupStore";
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

const showDialog = ref(false);
const isEditing = ref(false);
const formData = ref<IBackupAdmin>({
  name: "",
  email: "",
  telegram_id: "",
  notify_via: [],
  active: true,
});

onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.ManageBackupAdmins]);
  await backupStore.getAdmins();
});

const openAddDialog = () => {
  isEditing.value = false;
  formData.value = { name: "", email: "", telegram_id: "", notify_via: [], active: true };
  showDialog.value = true;
};

const openEditDialog = (admin: IBackupAdmin) => {
  isEditing.value = true;
  formData.value = { ...admin };
  showDialog.value = true;
};

const saveAdmin = async () => {
  try {
    if (isEditing.value && formData.value.id) {
      await backupStore.updateAdmin(formData.value.id, formData.value);
    } else {
      await backupStore.createAdmin(formData.value);
    }
    await Swal.fire({ icon: "success", title: "نجح", text: "تم الحفظ بنجاح", timer: 2000 });
    showDialog.value = false;
    await backupStore.getAdmins();
  } catch (error) {
    await Swal.fire({ icon: "error", title: "خطأ", text: "فشل الحفظ" });
  }
};

const deleteAdmin = async (id: number) => {
  const result = await Swal.fire({
    title: "هل أنت متأكد؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم، احذف",
    cancelButtonText: "إلغاء",
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
</script>

<template>
  <IPage :HeaderTitle="t('Backup.Admins')">
    <template #HeaderButtons>
      <IButton width="28" :onClick="openAddDialog" :text="t('Add')" />
    </template>
    <IPageContent>
      <div class="bg-white rounded-lg shadow">
        <SimpleLoading v-if="backupStore.isLoadingAdmins" />
        <div v-else-if="backupStore.admins.length === 0" class="p-8 text-center text-gray-500">
          لا يوجد مسؤولون
        </div>
        <table v-else class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الاسم</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">البريد</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="admin in backupStore.admins" :key="admin.id">
              <td class="px-6 py-4 text-sm text-gray-900">{{ admin.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ admin.email }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs rounded-full" :class="admin.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ admin.active ? "فعال" : "غير فعال" }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button @click="openEditDialog(admin)" class="text-blue-600 hover:text-blue-900 me-3">تعديل</button>
                <button @click="deleteAdmin(admin.id!)" class="text-red-600 hover:text-red-900">حذف</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="showDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold mb-4">{{ isEditing ? "تعديل" : "إضافة" }} مسؤول</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">الاسم</label>
              <input type="text" v-model="formData.name" class="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">البريد</label>
              <input type="email" v-model="formData.email" class="w-full px-3 py-2 border rounded-md" />
            </div>
            <div class="flex items-center justify-between">
              <label>فعال</label>
              <input type="checkbox" v-model="formData.active" />
            </div>
          </div>
          <div class="flex justify-end gap-4 mt-6">
            <button @click="showDialog = false" class="px-4 py-2 border rounded-md">إلغاء</button>
            <button @click="saveAdmin" class="px-4 py-2 bg-blue-600 text-white rounded-md">حفظ</button>
          </div>
        </div>
      </div>
    </IPageContent>
  </IPage>
</template>
