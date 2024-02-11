<script lang="ts">
import { defineComponent } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import axios from "axios";

export default defineComponent({
  components: { QuillEditor },
  props: {
    modelValue: String,
    placeholder: {
      type: String,
      default: "ابدء الكتابة هنا..",
    },
  },
  emits: ["update:modelValue"],
  computed: {
    options() {
      return {
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
    },
    editor() {
      return editor.getQuill();
    },
  },
  mounted() {
    this.editor.format("direction", "rtl");

    this.setHTML(this.modelValue);
  },
  methods: {
    getHTML() {
      return this.$refs.editor.getHTML();
    },
    setHTML(value: string | undefined) {
      return this.$refs.editor.setHTML(value);
    },
    onEditorReady(editor: {
      getModule: (arg0: string) => {
        (): any;
        new (): any;
        addHandler: {
          (arg0: string, arg1: () => Promise<void>): void;
          new (): any;
        };
      };
    }) {
      editor
        .getModule("toolbar")
        .addHandler("image", () => this.imageHandler(editor));
    },
    imageHandler: async function (editor: {
      getSelection: (arg0: boolean) => any;
      insertEmbed: (arg0: any, arg1: string, arg2: any) => any;
    }) {
      const input = document.createElement("input");

      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        const file = input.files[0];
        const formData = new FormData();

        formData.append("file", file);

        // Save current cursor state
        const range = editor.getSelection(true);

        let toast = this.$toast.info("جاري رفع الصورة...", {
          duration: null,
        });

        await axios
          .post("/admin/media", formData)
          .then(async ({ data }) => {
            // Insert uploaded image
            await editor.insertEmbed(range.index, "image", data.link);
          })
          .catch(({ response }) => {
            this.$toast.error("حصلت مشكلة غير متوقعة");
          })
          .finally(() => {
            toast.remove();
          });
      };
    },
  },
});
</script>
<template>
  <div class="block">
    <QuillEditor
      ref="editor"
      class="quill-editor"
      :placeholder="placeholder"
      :options="$$$options"
      :v-model="modelValue"
      @ready="onEditorReady($event)"
      @update:content="$emit('update:modelValue', this.getHTML())"
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
