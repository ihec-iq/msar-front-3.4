import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";
// https://vitejs.dev/config/
const subdomain = "test"; // Replace 'subdomain' with your actual subdomain

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [VantResolver()],
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
  base: process.env.NODE_ENV === "production" ? "/test1/" : "/",
  // Replace 'subdomain' with your actual subdomain
  // build: {
  //   outDir: resolve(__dirname, `dist/${subdomain}`),
  //   assetsDir: `${subdomain}/assets/`,
  //   manifest: true,
  // },
});
