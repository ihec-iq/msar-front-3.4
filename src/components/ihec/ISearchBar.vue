<script setup lang="ts">
import { t } from "@/utilities/I18nPlugin";
import IButton2 from "./IButton2.vue";
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
  <div class="rtl:ml-2 ltr:mr-2 lg:mt-0 xs:mt-2">
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
@/utilities/I18nPlugin