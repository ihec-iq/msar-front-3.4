<script setup lang="ts">
import { onMounted, ref, shallowRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useArchiveStore } from "@/stores/archives/archive";
import Swal from "sweetalert2";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { usePermissionStore } from "@/stores/permission";
import FilePreview from "@/components/FilePreview.vue";
import DragDrop from "@/components/DragDrop.vue";
import WangEditor from "@/components/WangEditor.vue";
import { useDragDropStore } from "@/compositions/dragDrop";
import { useI18n } from "@/stores/i18n/useI18n";
import IPage from "@/components/ihec/IPage.vue";
import IPageHeader from "@/components/ihec/IPageHeader.vue";
import IButton from "@/components/ihec/IButton.vue";

const { archiveTypes } = storeToRefs(useArchiveStore());
const { t } = useI18n();

//region"Drag and Drop"

const { filesDataInput } = storeToRefs(useDragDropStore());

//#endregion

//#region Vars
const { checkPermissionAccessArray } = usePermissionStore();
const namePage = ref(".....");
const route = useRoute();
const id = ref(Number(route.params.id));
const isIn = ref(true);
const rtlStore = useRtlStore();
const { is } = storeToRefs(rtlStore);

const archiveStore = useArchiveStore();
const { archive } = storeToRefs(useArchiveStore());
const Loading = ref(false);

const router = useRouter();
const errors = ref<String | null>();
//#endregion
//#region CURD
const store = () => {
  errors.value = null;
  archive.value.isIn = isIn.value ? 1 : 0;
  const formData = new FormData();
  formData.append("id", archive.value.id.toString());
  formData.append("title", archive.value.title.toString());
  formData.append("description", archive.value.description.toString());
  formData.append("issueDate", archive.value.issueDate.toString());
  formData.append("number", archive.value.number.toString());
  formData.append("way", archive.value.way.toString());
  formData.append("sectionId", archive.value.sectionId.toString());
  formData.append("archiveTypeId", archive.value.archiveTypeId.toString());
  formData.append("isIn", archive.value.isIn == 0 ? "0" : "1");
  const files = filesDataInput.value;
  for (let i = 0; i < files.length; i++) {
    formData.append("files[]", files[i]);
  }
  //console.log([...formData]);
  archiveStore
    .store(formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your archive has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        filesDataInput.value = [];
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
  archive.value.isIn = isIn.value ? 1 : 0;
  const formData = new FormData();

  formData.append("id", archive.value.id.toString());

  formData.append("title", archive.value.title.toString());
  formData.append(
    "description",
    archive.value.description == null
      ? ""
      : archive.value.description.toString()
  );
  formData.append("issueDate", archive.value.issueDate.toString());
  formData.append(
    "number",
    archive.value.number == null ? "" : archive.value.number.toString()
  );
  formData.append(
    "way",
    archive.value.way == null ? "" : archive.value.way.toString()
  );
  formData.append("sectionId", archive.value.sectionId.toString());
  formData.append("archiveTypeId", archive.value.archiveTypeId.toString());
  formData.append("isIn", archive.value.isIn == 0 ? "0" : "1");

  const files = filesDataInput.value;
  for (let i = 0; i < files.length; i++) {
    formData.append("files[]", files[i]);
  }
  archiveStore
    .update(archive.value.id, formData)
    .then((response) => {
      if (response.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your Archive has been updated",
          showConfirmButton: false,
          timer: 1500,
        });
        filesDataInput.value = [];
        showData();
      }
    })
    .catch((error) => {
      //errors.value = Object.values(error.response.data.errors).flat().join();
      errors.value = archiveStore.getError(error);
      Swal.fire({
        icon: "error",
        title: "updating data fails!!!",
        text: error.response.data.message,
        footer: "",
      });
    });
}
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
const showData = async () => {
  Loading.value = true;
  archive.value.files = [];
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
  Loading.value = false;
};
const updateList = () => {
  showData();
};
//#endregion
const back = () => {
  router.push({
    name: "archiveIndex",
  });
};

onMounted(async () => {
  //console.log(can("show archives1"));
  checkPermissionAccessArray(["show archives"]);
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = t("ArchiveAdd");
    archive.value.id = 0;
  } else {
    await showData();
    archive.value.id = id.value;
    namePage.value = t("ArchiveUpdate");
  }
  filesDataInput.value = [];
  await useArchiveStore().getArchiveTypes();
});
</script>
<template>
  <IPage>
    <template v-slot:header>
      <IPageHeader :title="namePage" />
    </template>
    <template v-slot:content
      ><div class="w-full">
        <div class="w-full p-6 grid lg:grid-cols-4 xs:grid-cols-2">
          <div class="w-12/12 col-span-4">
            <div class="_inputLabel">{{ t("Title") }}</div>
            <input v-model="archive.title" type="text" class="_input" />
          </div>
          <div class="w-12/12 mx-2 my-2">
            <div class="_inputLabel">
              {{ t("NumberBook") }}
            </div>
            <input v-model="archive.number" type="text" class="_input" />
          </div>
          <div class="w-12/12 mx-2 my-2">
            <div class="_inputLabel">
              {{ t("Date") }}
            </div>
            <input v-model="archive.issueDate" type="date" class="_input" />
          </div>
          <div class="w-12/12 mx-2 my-2">
            <div class="_inputLabel">
              {{ t("Type") }}
            </div>
            <select v-model="archive.archiveTypeId" class="_input">
              <option
                v-for="archiveType in archiveTypes"
                :key="archiveType.id"
                :value="archiveType.id"
              >
                {{ archiveType.name }}
              </option>
            </select>
          </div>
          <div class="w-12/12 mx-2 my-2">
            <div class="_inputLabel">
              {{ t("way") }}
            </div>
            <input v-model="archive.way" type="text" class="_input" />
          </div>
          <div class="w-full col-span-4 my-2">
            <div class="_inputLabel">{{ t("Description") }}</div>
            <input v-model="archive.description" type="text" class="_input" />
          </div>
          <div class="w-12/12 my-2">
            <div class="_inputLabel">
              {{ t("TypeBook") }} : {{ isIn ? "داخل" : "خارج" }}
            </div>
            <input
              type="checkbox"
              v-model="isIn"
              class="toggle toggle-secondary"
              checked
            />
          </div>
        </div>
        <div>
          <div class="grid lg:grid-cols-4 md:grid-cols-4 xs:grid-cols-2 gap-10">
            <div
              class="flex-none hover:ease-in"
              v-for="document in archive.files"
              :key="document.name"
            >
              <FilePreview
                :file="document"
                @updateList="updateList"
                class="preview-card cursor-pointer"
              >
              </FilePreview>
            </div>
          </div>
        </div>
        <DragDrop></DragDrop>
        <div class="px-6">
          <div id="showFiles" class="p-0 flex flex-col w-full list-none">
            <div class="w-64 content-center" v-if="Loading">
              <div
                class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span
                  class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                  >Loading...</span
                >
              </div>
            </div>
          </div>
          <div id="DropZone"></div>
        </div>

        <div
          class="max-w-screen-xl flex flex-wrap items-center flex-row-reverse justify-between mx-auto p-4"
        >
          <!-- end -->
          <IButton
            v-if="archive.id == 0"
            :text="t('Create')"
            :onClick="store"
          />
          <IButton v-else :text="t('Update')" :onClick="update" />
          <!-- start -->
          <IButton
            v-if="archive.id != 0"
            color="red"
            type="outlined"
            :text="t('Delete')"
            :onClick="Delete"
          />
        </div>

        <!-- bottom tool bar -->
        <!-- <div
          :class="{
            'lg:w-[99.2%] xs:w-[97%] lg:mx-2 xs:mx-2 bottom': is,
            'lg:w-[95%] md:w-[90%] xs:w-[75%] lg:mr-0 ltr:xs:ml-3 rtl:xs:mr-3 bottom':
              !is,
          }"
          class="dark:bg-bottomTool duration-700 bg-ideNavLight p-2 rounded-lg flex items-center justify-end fixed bottom-0 print:hidden"
        >
          <div class="flex ltr:ml-8 rtl:mr-8">
            <div class="items-center mr-3">
              <button
                v-if="archive.id == 0"
                @click="store()"
                class="bg-create hover:bg-createHover ml-1 duration-500 h-10 lg:w-32 xs:w-20 rounded-lg text-white"
              >
                {{ t("Create") }}
              </button>
              <button
                v-else
                @click="update()"
                class="bg-update hover:bg-updateHover ml-1 duration-500 h-10 lg:w-32 xs:w-20 rounded-lg text-white"
              >
                {{ t("Update") }}
              </button>
              <button
                v-if="archive.id != 0"
                @click="Delete()"
                class="bg-delete hover:bg-deleteHover duration-500 h-10 lg:w-32 xs:w-20 rounded-lg text-white ml-2"
              >
                {{ t("Delete") }}
              </button>
            </div>
          </div>
        </div>
        <div
          :class="{
            'ltr:left-4 rtl:right-4': is,
            'ltr:left-28 rtl:right-28': !is,
          }"
          class="backBtn z-10 fixed bottom-2 lg:ml-3 xs:ml-0 print:hidden"
        >
          <button
            @click="back()"
            class="bg-back hover:bg-backHover h-10 duration-500 lg:w-32 xs:w-20 p-2 rounded-md text-white"
          >
            {{ t("Back") }}
          </button>
        </div> -->
        <!-- end bottom tool -->
      </div>
    </template>
  </IPage>
</template>
<style scoped>
.ql-editor {
  direction: rtl;
  text-align: right;
}
.drop-area {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 50px;
  background: rgba(255, 255, 255, 0.333);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: 0.2s ease;
}
.drop-area[data-active="true"] {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  background: rgba(255, 255, 255, 0.8);
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
html.dark {
  --w-e-textarea-bg-color: #333;
  --w-e-textarea-color: #fff;
  /* ...others... */
}
</style>
