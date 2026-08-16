<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, ref, type PropType } from "vue";
import { Icon } from "@iconify/vue";
import CardArchiveTypeIndex from "./CardArchiveTypeIndex.vue";
import { useArchiveTypeStore } from "../archiveType/archiveTypeStore";

const archiveTypeStore = useArchiveTypeStore();
const { archiveTypes } = storeToRefs(useArchiveTypeStore());
const isChecked = ref(false);
const emits = defineEmits<{
  getFilterData: [number, number]; // Define the event structure with three parameters
}>();
const props = defineProps({
  OnClick: {
    type: Function as PropType<(arg0: number, arg1: number) => void>,
    required: true,
  },
});
const onClick = (index: number) => {
  //emits("getFilterData", 1, index);
  props.OnClick(1, index);
  isChecked.value = false;
};
onMounted(async () => {
  await archiveTypeStore.getBySectionUser();
});
const visibleCard = ref(false);
</script>
<template>
  <div
    class="bg-opacity-50 bg-blue-100 py-2 px-2 rounded-lg overflow-x-auto"
    v-if="archiveTypes.length > 0"
  >
    <div
      class="collapse-title w-full hover:cursor-pointer flex border-dotted border-gray-200 border-2"
      @click="visibleCard = !visibleCard"
    >
      <span class="mx-2 mb-1 px-2"> للاطلاع على الكتب حسب نوع الكتاب </span>
      <Icon icon="mdi:filter-check" class="mt-1" />
    </div>
    <div class="flex mt-2 gap-2" v-if="visibleCard">
      <CardArchiveTypeIndex
        title="عرض الجميع"
        :count="archiveTypes.length"
        @click="onClick(-1)"
      />
      <CardArchiveTypeIndex
        v-for="archiveType in archiveTypes"
        :key="archiveType.id"
        :title="archiveType.name"
        :count="archiveType.archives?.toString()"
        @click="onClick(archiveType.id)"
      />
    </div>
  </div>
</template>
