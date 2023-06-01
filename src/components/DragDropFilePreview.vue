<script lang="ts" setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import { useI18n } from "@/stores/i18n/useI18n";
const { t } = useI18n();
const props = defineProps({
  file: { type: Object, required: true },
});
const emits = defineEmits<{
  (e: "removeFromListFiles", index: Number): void;
}>();
const document = ref(props.file);
const generateURL = (
  path: any | undefined,
  extension: string | undefined = ""
): string => {
  if (
    extension == "png" ||
    extension == "jpg" ||
    extension == "image/png" ||
    extension == "image/jpeg"
  )
    return new URL(URL.createObjectURL(path)).toString();
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
const formatFileSize = (fileSize: number): string => {
  if (fileSize < 1024) {
    return `${fileSize} B`;
  } else if (fileSize < 1024 * 1024) {
    return `${(fileSize / 1024).toFixed(2)} KB`;
  } else if (fileSize < 1024 * 1024 * 1024) {
    return `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    return `${(fileSize / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
};
const CheckFileType = (type: string): string => {
  if (
    document.value.type ==
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
    return "xlsx";
  try {
    return type.split("/")[1];
  } catch (error) {
    return "ERR";
  }
};
const removeFile = async (index: number) => {
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
        emits("removeFromListFiles", index);
      }
    });
};
const truncateString = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  } else {
    const truncated = text.substring(0, maxLength - 4);
    const extension = text.substring(text.length - 4);
    return truncated + "..." + extension;
  }
};
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
