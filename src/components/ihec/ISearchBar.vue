<script setup lang="ts">
import { t } from "@/utils/I18nPlugin";
const props = defineProps({
  getDataButton: {
    type: Function,
  },
});
</script>
<template>
  <slot></slot>

  <!-- search button -->
  <div class="ml-4 lg:mt-0 xs:mt-2">
    <IButton
      color="blue"
      type="outlined"
      :text="t('Search')"
      :onClick="props.getDataButton"
    />
  </div>
</template>
