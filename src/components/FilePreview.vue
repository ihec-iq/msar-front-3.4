<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useArchiveStore } from "@/stores/Archive/archive";
import useLanguage from "@/stores/i18n/languageStore";
import Swal from "sweetalert2";
const { t } = useLanguage();
const { _deleteDocument } = useArchiveStore();
const props = defineProps({
  file: { type: Object, required: true },
  tag: { type: String, default: "li" },
});
const document = ref(props.file);
const generateURL = (path: string) => {
  return new URL(path, import.meta.url);
};
const emits = defineEmits<{
  //(e: "change", id: number): void;
  (e: "updateList"): void;
}>();

const removeFile = async (id: number) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn m-2 bg-red-700",
      cancelButton: "btn bg-grey-400",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: t("Are You Sure?"),
      text: t("You Won't Be Able To Revert This!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, delete it!"),
      cancelButtonText: t("No, cancel!"),
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        await _deleteDocument(id)
          .then(() => {
            swalWithBootstrapButtons.fire(
              t("Deleted!"),
              t("Deleted successfully ."),
              "success"
            );
            emits("updateList");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
};
onMounted(() => {});
</script>
<template>
  <component :is="tag" class="file-preview">
    <button @click="removeFile(document.id)" class="close-icon">&times;</button>
    <img
      class="object-cover h-48 w-96"
      :src="generateURL(document.path).toString()"
      :alt="document.name"
      :title="document.name"
    />
    <span style="color: darkkhaki" class="info">
      {{ document.name }} -
      {{ Math.round(document.size) + "kb" }}
    </span>

    <span
      class="status-indicator loading-indicator"
      v-show="document.status == 'loading'"
      >In Progress</span
    >
    <span
      class="status-indicator success-indicator"
      v-show="document.status == true"
      >Uploaded</span
    >
    <span
      class="status-indicator failure-indicator"
      v-show="document.status == false"
      >Error</span
    >
  </component>
</template>

<style scoped>
.file-preview {
  width: 20%;
  margin: 1rem 2.5%;
  position: relative;
  aspect-ratio: 1/1;
  overflow: hidden;
  padding: 1px;
  border-radius: 5%;
  border: #040 2px solid;
}
.file-preview img {
  width: 100%;
  height: 100%;
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
