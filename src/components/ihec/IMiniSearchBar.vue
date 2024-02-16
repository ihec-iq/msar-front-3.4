<script setup lang="ts">
import { t } from "@/utils/I18nPlugin";

const props = defineProps({
  getData: {
    type: Function,
  },
  selectChange: {
    type: Function,
  },
});
</script>
<template>
  <slot></slot>
  <!-- search button -->
  <div class="ml-4 lg:mt-0 xs:mt-2">
    <IButton
      color="green"
      type="outlined"
      :text="t('Search')"
      :getData="props.getData"
    />
  </div>
</template>
