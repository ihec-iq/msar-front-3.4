import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
      },
    }),
    Components({
      resolvers: [VantResolver()],
      dts: true,
    }),
    AutoImport({
      dts: true,
      eslintrc: {
        enabled: true,
      },
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: ["vue", "vue-router", "pinia"],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    "process.env": process.env,
  },
  //base: process.env.NODE_ENV === "production" ? "/erp-msar/" : "/",
  //base: process.env.NODE_ENV === "production" ? "/" : "/",
  server: {
    watch: {
      usePolling: true,
    },
    port: 1991
  },
});
