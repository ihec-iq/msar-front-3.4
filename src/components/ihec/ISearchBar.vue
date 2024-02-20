<script setup lang="ts">
import { t } from "@/utils/I18nPlugin";
import IButton2 from "./archive/IButton2.vue";
const props = defineProps({
  getDataButton: {
    type: Function,
    required: true,
  },
});
</script>
<template>
  <slot></slot>
  <!-- search button -->
  <div class="ml-4 lg:mt-0 xs:mt-2">
    <IButton2
      color="green"
      type="outlined"
      :text="t('Search')"
      preIcon="magnify"
      :onClick="props.getDataButton"
      class="mt-3"
      width="25"
    />
  </div>
</template>
