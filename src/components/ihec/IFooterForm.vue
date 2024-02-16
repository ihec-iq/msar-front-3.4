<script setup lang="ts">
import { defineProps } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import { t } from "@/utils/I18nPlugin";

const props = defineProps({
  onCreate: {
    type: Function,
    required: true,
  },
  onUpdate: {
    type: Function,
    required: true,
  },
  onDelete: {
    type: Function,
    required: true,
  },
  isAdd: {
    type: Boolean,
    required: true,
  },
});
</script>
<template>
  <div
    class="max-w-screen-xl flex flex-wrap flex-row-reverse justify-between p-4"
  >
    <div class="flex gap-3">
      <IButton
        v-if="props.isAdd"
        :text="t('Create')"
        :onClick="props.onCreate"
      />
      <IButton
        v-if="!props.isAdd"
        color="red"
        type="outlined"
        :text="t('Delete')"
        :onClick="props.onDelete"
      />
      <IButton
        v-if="!props.isAdd"
        :text="t('Update')"
        :onClick="props.onUpdate"
      />
    </div>
    <button @click="router.go(-1)" class="text-blue-500 hover:text-blue-700 text-lg flex">
      {{ t("Back") }}<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
        />
      </svg>
    </button>
  </div>
</template>
