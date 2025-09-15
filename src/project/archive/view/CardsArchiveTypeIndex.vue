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
</script>
<template>
  <div class="align-middle bg-opacity-50  bg-blue-100 py-2 px-2 rounded-lg" v-if="archiveTypes.length > 0">
     <div
      class="collapse-title align-middle content-center items-center flex border-dotted border-gray-200 border-2"
    >
      <span class="mx-2 px-2"> للاطلاع على  الكتب حسب نوع الكتاب </span>
      <Icon icon="mdi:filter-check" />
      
    </div>
    <div class="grid grid-cols-6 mt-2 gap-2 place-items-center justify-center items-center  " >
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
