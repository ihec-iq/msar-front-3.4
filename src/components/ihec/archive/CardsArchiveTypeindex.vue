<script setup lang="ts">
import { useArchiveStore } from "@/stores/archives/archiveStore";
import { storeToRefs } from "pinia";
import { onMounted, defineEmits, ref, type PropType } from "vue";
import { Icon } from "@iconify/vue";
import CardArchiveTypeIndex from "./CardArchiveTypeIndex.vue";

const { archiveTypes } = storeToRefs(useArchiveStore());
const ischecked = ref(false);
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
  ischecked.value = false;
};
onMounted(async () => {
  await useArchiveStore().getArchiveTypes();
});
</script>
<template>
  <div class="collapse align-middle" v-if="archiveTypes.length > 0">
    <input type="checkbox" class="" v-model="ischecked" />
    <div
      class="collapse-title align-middle content-center items-center flex border-dotted border-gray-200 border-2"
    >
      <span class="mx-2 px-2"> للاطلاع على كافة الكتب حسب نوع الكتاب </span>
      <Icon icon="mdi:filter-check" />
    </div>
    <div class="collapse-content grid grid-cols-4">
      <div class="mt-5"></div>
      <CardArchiveTypeIndex
        title="عرض الجميع"
        count="0"
        class="col-span-4"
        @click="onClick(-1)"
      ></CardArchiveTypeIndex>
      <CardArchiveTypeIndex
        v-for="archiveType in archiveTypes"
        :key="archiveType.id"
        class="col-span-4"
        :title="archiveType.name"
        :count="archiveType.archives?.toString()"
        @click="onClick(archiveType.id)"
      ></CardArchiveTypeIndex>
    </div>
  </div>
</template>
