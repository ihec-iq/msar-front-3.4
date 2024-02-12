<script setup lang="ts">
import { ref, shallowRef } from "vue";
import "@wangeditor/editor/dist/css/style.css"; // import css
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
const editorRef = shallowRef();
import { i18nChangeLanguage } from "@wangeditor/editor";
const modelValue = defineModel<string>();
i18nChangeLanguage("en");

// content HTML
const valueHtml = ref("<p>hello</p>");
const toolbarConfig = {};
const editorConfig = { placeholder: "Type here..." };
const handleCreated = (editor: string) => {
  editorRef.value = editor; // record editor instance
};
</script>

<template>
  <div style="border: 1px solid #ccc; margin-top: 10px">
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      mode="default"
      style="border-bottom: 1px solid #ccc"
    />
    <Editor
      :defaultConfig="editorConfig"
      mode="default"
      v-model="modelValue"
      style="height: 400px; overflow-y: hidden; text-align: right"
      @onCreated="handleCreated"
      readonly="false"
    />
  </div>
</template>
