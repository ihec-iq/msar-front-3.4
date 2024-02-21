<script setup lang="ts">
import { defineProps } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import { t } from "@/utils/I18nPlugin";
import IButton from "./IButton.vue";
import IButton2 from "./IButton2.vue";

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
const goBack = () => {
  router.go(-1);
};
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
      <IButton v-else :text="t('Update')" :onClick="props.onUpdate" />
      <IButton
        v-if="!props.isAdd"
        color="red"
        type="outlined"
        :text="t('Delete')"
        :onClick="props.onDelete"
      />
    </div>
    <IButton2
      color="red"
      :onClick="goBack"
      pre-icon="arrow-left-top"
      type="text"
      :text="t('Back')"
      class="text-lg"
    />
  </div>
</template>
