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
const namePage = ref("Archive Add");
const route = useRoute();
const id = ref(Number(route.params.id));

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
const store = () => {
  errors.value = null;
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
  formdata.append("isIn", archive.value.isIn.toString());
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
        // await _delete(id).then(() => {
        //   swalWithBootstrapButtons.fire(
        //     t("Deleted!"),
        //     t("Deleted successfully ."),
        //     "success"
        //   );
        // });
      }
    });
};
const showData = async () => {
  await archiveStore
    .show(id.value)
    .then((response) => {
      if (response.status == 200) {
        archive.value.id = response.data.data.id;
        archive.value.title = response.data.data.title;
        archive.value.description = response.data.data.description;
        archive.value.issueDate = response.data.data.issueDate
          .toISOString()
          .split("T")[0];
        archive.value.number = response.data.data.number;
        archive.value.way = response.data.data.way;
        archive.value.sectionId = response.data.data.sectionId;
        archive.value.archiveTypeId = response.data.data.archiveTypeId;
        archive.value.isIn = response.data.data.isIn;
        archive.value.isInWord = response.data.data.isInWord;
      }
    })
    .catch((errors) => {
      console.log(errors);
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
    <div class="w-full flex">
      <div class="w-1/3 mr-2">
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
      <div class="w-1/3 mx-2">
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
      <div class="w-1/3 mx-2">
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
          class="text-text dark:text-textLight bg-lightInput dark:bg-input h-96"
        ></quill-editor>
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
      <div class="flex">
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
</template>
