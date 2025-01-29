<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useArchiveStore } from "../archiveStore";
import { storeToRefs } from "pinia";
import { usePermissionsStore } from "@/project/core/permissionStore";
import FilePreview from "./FilePreview.vue";
import DragDrop from "./DragDrop.vue";
import { useDragDropStore } from "../dragDrop";
import { t } from "@/utilities/I18nPlugin";
import IPage from "@/components/ihec/IPage.vue";
import { crud_delete, prepareFormData } from "@/utilities/crudTool";
import IFooterCrud from "@/components/ihec/IFooterCrud.vue";
import IInput from "@/components/inputs/IInput.vue";
import { EnumInputType } from "@/components/ihec/enums/EnumInputType";
import ISelect from "@/components/inputs/ISelect.vue";
import ICheckbox from "@/components/inputs/ICheckbox.vue";
import IForm from "@/components/ihec/IForm.vue";
import IRow from "@/components/ihec/IRow.vue";
import ICol from "@/components/ihec/ICol.vue";
import { SuccessToast, ErrorToast, WarningToast } from "@/utilities/Toast";
import {
  useValidation,
  type IValidationResult,
  type IFieldValidation,
} from "@/utilities/Validation";
const { validate, min, required, foreignKey, max, sameAs, isObject } = useValidation();


const archiveStore = useArchiveStore();
const { archive } = storeToRefs(useArchiveStore());
const isLoading = ref(false);

const rules: Array<IFieldValidation> = [
  {
    field: "title",
    caption: t("Title"),
    rules: [required(), min(3), max(100)],
  },
  {
    field: "ArchiveType",
    caption: t("ArchiveType"),
    rules: [isObject()],
  },
  {
    field: "issueDate",
    caption: t("Issue Date"),
    rules: [required()],
  },
];

const { archiveTypes } = storeToRefs(useArchiveTypeStore());
const { filesDataInput } = storeToRefs(useDragDropStore());

//#region Vars
const { checkPermissionAccessArray } = usePermissionsStore();
const namePage = ref("");
const route = useRoute();
const id = ref(Number(route.params.id));
const isIn = ref(true);

const router = useRouter();
const errors = ref<String | null>();
//#endregion
//#region CURD
const reset = () => {
  archiveStore.resetData();
};

let validationResult = ref<IValidationResult>({ success: true, errors: [] });

const store = () => {
  errors.value = null;
  validationResult.value = validate(archive.value, rules);
  if (!validationResult.value.success) {
    WarningToast(t("ValidationFails"));
    return;
  }
  archive.value.isIn = isIn.value ? 1 : 0;
  const formData: FormData = prepareFormData(archive.value);
  const files = filesDataInput.value;
  for (let i = 0; i < files.length; i++) {
    formData.append("Files[]", files[i]);
  }

  archiveStore
    .store(formData)
    .then((response) => {
      if (response.status === 200) {
        SuccessToast();
        filesDataInput.value = [];
        router.go(-1);
      }
    })
    .catch((error) => {
      errors.value = archiveStore.getError(error);
      ErrorToast();
    });
};

function update() {
  validationResult.value = validate(archive.value, rules);
  if (!validationResult.value.success) {
    WarningToast(t("ValidationFails"));
    return;
  }

  errors.value = null;
  archive.value.isIn = isIn.value ? 1 : 0;
  const formData: FormData = prepareFormData(archive.value);
  const files = filesDataInput.value; 
  files.forEach((file: File) => {
    formData.append("FilesDocument[]", file);
  });
 
  archiveStore
    .update(archive.value.id, formData)

    .then((response) => {
      if (response.status === 200) {
        SuccessToast();
        filesDataInput.value = [];
        showData();
      }
    })
    .catch((error) => {
      errors.value = archiveStore.getError(error);
      ErrorToast();
    });
}

const Delete = () => {
  crud_delete({
    store: archiveStore,
    id: archive.value.id,
  }).then(() => {
    router.go(-1);
  });
};

const showData = async () => {
  isLoading.value = true;
  archive.value.FilesDocument = [];
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
        archive.value.ArchiveType = response.data.data.ArchiveType;
        archive.value.isIn = response.data.data.isIn;
        isIn.value = response.data.data.isIn == 0 ? false : true;
        archive.value.FilesDocument = response.data.data.FilesDocument;
        isIn.value = response.data.data.isIn == 0 ? false : true;
        archive.value.isInWord = response.data.data.isInWord;
      }
    })
    .catch((errors) => {
      console.log(errors);
      ErrorToast();
      router.go(-1);
    });
  isLoading.value = false;
};

const updateList = () => {
  showData();
};

//#endregion
window.onerror = function (msg, url, line, col, error) {
  //code to handle or report error goes here
  console.log(msg)

}
onMounted(async () => {
  isLoading.value = true;
  checkPermissionAccessArray([EnumPermission.ShowArchives]);
  if (Number.isNaN(id.value) || id.value === undefined) {
    namePage.value = "ArchiveAdd";
    archive.value.id = 0;
    reset()
  } else {
    await showData();
    archive.value.id = id.value;
    namePage.value = "ArchiveUpdate";
  }
  filesDataInput.value = [];
  await useArchiveTypeStore().getBySectionUser();
  isLoading.value = false;
});
const chackArchiveTypeLoad = async () => {
  if (
    archiveTypes.value.length == 0 ||
    archiveTypes.value == undefined ||
    archiveTypes.value == null
  )
    await useArchiveTypeStore().getBySectionUser();
};
import IButton2 from "@/components/ihec/IButton2.vue";
import { EnumPermission } from "@/utilities/EnumSystem";
import { EnumButtonType } from "@/components/ihec/enums/EnumButtonType";

import IErrorMessages from "@/components/ihec/IErrorMessages.vue";
import { useArchiveTypeStore } from "../archiveType/archiveTypeStore";
import ISelectObject from "@/components/inputs/ISelectObject.vue";
import { formDataToObject } from "@/utilities/formDataUtils";
</script>
<template>
  <IPage :HeaderTitle="t(namePage)" :is-loading="isLoading">
    <template #HeaderButtons>
      <IButton2 color="green" width="28" :type="EnumButtonType.Outlined" pre-icon="view-grid-plus" :onClick="reset"
        :text="t('New')" />
    </template>
    <IPageContent>
      <IRow>
        <IForm>
          <IRow>
            <ICol span="1" span-md="2" span-sm="1">
              <IInput :label="t('Title')" v-model="archive.title" name="title" :type="EnumInputType.Text"
                :IsRequire="true" />
            </ICol>
          </IRow>
          <IRow col-lg="4" col-md="2" col-sm="1">
            <ICol span="1" span-md="2" span-sm="1">
              <IInput :label="t('NumberBook')" v-model="archive.number" name="number" :type="EnumInputType.Text" />
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <IInput :label="t('Date')" v-model="archive.issueDate" name="issueDate" :type="EnumInputType.Date"
                :IsRequire="true" />
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <ISelectObject :label="t('ArchiveType')" v-model="archive.ArchiveType" name="ArchiveType"
                :options="archiveTypes" :IsRequire="true" @click=chackArchiveTypeLoad() />
            </ICol>
            <ICol span="1" span-md="2" span-sm="1">
              <IInput :label="t('way')" v-model="archive.way" name="way" :type="EnumInputType.Text" />
            </ICol>
            <ICol span="4" span-md="4" span-sm="4">
              <IInput :label="t('Description')" v-model="archive.description" name="description"
                :type="EnumInputType.Text" class="w-full" />
            </ICol>
          </IRow>
          <IRow>
            <ICol span="1" span-md="2" span-sm="1">
              <ICheckbox :label="`${t('TypeBook')}: ${isIn ? t('In') : t('Out')}`" v-model="isIn" :checked="true"
                :IsRequire="true" />
            </ICol>
          </IRow>
          <!-- file -->
          <IRow col-lg="4" col-md="4" col-sm="2">
            <ICol span="3" span-md="3" span-sm="2"  v-for="document in archive.FilesDocument" :key="document.name">
              <FilePreview :file="document" @updateList="updateList">
              </FilePreview>
            </ICol>
          </IRow>
          <DragDrop></DragDrop>
          <div class="px-6">
            <div id="showFiles" class="p-0 flex flex-col w-full list-none">
              <div class="w-64 content-center" v-if="isLoading">
                <div
                  class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status">
                  <span
                    class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
              </div>
            </div>
            <div id="DropZone"></div>
          </div>
        </IForm>
      </IRow>
      <IErrorMessages :validationResult="validationResult" />
    </IPageContent>

    <template #Footer>
      <IFooterCrud :isAdd="archive.id == 0" :onCreate="store" :onUpdate="update" :onDelete="Delete" />
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
}
</style>
