<script lang="ts" setup>
import { ref } from "vue";
import { useDragDropStore } from "@/compositions/dragDrop";
const {
  removeFile,
  generateURL,
  truncateString,
  CheckFileType,
  formatFileSize,
} = useDragDropStore();
const props = defineProps({
  file: { type: Object, required: true },
});
const document = ref(props.file);
</script>
<template>
  <div class="file-preview w-200px bg-black-200/10 ma-2 pa-6">
    <button @click="removeFile(document.id)" class="close-icon">&times;</button>
    <img
      class="object-cover h-36 w-36 m-2 ml-auto mr-auto"
      :src="generateURL(document, document.type)"
      :alt="document.name"
      :title="document.name"
    />
    <p>{{ truncateString(document.name, 12) }}</p>
    <p>
      File: {{ CheckFileType(document.type) }}
      {{ formatFileSize(document.size) }}
    </p>
  </div>
</template>

<style scoped>
.file-preview {
  /* width: 20%; */
  margin: 1rem 2.5%;
  position: relative;
  /* aspect-ratio: 1/1; */
  overflow: hidden;
  padding: 1px;
  border-radius: 5%;
  border: #888 1px solid;
}
.file-preview img {
  /* width: 100%;
  height: 100%; */
  display: block;
  object-fit: cover;
}
.file-preview .close-icon,
.file-preview .status-indicator {
  --size: 20px;
  position: absolute;
  line-height: var(--size);
  height: var(--size);
  border-radius: var(--size);
  box-shadow: 0 0 5px currentColor;
  right: 0.25rem;
  appearance: none;
  border: 0;
  padding: 0;
}
.file-preview .close-icon {
  width: var(--size);
  font-size: var(--size);
  background: #933;
  color: #fff;
  top: 0.25rem;
  cursor: pointer;
}
.file-preview .status-indicator {
  font-size: calc(0.75 * var(--size));
  bottom: 0.25rem;
  padding: 0 10px;
}
.file-preview .loading-indicator {
  animation: pulse 1.5s linear 0s infinite;
  color: #000;
}
.file-preview .success-indicator {
  background: #6c6;
  color: #040;
}
.file-preview .failure-indicator {
  background: #933;
  color: #fff;
}
.file-preview .info {
  font-size: calc(0.75 * var(--size));
  bottom: 0.25rem;
  padding: 0 10px;
  color: #000;
}
@-moz-keyframes pulse {
  0% {
    background: #fff;
  }
  50% {
    background: #ddd;
  }
  100% {
    background: #fff;
  }
}
@-webkit-keyframes pulse {
  0% {
    background: #fff;
  }
  50% {
    background: #ddd;
  }
  100% {
    background: #fff;
  }
}
@-o-keyframes pulse {
  0% {
    background: #fff;
  }
  50% {
    background: #ddd;
  }
  100% {
    background: #fff;
  }
}
@keyframes pulse {
  0% {
    background: #fff;
  }
  50% {
    background: #ddd;
  }
  100% {
    background: #fff;
  }
}
</style>
