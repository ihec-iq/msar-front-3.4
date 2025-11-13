<script setup lang="ts">
import { ref } from "vue";
import type { IBackupSettings } from "../../IBackup";
import { useBackupStore } from "../../backupStore";
import Swal from "sweetalert2";

const props = defineProps<{
  formData: IBackupSettings;
}>();

const backupStore = useBackupStore();
const newEmailRecipient = ref("");

// Email recipients management
const addEmailRecipient = () => {
  if (!props.formData.email_recipients) {
    props.formData.email_recipients = [];
  }
  if (newEmailRecipient.value && !props.formData.email_recipients.includes(newEmailRecipient.value)) {
    props.formData.email_recipients.push(newEmailRecipient.value);
    newEmailRecipient.value = "";
  }
};

const removeEmailRecipient = (index: number) => {
  if (props.formData.email_recipients) {
    props.formData.email_recipients.splice(index, 1);
  }
};

// Test email
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
</script>

<template>
  <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div class="flex items-center justify-between mb-4">
      <div class="flex-1">
        <h3 class="font-medium text-gray-900">إشعارات البريد الإلكتروني</h3>
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" v-model="formData.email_enabled" class="sr-only peer" />
        <div
          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] rtl:after:end-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
        ></div>
      </label>
    </div>

    <div v-if="formData.email_enabled" class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">عناوين البريد الإلكتروني</label>
        <div class="flex gap-2 mb-2">
          <input
            type="email"
            v-model="newEmailRecipient"
            placeholder="admin@example.com"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keypress.enter="addEmailRecipient"
          />
          <button
            @click="addEmailRecipient"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            إضافة
          </button>
          <button
            @click="testEmail"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
          >
            اختبار
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(email, index) in formData.email_recipients"
            :key="index"
            class="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
          >
            {{ email }}
            <button @click="removeEmailRecipient(index)" class="ms-2 text-blue-600 hover:text-blue-800 font-bold">
              ×
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
