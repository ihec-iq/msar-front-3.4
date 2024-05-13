<script setup lang="ts">
import { onMounted, ref } from "vue";

import Swal from "sweetalert2";
import { t } from "@/utilities/I18nPlugin";
import { truncateFileName } from "@/utilities/tools";

import { useArchiveStore } from "../archiveStore";
const { _deleteDocument } = useArchiveStore();

const props = defineProps({
  file: { type: Object, required: true },
  tag: { type: String, default: "li" },
});
const document = ref(props.file);
const generateURL = (
  path: string | undefined = "",
  extension: string | undefined = ""
): string => {
  if (
    extension == "png" ||
    extension == "jpg" ||
    extension == "image/png" ||
    extension == "image/jpeg"
  )
    return new URL(path).toString();
  //return new URL(path, import.meta.url);
  else if (extension == "pdf" || extension == "application/pdf")
    return new URL("@/assets/image/pdf.png", import.meta.url).toString();
  else if (
    extension ==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    extension == "xls" ||
    extension == "xlsx"
  )
    return new URL("@/assets/image/excel.png", import.meta.url).toString();
  else
    return new URL("@/assets/image/undefined.png", import.meta.url).toString();
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
const openFile = (path: string) => {
  const fileUrl = path; // Replace with your file URL
  window.open(fileUrl, "_blank");
};
</script>
<template>
  <component
    :is="tag"
    class="file-preview w-200px bg-black-200/10 ma-2 pa-6 preview-card cursor-pointer"
    style="display: block"
  >
    <button @click="removeFile(document.id)" type="button" class="close-icon">&times;</button>
    <img
      @click="openFile(document.path)"
      class="object-cover lg:h-36 lg:w-36 md:w-20 md:h-20 xs:w-12 xs:h-12 m-2 ml-auto mr-auto"
      :src="generateURL(document.path, document.extension)"
      :alt="document.title"
      :title="document.title"
    />
    <div
      style="color: darkkhaki"
      class="info"
      :alt="document.title"
      :title="document.title"
    >
      {{ truncateFileName(document.title, 15) }}
    </div>
    <span style="color: darkkhaki" class="info">
      {{ document.extension }}
      {{ document.size }}

      <!-- <button
        class="bg-create hover:bg-createHover duration-500 h-10 w-32 rounded-lg text-white"
        @click="openFile(document.path)"
      >
        {{ t("Open") }}
      </button> -->
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
@/views/Archive/archiveStore@/utilities/I18nPlugin@/utilities/tools