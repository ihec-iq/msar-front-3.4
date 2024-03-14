import { ref } from "vue";
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import { t } from "@/utils/I18nPlugin";

export const useDragDropStore = defineStore("DragDrop", () => {
  const count = ref(0);
  const filesDataInput = ref<File[]>([]);

  function onInputChange(e: any) {
    addFilesInput(e.target.files);
    e.target.value = null; // reset so that selecting the same file again will still cause it to fire this change
  }
  function addFilesInput(newFiles: File[]) {
    const newUploadableFiles = [...newFiles]
      .map((file) => file)
      .filter((file) => !fileExists(file));
    filesDataInput.value = filesDataInput.value.concat(newUploadableFiles);
  }

  function fileExists(file: File) {
    return filesDataInput.value.some(
      ({ lastModified, name, size, type }) =>
        lastModified === file.lastModified &&
        name === file.name &&
        size === file.size &&
        type === file.type
    );
  }
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
      return new URL(
        "@/assets/image/undefined.png",
        import.meta.url
      ).toString();
  };

  const generateIcon = (extension: string | undefined = ""): string => {
    if (
      extension == "png" ||
      extension == "jpg" ||
      extension == "image/png" ||
      extension == "image/jpeg"
    )
      return "https://img.icons8.com/fluency/48/image--v1.png";
    else if (extension == "pdf" || extension == "application/pdf")
      return "https://img.icons8.com/office/16/pdf.png";
    else if (
      extension ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      extension == "xls" ||
      extension == "xlsx"
    )
      return "https://img.icons8.com/color/48/microsoft-excel-2019--v1.png";
    else if (
      extension ==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      extension == "doc" ||
      extension == "docx"
    )
      return "https://img.icons8.com/color/48/microsoft-word-2019--v1.png";
    else return "https://img.icons8.com/color/48/file.png";
  };

  const CheckFileType = (type: string): string => {
    if (
      type ==
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
    filesDataInput.value.splice(index, 1);
    return;
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
          /* empty */
          filesDataInput.value.splice(index, 1);
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
  return {
    count,
    filesDataInput,
    fileExists,
    addFilesInput,
    onInputChange,
    generateURL,
    truncateString,
    formatFileSize,
    CheckFileType,
    removeFile,
    generateIcon,
  };
});
