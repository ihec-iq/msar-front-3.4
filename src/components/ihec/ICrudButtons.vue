<script setup lang="ts">
import { t } from "@/utilities/I18nPlugin";

const props = defineProps({
  type: {
    type: Array,
    default: () => [],
  },
  onClick: {
    type: Function,
  },
});
const hasType = (buttonType: string): boolean => {
  return props.type.includes(buttonType);
};
</script>

<template>
  <div
    class="max-w-screen-xl flex flex-wrap flex-row-reverse justify-between p-4"
  >
    <IButton
      v-if="hasType('add')"
      :text="t('Create')"
      :onClick="props.onClick"
    />
    <IButton
      v-if="hasType('update')"
      :text="t('Update')"
      :onClick="props.onClick"
    />
    <IButton
      v-if="hasType('delete')"
      color="red"
      :text="t('Delete')"
      :onClick="props.onClick"
    />
  </div>
</template>