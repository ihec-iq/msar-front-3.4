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
const editorConfig = {
  placeholder: "الملاحظات ...",
  MENU_CONF: { head: { title: "header" } },
};
const handleCreated = (editor: string) => {
  editorRef.value = editor;
};
</script>

<template>
  <div style="border: 1px solid #ccc; margin-top: 10px" class="dark:bg-gray-800 bg-gray-200">
    <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" mode="default" style="border-bottom: 1px solid #ccc" />
    <Editor :defaultConfig="editorConfig" mode="default" v-model="modelValue"
      style="height: 300px;  text-align: right ; background: #eee" @onCreated="handleCreated"
      readonly="false" class="dark:bg-gray-800 bg-gray-200" />
  </div>
</template>
