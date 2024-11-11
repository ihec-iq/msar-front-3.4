<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
import { t } from "@/utilities/I18nPlugin";
import IButton from "./IButton.vue";
import IButton2 from "./IButton2.vue";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";

const props = defineProps({
  onCreate: {
    type: Function,
    default: () => {},
  },
  onUpdate: {
    type: Function,
    default: () => {},
  },
  onDelete: {
    type: Function,
    default: () => {},
  },
  isAdd: {
    type: Boolean,
    required: true,
  },
  showUpdate: {
    type: Boolean,
    default: true,
  },
  showDelete: {
    type: Boolean,
    default: true,
  },
  showAdd: {
    type: Boolean,
    default: true,
  },
  titleAdd: {
    type: String,
    default: "Add",
  },
  titleUpdate: {
    type: String,
    default: "Update",
  },
  titleDelete: {
    type: String,
    default: "Delete",
  },
});
const goBack = () => {
  router.go(-1);
};
</script>
<template>
  <div class="flex flex-wrap flex-row-reverse justify-between p-4">
    <div class="flex gap-3 ">
      <slot name="Pre"></slot>
      <IButton
        v-if="props.isAdd && props.showAdd"
        :text="t(titleAdd)"
        :onClick="props.onCreate"
      />
      <IButton
        v-if="!props.isAdd && props.showUpdate"
        :text="t(titleUpdate)"
        :onClick="props.onUpdate"
      />
      <IButton
        v-if="!props.isAdd && props.showDelete"
        color="red"
        type="outlined"
        :text="t(titleDelete)"
        :onClick="props.onDelete"
      />
      <slot name="Post"></slot>

    </div>
    <IButton2
      color="red"
      :onClick="goBack"
      pre-icon="arrow-left-top"
      :type="EnumButtonType.Text"
      :text="t('Back')"
      class="text-lg"
    />
  </div>
</template>