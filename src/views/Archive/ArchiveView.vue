<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useArchiveStore } from "@/stores/Archive/archive";
import Swal from "sweetalert2";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";
import useLanguage from "@/stores/i18n/languageStore";
import { useRtlStore } from "@/stores/i18n/rtlPi";

import DropZone from "@/components/DropZone.vue";
import FilePreview from "@/components/FilePreview.vue";

// File Management
import useFileList from "@/compositions/file-list";

// Uploader
import createUploader from "@/compositions/file-uploader";
const { uploadFiles } = createUploader("YOUR URL HERE");
const { files, addFiles, removeFile } = useFileList();

function onInputChange(e) {
  addFiles(e.target.files);
  e.target.value = null; // reset so that selecting the same file again will still cause it to fire this change
}

const namePage = ref("Archive Add");
const route = useRoute();
const id = ref(Number(route.params.id));
const isIn = ref(false);
const rtlStore = useRtlStore();
const { isClose } = storeToRefs(rtlStore);

const { t } = useLanguage();
const archiveStore = useArchiveStore();
const { archive } = storeToRefs(useArchiveStore());
// const {  } = featureStore;
const router = useRouter();
const errors = ref(null);
const file1 = ref("");
const onFileChange = (e) => {
  file1.value = e.target.files[0];
};
//#region store and update
const store = () => {
  errors.value = null;
  archive.value.isIn = isIn.value ? 1 : 0;
  const formdata = new FormData();
  formdata.append("id", archive.value.id.toString());
  formdata.append("title", archive.value.title.toString());
  formdata.append("description", archive.value.description.toString());
  formdata.append("file1", file1.value);
  formdata.append("issueDate", archive.value.issueDate.toString());
  formdata.append("number", archive.value.number.toString());
  formdata.append("way", archive.value.way.toString());
  formdata.append("sectionId", archive.value.sectionId.toString());
  formdata.append("archiveTypeId", archive.value.archiveTypeId.toString());
  formdata.append("isIn", archive.value.isIn == 0 ? "0" : "1");
  console.log(formdata);
  archiveStore
    .store(formdata)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your archive has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        router.go(-1);
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = archiveStore.getError(error);
      Swal.fire({
        icon: "error",
        title: "create new data fails!!!",
        text: error.response.data.message,
        footer: "",
      });
    });
};
function update() {
  errors.value = null;
  // saleCustomer.custom_group_bill_sale_id = props.idBill;
  archive.value.isIn = isIn.value ? 1 : 0;
  console.log(archive.value);
  archiveStore
    .update(archive.value)
    .then((response) => {
      console.log(response.data.data);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your Archive has been updated",
        showConfirmButton: false,
        timer: 1500,
      });
      router.go(-2);
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = archiveStore.getError(error);
      Swal.fire({
        icon: "error",
        title: "create new data fails!!!",
        text: error.response.data.message,
        footer: "",
      });
    });
}
//#endregion

const Delete = async () => {
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
        await archiveStore._delete(archive.value.id).then(() => {
          swalWithBootstrapButtons.fire(
            t("Deleted!"),
            t("Deleted successfully ."),
            "success"
          );
          router.go(-1);
        });
      }
    });
};
//#region files
const forImage = ref<any>();
const previewImage = ref(false);
const openPreview = (data: any) => {
  // archive.value.files?.forEach((element) => {
  // });
  forImage.value = data.path;
  previewImage.value = true;
};

const DeleteFile = async () => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn m-2 bg-red-700",
      cancelButton: "btn bg-grey-400",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons.fire({
    title: t("Are You Sure?"),
    text: t("You Won't Be Able To Revert This!"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: t("Yes, delete it!"),
    cancelButtonText: t("No, cancel!"),
    reverseButtons: true,
  });
  // .then(async (result) => {
  //   if (result.isConfirmed) {
  //     await archiveStore._delete(archive.value.id).then(() => {
  //       swalWithBootstrapButtons.fire(
  //         t("Deleted!"),
  //         t("Deleted successfully ."),
  //         "success"
  //       );
  //     });
  //   }
  // });
};
//#endregion
const showData = async () => {
  await archiveStore
    .show(id.value)
    .then((response) => {
      if (response.status == 200) {
        archive.value.id = response.data.data.id;
        archive.value.title = response.data.data.title;
        archive.value.description = response.data.data.description;
        archive.value.issueDate = response.data.data.issueDate.split(" ")[0];
        archive.value.number = response.data.data.number;
        archive.value.way = response.data.data.way;
        archive.value.sectionId = response.data.data.sectionId;
        archive.value.archiveTypeId = response.data.data.archiveTypeId;
        archive.value.isIn = response.data.data.isIn;
        archive.value.files = response.data.data.files;
        isIn.value = response.data.data.isIn == 0 ? false : true;
        archive.value.isInWord = response.data.data.isInWord;
      }
    })
    .catch((errors) => {
      console.log(errors);
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Your Archive file not exist !!!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        router.go(-1);
      });
    });
};
const back = () => {
  router.push({
    name: "archiveIndex",
  });
};

onMounted(async () => {
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "Archive Add";
    archive.value.id = 0;
  } else {
    await showData();
    archive.value.id = id.value;
    namePage.value = "Archive Update";
  }
});
</script>
<template>
  <PageTitle> {{ namePage }}</PageTitle>
  <div class="w-full p-6">
    <div class="w-full flex lg:flex-row xs:flex-col">
      <div class="lg:w-1/3 mr-2 xs:w-full">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("Title") }}
        </div>
        <input
          v-model="archive.title"
          type="text"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
        />
      </div>
      <div class="lg:w-1/3 mr-2 xs:w-full">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("isIn") }}{{ isIn }}
        </div>
        <input
          v-model="isIn"
          type="checkbox"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
        />
      </div>
      <div class="lg:w-1/3 mx-2 xs:w-full">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("Date") }}
        </div>
        <input
          v-model="archive.issueDate"
          type="date"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
        />
      </div>
      <div class="lg:w-1/3 mx-2 xs:w-full">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("Number") }}
        </div>
        <input
          v-model="archive.number"
          type="text"
          class="w-full outline-none h-10 px-3 py-2 rounded-md bg-lightInput dark:bg-input text-text dark:text-textLight"
        />
      </div>
      <div class="lg:w-1/3 mx-2 xs:w-full">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("File1") }}
        </div>
        <input @change="onFileChange" ref="file" type="file" />
        <img :src="file1" alt="file1" />
      </div>
    </div>
    <div class="mt-10">
      <div class="w-full mx-2">
        <div
          class="mb-2 md:text-sm text-base mr-3 font-bold text-text dark:text-textLight"
        >
          {{ t("Description") }}
        </div>
        <quill-editor
          v-model:content="archive.description"
          contentType="html"
          theme="snow"
          class="text-text dark:text-textLight bg-lightInput dark:bg-input h-60"
        ></quill-editor>
      </div>
    </div>
    <div class="my-10 flex justify-between w-full lg:flex-row xs:flex-col">
      <div class="flex flex-col lg:w-1/2 xs:w-full lg:mb-0 xs:mb-4">
        <div
          v-for="fileData in archive.files"
          :key="fileData.id"
          class="flex flex-col justify-around mr-5"
        >
          <div
            class="bg-gray-700 w-64 h-64 flex flex-col justify-between rounded-lg py-3 px-5"
          >
            <div class="w-full flex justify-between">
              <div :title="fileData.name">
                {{ fileData.name.substring(0, 8) }}...
              </div>
              <div>{{ fileData.size }}</div>
            </div>
            <div
              v-if="
                fileData.extension === 'png' || fileData.extension === 'jpg'
              "
              class="w-full flex justify-center"
            >
              <img class="w-20 h-20" :src="fileData.path" alt="aa" />
            </div>
            <div
              class="w-full flex justify-center"
              v-if="fileData.extension === 'pdf'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M10 10.5h1q.425 0 .713-.288T12 9.5v-1q0-.425-.288-.713T11 7.5H9.5q-.2 0-.35.15T9 8v4q0 .2.15.35t.35.15q.2 0 .35-.15T10 12v-1.5Zm0-1v-1h1v1h-1Zm5 3q.425 0 .713-.288T16 11.5v-3q0-.425-.288-.713T15 7.5h-1.5q-.2 0-.35.15T13 8v4q0 .2.15.35t.35.15H15Zm-1-1v-3h1v3h-1Zm4-1h.5q.2 0 .35-.15T19 10q0-.2-.15-.35t-.35-.15H18v-1h.5q.2 0 .35-.15T19 8q0-.2-.15-.35t-.35-.15h-1q-.2 0-.35.15T17 8v4q0 .2.15.35t.35.15q.2 0 .35-.15T18 12v-1.5ZM8 18q-.825 0-1.413-.588T6 16V4q0-.825.588-1.413T8 2h12q.825 0 1.413.588T22 4v12q0 .825-.588 1.413T20 18H8Zm-4 4q-.825 0-1.413-.588T2 20V7q0-.425.288-.713T3 6q.425 0 .713.288T4 7v13h13q.425 0 .713.288T18 21q0 .425-.288.713T17 22H4Z"
                />
              </svg>
              <!-- these icons down not working -->
              <Icon name="uil:github" color="black" />
              <Icon icon="material-symbols:picture-as-pdf-rounded" />
              <!-- icons -->
            </div>
            <div class="flex">
              <button
                @click="openPreview(fileData)"
                class="mr-2 bg-update hover:bg-updateHover duration-500 h-10 w-32 rounded-lg text-white"
              >
                {{ t("Open") }}
              </button>
              <button
                @click="DeleteFile()"
                class="bg-delete hover:bg-deleteHover duration-500 h-10 w-32 rounded-lg text-white"
              >
                {{ t("Delete") }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="lg:w-1/2 xs:w-full" id="DropZone">
        <DropZone
          class="drop-area bg-gray-800 rounded-lg"
          @files-dropped="addFiles"
          #default="{ dropZoneActive }"
        >
          <label for="file-input">
            <span v-if="dropZoneActive">
              <span>Drop Them Here</span>
              <span class="smaller">to add them</span>
            </span>
            <span v-else>
              <span>Drag Your Files Here</span>
              <span class="smaller">
                or <strong><em>click here</em></strong> to select files
              </span>
            </span>

            <input
              type="file"
              id="file-input"
              multiple
              @change="onInputChange"
            />
          </label>
          <ul class="image-list" v-show="files.length">
            <FilePreview
              v-for="file of files"
              :key="file.id"
              :file="file"
              tag="li"
              @remove="removeFile"
            />
          </ul>
        </DropZone>
        <button
          v-if="false"
          @click.prevent="uploadFiles(files)"
          class="upload-button"
        >
          Upload
        </button>
      </div>
    </div>
    <!-- bottom tool bar -->
    <div
      :class="{
        'w-[95%] bottom': isClose,
        'w-10/12 bottom': !isClose,
      }"
      class="dark:bg-bottomTool duration-700 bg-ideNavLight p-2 rounded-lg flex items-center justify-end fixed bottom-0 print:hidden"
    >
      <div class="flex mr-8">
        <div class="items-center mr-3">
          <button
            v-if="archive.id == 0"
            @click="store()"
            class="bg-create hover:bg-createHover duration-500 h-10 w-32 rounded-lg text-white"
          >
            {{ t("Create") }}
          </button>
          <button
            v-else
            @click="update()"
            class="bg-update hover:bg-updateHover duration-500 h-10 w-32 rounded-lg text-white"
          >
            {{ t("Update") }}
          </button>
          <button
            v-if="archive.id != 0"
            @click="Delete()"
            class="bg-delete hover:bg-deleteHover duration-500 h-10 w-32 rounded-lg text-white ml-2"
          >
            {{ t("Delete") }}
          </button>
        </div>
      </div>
    </div>
    <div class="backBtn z-10 fixed bottom-2 ml-3 print:hidden">
      <button
        @click="back()"
        class="bg-back hover:bg-backHover h-10 duration-500 w-32 p-2 rounded-md text-white"
      >
        {{ t("Back") }}
      </button>
    </div>
    <!-- end bottom tool -->
  </div>

  <!-- open preview -->
  <van-popup
    is-link
    v-model:show="previewImage"
    class="lg:w-1/2 lg:h-[70%] xs:w-[90%] xs:h-[90%] bg-customer dark:bg-content rounded-lg overflow-hidden flex justify-center item-center"
  >
    <div>
      <img :src="forImage" class="" alt="archive image" />
    </div>
  </van-popup>
</template>
<style scoped>
.inner {
  box-shadow: 0px 0px 30px 20px grey;
}
.drop-area {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 50px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: 0.2s ease;
}
.drop-area[data-active="true"] {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  background: #111827;
}
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
