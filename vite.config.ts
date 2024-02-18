import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue({}),
    vueJsx(),
    Components({
      resolvers: [
        (I2) => {
          // where `componentName` is always CapitalCase
          if (I2.startsWith("I2")) return { name: I2.slice(3), from: "I2" };
        },
        VantResolver(),
      ],
      dts: true,
    }),
    [
      VitePWA({
        includeAssets: [
          "favicon.ico",
          "apple-touch-icon.png",
          "mask-icon.svg",
          "fonts/*.ttf",
          "images/*.png",
          "css/*.css",
        ],
        registerType: "autoUpdate",
        injectRegister: "auto",
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        },
        manifest: {
          name: "FlowApp",
          short_name: "Flow App",
          theme_color: "#fff",
          background_color: "#fff",
          display: "standalone",
          orientation: "portrait",
          scope: "/",
          start_url: "/",
          related_applications: [
            {
              platform: "webapp",
              url: "https://10.10.10.10/10/manifest.webmanifest",
            },
          ],
          icons: [
            {
              src: "images/icons/icon-72x72.png",
              sizes: "72x72",
              type: "image/png",
            },
            {
              src: "images/icons/icon-96x96.png",
              sizes: "96x96",
              type: "image/png",
            },
            {
              src: "images/icons/icon-128x128.png",
              sizes: "128x128",
              type: "image/png",
            },
            {
              src: "images/icons/icon-144x144.png",
              sizes: "144x144",
              type: "image/png",
            },
            {
              src: "images/icons/icon-152x152.png",
              sizes: "152x152",
              type: "image/png",
            },
            {
              src: "images/icons/icon-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "images/icons/icon-384x384.png",
              sizes: "384x384",
              type: "image/png",
            },
            {
              src: "images/icons/icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "images/icons/icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
          prefer_related_applications: false,
        },
      }),
    ],
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    "process.env": process.env,
  },
  base: process.env.NODE_ENV === "production" ? "/10/" : "/",
  server: {
    watch: {
      usePolling: true,
    },
  },
});
