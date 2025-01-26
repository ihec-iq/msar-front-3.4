// vite.config.mts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///D:/xampp/htdocs/msar-front-3.4/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/xampp/htdocs/msar-front-3.4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/xampp/htdocs/msar-front-3.4/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import Components from "file:///D:/xampp/htdocs/msar-front-3.4/node_modules/unplugin-vue-components/dist/vite.js";
import { VantResolver } from "file:///D:/xampp/htdocs/msar-front-3.4/node_modules/unplugin-vue-components/dist/resolvers.js";
import { VitePWA } from "file:///D:/xampp/htdocs/msar-front-3.4/node_modules/vite-plugin-pwa/dist/index.js";
import AutoImport from "file:///D:/xampp/htdocs/msar-front-3.4/node_modules/unplugin-auto-import/dist/vite.js";
var __vite_injected_original_import_meta_url = "file:///D:/xampp/htdocs/msar-front-3.4/vite.config.mts";
var vite_config_default = defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true
      }
    }),
    ,
    vueJsx(),
    Components({
      resolvers: [VantResolver()],
      dts: true
    }),
    [
      VitePWA({
        includeAssets: [
          "favicon.ico",
          "apple-touch-icon.png",
          "mask-icon.svg",
          "fonts/*.ttf",
          "images/*.png",
          "css/*.css"
        ],
        registerType: "autoUpdate",
        injectRegister: "auto",
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"]
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
              url: "https://10.10.10.10/erp-msar/manifest.webmanifest"
            }
          ],
          icons: [
            {
              src: "images/icons/icon-72x72.png",
              sizes: "72x72",
              type: "image/png"
            },
            {
              src: "images/icons/icon-96x96.png",
              sizes: "96x96",
              type: "image/png"
            },
            {
              src: "images/icons/icon-128x128.png",
              sizes: "128x128",
              type: "image/png"
            },
            {
              src: "images/icons/icon-144x144.png",
              sizes: "144x144",
              type: "image/png"
            },
            {
              src: "images/icons/icon-152x152.png",
              sizes: "152x152",
              type: "image/png"
            },
            {
              src: "images/icons/icon-192x192.png",
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: "images/icons/icon-384x384.png",
              sizes: "384x384",
              type: "image/png"
            },
            {
              src: "images/icons/icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "images/icons/icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable"
            }
          ],
          prefer_related_applications: false
        }
      })
    ],
    AutoImport({
      /* options */
      dts: true,
      eslintrc: {
        enabled: true
        // <-- this
      },
      include: [
        /\.[tj]sx?$/,
        // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/,
        // .vue
        /\.md$/
        // .md
      ],
      imports: [
        // presets
        "vue",
        "vue-router",
        "pinia"
      ]
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  define: {
    "process.env": process.env
  },
  base: process.env.NODE_ENV === "production" ? "/erp-msar/" : "/",
  server: {
    watch: {
      usePolling: true
    },
    port: 1990
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxceGFtcHBcXFxcaHRkb2NzXFxcXG1zYXItZnJvbnQtMy40XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFx4YW1wcFxcXFxodGRvY3NcXFxcbXNhci1mcm9udC0zLjRcXFxcdml0ZS5jb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi94YW1wcC9odGRvY3MvbXNhci1mcm9udC0zLjQvdml0ZS5jb25maWcubXRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcIm5vZGU6dXJsXCI7XHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlLWpzeFwiO1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZVwiO1xyXG5pbXBvcnQgeyBWYW50UmVzb2x2ZXIgfSBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzXCI7XHJcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gXCJ1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSh7XHJcbiAgICAgIHNjcmlwdDoge1xyXG4gICAgICAgIGRlZmluZU1vZGVsOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgICAsXHJcbiAgICB2dWVKc3goKSxcclxuICAgIENvbXBvbmVudHMoe1xyXG4gICAgICByZXNvbHZlcnM6IFtWYW50UmVzb2x2ZXIoKV0sXHJcbiAgICAgIGR0czogdHJ1ZSxcclxuICAgIH0pLFxyXG4gICAgW1xyXG4gICAgICBWaXRlUFdBKHtcclxuICAgICAgICBpbmNsdWRlQXNzZXRzOiBbXHJcbiAgICAgICAgICBcImZhdmljb24uaWNvXCIsXHJcbiAgICAgICAgICBcImFwcGxlLXRvdWNoLWljb24ucG5nXCIsXHJcbiAgICAgICAgICBcIm1hc2staWNvbi5zdmdcIixcclxuICAgICAgICAgIFwiZm9udHMvKi50dGZcIixcclxuICAgICAgICAgIFwiaW1hZ2VzLyoucG5nXCIsXHJcbiAgICAgICAgICBcImNzcy8qLmNzc1wiLFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgcmVnaXN0ZXJUeXBlOiBcImF1dG9VcGRhdGVcIixcclxuICAgICAgICBpbmplY3RSZWdpc3RlcjogXCJhdXRvXCIsXHJcbiAgICAgICAgd29ya2JveDoge1xyXG4gICAgICAgICAgZ2xvYlBhdHRlcm5zOiBbXCIqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Z31cIl0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtYW5pZmVzdDoge1xyXG4gICAgICAgICAgbmFtZTogXCJGbG93QXBwXCIsXHJcbiAgICAgICAgICBzaG9ydF9uYW1lOiBcIkZsb3cgQXBwXCIsXHJcbiAgICAgICAgICB0aGVtZV9jb2xvcjogXCIjZmZmXCIsXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kX2NvbG9yOiBcIiNmZmZcIixcclxuICAgICAgICAgIGRpc3BsYXk6IFwic3RhbmRhbG9uZVwiLFxyXG4gICAgICAgICAgb3JpZW50YXRpb246IFwicG9ydHJhaXRcIixcclxuICAgICAgICAgIHNjb3BlOiBcIi9cIixcclxuICAgICAgICAgIHN0YXJ0X3VybDogXCIvXCIsXHJcbiAgICAgICAgICByZWxhdGVkX2FwcGxpY2F0aW9uczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgcGxhdGZvcm06IFwid2ViYXBwXCIsXHJcbiAgICAgICAgICAgICAgdXJsOiBcImh0dHBzOi8vMTAuMTAuMTAuMTAvZXJwLW1zYXIvbWFuaWZlc3Qud2VibWFuaWZlc3RcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICBpY29uczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgc3JjOiBcImltYWdlcy9pY29ucy9pY29uLTcyeDcyLnBuZ1wiLFxyXG4gICAgICAgICAgICAgIHNpemVzOiBcIjcyeDcyXCIsXHJcbiAgICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHNyYzogXCJpbWFnZXMvaWNvbnMvaWNvbi05Nng5Ni5wbmdcIixcclxuICAgICAgICAgICAgICBzaXplczogXCI5Nng5NlwiLFxyXG4gICAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBzcmM6IFwiaW1hZ2VzL2ljb25zL2ljb24tMTI4eDEyOC5wbmdcIixcclxuICAgICAgICAgICAgICBzaXplczogXCIxMjh4MTI4XCIsXHJcbiAgICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHNyYzogXCJpbWFnZXMvaWNvbnMvaWNvbi0xNDR4MTQ0LnBuZ1wiLFxyXG4gICAgICAgICAgICAgIHNpemVzOiBcIjE0NHgxNDRcIixcclxuICAgICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgc3JjOiBcImltYWdlcy9pY29ucy9pY29uLTE1MngxNTIucG5nXCIsXHJcbiAgICAgICAgICAgICAgc2l6ZXM6IFwiMTUyeDE1MlwiLFxyXG4gICAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBzcmM6IFwiaW1hZ2VzL2ljb25zL2ljb24tMTkyeDE5Mi5wbmdcIixcclxuICAgICAgICAgICAgICBzaXplczogXCIxOTJ4MTkyXCIsXHJcbiAgICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHNyYzogXCJpbWFnZXMvaWNvbnMvaWNvbi0zODR4Mzg0LnBuZ1wiLFxyXG4gICAgICAgICAgICAgIHNpemVzOiBcIjM4NHgzODRcIixcclxuICAgICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgc3JjOiBcImltYWdlcy9pY29ucy9pY29uLTUxMng1MTIucG5nXCIsXHJcbiAgICAgICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxyXG4gICAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXHJcbiAgICAgICAgICAgICAgcHVycG9zZTogXCJhbnlcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHNyYzogXCJpbWFnZXMvaWNvbnMvaWNvbi01MTJ4NTEyLnBuZ1wiLFxyXG4gICAgICAgICAgICAgIHNpemVzOiBcIjUxMng1MTJcIixcclxuICAgICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgICAgICAgICAgIHB1cnBvc2U6IFwibWFza2FibGVcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICBwcmVmZXJfcmVsYXRlZF9hcHBsaWNhdGlvbnM6IGZhbHNlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pLFxyXG4gICAgXSxcclxuICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICAvKiBvcHRpb25zICovXHJcbiAgICAgIGR0czogdHJ1ZSxcclxuICAgICAgZXNsaW50cmM6IHtcclxuICAgICAgICBlbmFibGVkOiB0cnVlLCAvLyA8LS0gdGhpc1xyXG4gICAgICB9LFxyXG4gICAgICBpbmNsdWRlOiBbXHJcbiAgICAgICAgL1xcLlt0al1zeD8kLywgLy8gLnRzLCAudHN4LCAuanMsIC5qc3hcclxuICAgICAgICAvXFwudnVlJC8sXHJcbiAgICAgICAgL1xcLnZ1ZVxcP3Z1ZS8sIC8vIC52dWVcclxuICAgICAgICAvXFwubWQkLywgLy8gLm1kXHJcbiAgICAgIF0sXHJcbiAgICAgIGltcG9ydHM6IFtcclxuICAgICAgICAvLyBwcmVzZXRzXHJcbiAgICAgICAgXCJ2dWVcIixcclxuICAgICAgICBcInZ1ZS1yb3V0ZXJcIixcclxuICAgICAgICBcInBpbmlhXCIsXHJcbiAgICAgIF0sXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuL3NyY1wiLCBpbXBvcnQubWV0YS51cmwpKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBkZWZpbmU6IHtcclxuICAgIFwicHJvY2Vzcy5lbnZcIjogcHJvY2Vzcy5lbnYsXHJcbiAgfSxcclxuICBiYXNlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIgPyBcIi9lcnAtbXNhci9cIiA6IFwiL1wiLFxyXG4gIHNlcnZlcjoge1xyXG4gICAgd2F0Y2g6IHtcclxuICAgICAgdXNlUG9sbGluZzogdHJ1ZVxyXG4gICAgfSxcclxuICAgIHBvcnQ6IDE5OTBcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzUixTQUFTLGVBQWUsV0FBVztBQUV6VCxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsZUFBZTtBQUN4QixPQUFPLGdCQUFnQjtBQVJxSixJQUFNLDJDQUEyQztBQVU3TixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsTUFDRixRQUFRO0FBQUEsUUFDTixhQUFhO0FBQUEsTUFDZjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0Q7QUFBQSxJQUNBLE9BQU87QUFBQSxJQUNQLFdBQVc7QUFBQSxNQUNULFdBQVcsQ0FBQyxhQUFhLENBQUM7QUFBQSxNQUMxQixLQUFLO0FBQUEsSUFDUCxDQUFDO0FBQUEsSUFDRDtBQUFBLE1BQ0UsUUFBUTtBQUFBLFFBQ04sZUFBZTtBQUFBLFVBQ2I7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFFBQ0Y7QUFBQSxRQUNBLGNBQWM7QUFBQSxRQUNkLGdCQUFnQjtBQUFBLFFBQ2hCLFNBQVM7QUFBQSxVQUNQLGNBQWMsQ0FBQyxnQ0FBZ0M7QUFBQSxRQUNqRDtBQUFBLFFBQ0EsVUFBVTtBQUFBLFVBQ1IsTUFBTTtBQUFBLFVBQ04sWUFBWTtBQUFBLFVBQ1osYUFBYTtBQUFBLFVBQ2Isa0JBQWtCO0FBQUEsVUFDbEIsU0FBUztBQUFBLFVBQ1QsYUFBYTtBQUFBLFVBQ2IsT0FBTztBQUFBLFVBQ1AsV0FBVztBQUFBLFVBQ1gsc0JBQXNCO0FBQUEsWUFDcEI7QUFBQSxjQUNFLFVBQVU7QUFBQSxjQUNWLEtBQUs7QUFBQSxZQUNQO0FBQUEsVUFDRjtBQUFBLFVBQ0EsT0FBTztBQUFBLFlBQ0w7QUFBQSxjQUNFLEtBQUs7QUFBQSxjQUNMLE9BQU87QUFBQSxjQUNQLE1BQU07QUFBQSxZQUNSO0FBQUEsWUFDQTtBQUFBLGNBQ0UsS0FBSztBQUFBLGNBQ0wsT0FBTztBQUFBLGNBQ1AsTUFBTTtBQUFBLFlBQ1I7QUFBQSxZQUNBO0FBQUEsY0FDRSxLQUFLO0FBQUEsY0FDTCxPQUFPO0FBQUEsY0FDUCxNQUFNO0FBQUEsWUFDUjtBQUFBLFlBQ0E7QUFBQSxjQUNFLEtBQUs7QUFBQSxjQUNMLE9BQU87QUFBQSxjQUNQLE1BQU07QUFBQSxZQUNSO0FBQUEsWUFDQTtBQUFBLGNBQ0UsS0FBSztBQUFBLGNBQ0wsT0FBTztBQUFBLGNBQ1AsTUFBTTtBQUFBLFlBQ1I7QUFBQSxZQUNBO0FBQUEsY0FDRSxLQUFLO0FBQUEsY0FDTCxPQUFPO0FBQUEsY0FDUCxNQUFNO0FBQUEsWUFDUjtBQUFBLFlBQ0E7QUFBQSxjQUNFLEtBQUs7QUFBQSxjQUNMLE9BQU87QUFBQSxjQUNQLE1BQU07QUFBQSxZQUNSO0FBQUEsWUFDQTtBQUFBLGNBQ0UsS0FBSztBQUFBLGNBQ0wsT0FBTztBQUFBLGNBQ1AsTUFBTTtBQUFBLGNBQ04sU0FBUztBQUFBLFlBQ1g7QUFBQSxZQUNBO0FBQUEsY0FDRSxLQUFLO0FBQUEsY0FDTCxPQUFPO0FBQUEsY0FDUCxNQUFNO0FBQUEsY0FDTixTQUFTO0FBQUEsWUFDWDtBQUFBLFVBQ0Y7QUFBQSxVQUNBLDZCQUE2QjtBQUFBLFFBQy9CO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsV0FBVztBQUFBO0FBQUEsTUFFVCxLQUFLO0FBQUEsTUFDTCxVQUFVO0FBQUEsUUFDUixTQUFTO0FBQUE7QUFBQSxNQUNYO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUDtBQUFBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVM7QUFBQTtBQUFBLFFBRVA7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sZUFBZSxRQUFRO0FBQUEsRUFDekI7QUFBQSxFQUNBLE1BQU0sUUFBUSxJQUFJLGFBQWEsZUFBZSxlQUFlO0FBQUEsRUFDN0QsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsWUFBWTtBQUFBLElBQ2Q7QUFBQSxJQUNBLE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
