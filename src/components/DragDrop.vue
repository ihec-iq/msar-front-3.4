<script setup lang="ts">
import { computed, ref } from "vue";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { useDropZone } from "@vueuse/core";
import DragDropFilePreview from "@/components/DragDropFilePreview.vue";
import { useI18n } from "@/stores/i18n/useI18n";
const { t } = useI18n();
const emits = defineEmits<{
  (e: "setFiles", files: File[]): void;
}>();
const props = defineProps({
  filesCount: { type: Number, required: true },
});
//region"Drag and Drop"
const dropZoneRef = ref<HTMLDivElement>();
const filesDataInput = ref<File[]>([]);
function onDropFile(files: File[] | null) {
  if (files) {
    addFilesInput(files);
  }
}
const { isOverDropZone } = useDropZone(dropZoneRef, onDropFile);
function onInputChange(e: any) {
  addFilesInput(e.target.files);
  e.target.value = null; // reset so that selecting the same file again will still cause it to fire this change
}
function addFilesInput(newFiles: File[]) {
  let newUploadableFiles = [...newFiles]
    .map((file) => file)
    .filter((file) => !fileExists(file));
  filesDataInput.value = filesDataInput.value.concat(newUploadableFiles);
  emits("setFiles", filesDataInput.value);
}
const resetFiles = computed(() => {
  if (props.filesCount == 0) {
    filesDataInput.value = [];
    return 1;
  }
  return 0;
});

function fileExists(file: File) {
  return filesDataInput.value.some(
    ({ lastModified, name, size, type }) =>
      lastModified === file.lastModified &&
      name === file.name &&
      size === file.size &&
      type === file.type
  );
}
//#endregion
</script>
<template>
  <div class="w-full p-6">
    <div class="mt-10">
      <div class="w-full mx-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("FileBook") }} : {{ t("Drop files") }}
        </div>

        <div
          ref="dropZoneRef"
          class="flex flex-col w-full min-h-200px h-auto bg-gray-400/10 justify-center items-center mt-6"
        >
          <div class="file-upload-container">
            <input
              multiple
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,xls,.xlsx"
              class="hiddens"
              @change="onInputChange"
            />
            <label for="dropZoneRef">
              <div v-if="isOverDropZone">Release to drop files here.</div>
              <div v-else>
                Drop files here or
                <u>click here </u>
                to upload.
              </div>
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
