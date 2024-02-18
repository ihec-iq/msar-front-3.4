<script setup lang="ts">
import { t } from "@/utils/I18nPlugin";
import IButton from "./IButton.vue";
const props = defineProps({
  getDataButton: {
    type: Function,
  },
});
</script>
<template>
  <slot></slot>
  <!-- search button -->
  <IButton
    color="green"
    type="outlined"
    :text="t('Search')"
    :onClick="props.getDataButton"
  />
</template>
