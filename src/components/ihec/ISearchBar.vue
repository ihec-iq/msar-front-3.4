<script setup lang="ts">
import { t } from "@/utilities/I18nPlugin";
import IButton2 from "./IButton2.vue";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";

const props = defineProps({
  getDataButton: {
    type: Function,
    required: true,
  },
});
</script>
<template>
  <div class="flex flex-row items-center justify-center">
    <slot></slot>
    <!-- search button -->
    <div class="rtl:ml-2 ltr:mr-2 lg:mt-0 xs:mt-2">
      <IButton2 color="green" :type="EnumButtonType.Outlined" :text="t('Search')" preIcon="magnify"
        :onClick="props.getDataButton" class="mt-0" width="25" />
    </div>
  </div>
</template>
