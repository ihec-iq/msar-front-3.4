<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
import { t } from "@/utilities/I18nPlugin";
import IButton2 from "./IButton2.vue";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";

const goBack = () => {
  router.go(-1);
};
</script>
<template>
  <div class="flex flex-wrap flex-row-reverse justify-between p-4">
    <div class="flex gap-3">
      <slot> </slot>
    </div>
    <IButton2
      color="red"
      :onClick="goBack"
      pre-icon="arrow-left-top"
      :variant="EnumButtonType.Text"
      :text="t('Back')"
      class="text-lg"
    />
  </div>
</template>
