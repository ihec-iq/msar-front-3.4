<script setup lang="ts">
import DragDropFilePreview from "@/components/DragDropFilePreview.vue";
import { t } from "@/utils/I18nPlugin";
import { storeToRefs } from "pinia";
import { useDragDropStore } from "@/compositions/dragDrop";
import { ref } from "vue";
import { useDropZone } from "@vueuse/core";

const dropZoneRef = ref<HTMLDivElement>();
const { isOverDropZone } = useDropZone(dropZoneRef, onDropFile);
function onDropFile(files: File[] | null) {
  if (files) {
    addFilesInput(files);
  }
}

const { onInputChange, addFilesInput } = useDragDropStore();
const { filesDataInput } = storeToRefs(useDragDropStore());
</script>
<template>
  <div class="w-full p-6">
    <div class="mt-10">
      <div class="w-full mx-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("FileBook") }} : {{ t("DropFiles") }}
        </div>
        <div
          ref="dropZoneRef"
          style="border: 2px gray dotted; padding: 5px"
          class="flex flex-col w-full min-h-200px h-auto bg-gray-400/10 justify-center items-center mt-6"
        >
          <div class="file-upload-container">
            <input
              id="dropZoneRef"
              multiple
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,xls,.xlsx"
              class="hidden"
              @change="onInputChange"
            />
            <label for="dropZoneRef">
              <div v-if="isOverDropZone" v-html="t('DropFiles')"></div>
              <div v-else v-html="t('ReleaseFiles')"></div>
            </label>
          </div>
          <div class="flex flex-wrap justify-center items-center">
            <DragDropFilePreview
              v-for="(file, index) in filesDataInput"
              :key="index"
              :file="file"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
label {
  font-size: 36px;
  cursor: pointer;
  display: block;
}
label span {
  display: block;
}
label input[type="file"]:not(:focus-visible) {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
label .smaller {
  font-size: 16px;
}
.image-list {
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  padding: 0;
  margin-bottom: 35px;
}
.preview-card {
  display: flex;
  border: 1px solid #a2a2a2;
  padding: 5px;
  margin: 5px;
}
.upload-button {
  display: block;
  appearance: none;
  border: 0;
  border-radius: 50px;
  padding: 0.75rem 3rem;
  margin: 1rem auto;
  font-size: 1.25rem;
  font-weight: bold;
  background: #369;
  color: #fff;
  text-transform: uppercase;
}
button {
  cursor: pointer;
}
</style>
