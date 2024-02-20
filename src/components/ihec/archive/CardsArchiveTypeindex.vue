<script setup lang="ts">
import { useArchiveStore } from "@/stores/archives/archiveStore";
import { storeToRefs } from "pinia";
import { onMounted, defineEmits } from "vue";
import { Icon } from "@iconify/vue";
import CardsArchiveTypeindex from "@/components/ihec/archive/CardsArchiveTypeindex.vue";

const { archiveTypes } = storeToRefs(useArchiveStore());

const emits = defineEmits<{
  getFilterData: [number, number]; // Define the event structure with three parameters
}>();
onMounted(async () => {
  await useArchiveStore()
    .getArchiveTypes()
    .then((response: any) => {
      console.log(response);
    });
  console.log(archiveTypes.value);
});
const onClick = (index: number) => {
  emits("getFilterData", 1, index);
};
</script>
<template>
  <div class="collapse align-middle" v-if="archiveTypes.length > 0">
    <input type="checkbox" class=" " />
    <div
      class="collapse-title align-middle content-center items-center flex border-dotted border-gray-200 border-2"
    >
      <span class="mx-2 px-2"> للاطلاع على كافة الكتب حسب نوع الكتاب </span>
     </div>
    <div class="collapse-content grid grid-cols-4">
      <div class="mt-5"></div>
      <CardsArchiveTypeindex
        title="عرض الجميع"
        count="0"
        class="col-span-4"
      ></CardsArchiveTypeindex>
      <!-- <CardsArchiveTypeindex
        class="col-span-4"
        v-for="archiveType in archiveTypes"
        :key="archiveType.id"
        :title="archiveType.name"
        :count="archiveType.archives?.toString()"
      ></CardsArchiveTypeindex> -->
    </div>
  </div>
</template>
