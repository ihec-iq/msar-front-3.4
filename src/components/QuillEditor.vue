<script lang="ts" setup>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { onMounted, ref } from "vue";
import axios from "axios";

const editor = ref<any>(null);

const options = {
  theme: "snow",
  modules: {
    toolbar: [
      ["bold", "italic", "underline"],
      ["blockquote", "link"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
    ],
  },
};

const getHTML = () => editor.value.getHTML();
const setHTML = (value: any) => editor.value.setHTML(value);

const onEditorReady = (editorInstance: any) => {
  editorInstance
    .getModule("toolbar")
    .addHandler("image", () => imageHandler(editorInstance));
};

const imageHandler = async (editorInstance: any) => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    const formData = new FormData();
    formData.append("file", file);

    // Save current cursor state
    const range = editorInstance.getSelection(true);

    // let toast = this.$toasted.info('جاري رفع الصورة...', {
    //   duration: null,
    // });
    console.log("جاري رفع الصورة...");
    try {
      const { data } = await axios.post("/admin/media", formData);
      // Insert uploaded image
      await editorInstance.insertEmbed(range.index, "image", data.link);
    } catch (error) {
      console.log("حصلت مشكلة غير متوقعة");
    } finally {
      toast.remove();
    }
  };
};
onMounted(() => {
  editor.getQuill().format("direction", "rtl");
});
</script>

<template>
  <div class="block">
    <QuillEditor
      ref="editor"
      class="quill-editor"
      :placeholder="placeholder"
      :options="options"
      :v-model="modelValue"
      @ready="onEditorReady($event)"
      @update:content="$emit('update:modelValue', getHTML())"
    />
  </div>
</template>

<style>
.ql-editor {
  direction: rtl;
  text-align: right;
  font-size: initial;
}

.quill-editor img {
  max-width: 100%;
  height: auto;
}

.ql-toolbar.ql-snow .ql-formats {
  margin-right: 0;
  margin-left: 0;
  margin-inline-end: 15px;
}

.ql-snow .ql-tooltip {
  z-index: 99999;
}

.ql-snow .ql-toolbar .ql-formats {
  margin: 8px;
}

.ql-snow .ql-toolbar .ql-formats:first-child {
  margin-inline-start: 12px;
}

.ql-snow .ql-editor pre.ql-syntax {
  direction: ltr;
  text-align: left;
}
</style>
