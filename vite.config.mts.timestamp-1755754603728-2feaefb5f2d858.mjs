// vite.config.mts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///D:/xampp/htdocs/msar-front-3.4/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/xampp/htdocs/msar-front-3.4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///D:/xampp/htdocs/msar-front-3.4/node_modules/unplugin-vue-components/dist/vite.js";
import { VantResolver } from "file:///D:/xampp/htdocs/msar-front-3.4/node_modules/unplugin-vue-components/dist/resolvers.js";
import AutoImport from "file:///D:/xampp/htdocs/msar-front-3.4/node_modules/unplugin-auto-import/dist/vite.js";
var __vite_injected_original_import_meta_url = "file:///D:/xampp/htdocs/msar-front-3.4/vite.config.mts";
var vite_config_default = defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true
      }
    }),
    Components({
      resolvers: [VantResolver()],
      dts: true
    }),
    AutoImport({
      dts: true,
      eslintrc: {
        enabled: true
      },
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: ["vue", "vue-router", "pinia"]
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
  //base: process.env.NODE_ENV === "production" ? "/erp-msar/" : "/",
  //base: process.env.NODE_ENV === "production" ? "/" : "/",
  server: {
    watch: {
      usePolling: true
    }
    //port: 1990
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxceGFtcHBcXFxcaHRkb2NzXFxcXG1zYXItZnJvbnQtMy40XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFx4YW1wcFxcXFxodGRvY3NcXFxcbXNhci1mcm9udC0zLjRcXFxcdml0ZS5jb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi94YW1wcC9odGRvY3MvbXNhci1mcm9udC0zLjQvdml0ZS5jb25maWcubXRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcIm5vZGU6dXJsXCI7XHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGVcIjtcclxuaW1wb3J0IHsgVmFudFJlc29sdmVyIH0gZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVyc1wiO1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoe1xyXG4gICAgICBzY3JpcHQ6IHtcclxuICAgICAgICBkZWZpbmVNb2RlbDogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gICAgQ29tcG9uZW50cyh7XHJcbiAgICAgIHJlc29sdmVyczogW1ZhbnRSZXNvbHZlcigpXSxcclxuICAgICAgZHRzOiB0cnVlLFxyXG4gICAgfSksXHJcbiAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgZHRzOiB0cnVlLFxyXG4gICAgICBlc2xpbnRyYzoge1xyXG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICAgIGluY2x1ZGU6IFsvXFwuW3RqXXN4PyQvLCAvXFwudnVlJC8sIC9cXC52dWVcXD92dWUvLCAvXFwubWQkL10sXHJcbiAgICAgIGltcG9ydHM6IFtcInZ1ZVwiLCBcInZ1ZS1yb3V0ZXJcIiwgXCJwaW5pYVwiXSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IGZpbGVVUkxUb1BhdGgobmV3IFVSTChcIi4vc3JjXCIsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGRlZmluZToge1xyXG4gICAgXCJwcm9jZXNzLmVudlwiOiBwcm9jZXNzLmVudixcclxuICB9LFxyXG4gIC8vYmFzZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwicHJvZHVjdGlvblwiID8gXCIvZXJwLW1zYXIvXCIgOiBcIi9cIixcclxuICAvL2Jhc2U6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IFwiL1wiIDogXCIvXCIsXHJcbiAgc2VydmVyOiB7XHJcbiAgICB3YXRjaDoge1xyXG4gICAgICB1c2VQb2xsaW5nOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIC8vcG9ydDogMTk5MFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNSLFNBQVMsZUFBZSxXQUFXO0FBRXpULFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLGdCQUFnQjtBQU5xSixJQUFNLDJDQUEyQztBQVE3TixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsTUFDRixRQUFRO0FBQUEsUUFDTixhQUFhO0FBQUEsTUFDZjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsV0FBVyxDQUFDLGFBQWEsQ0FBQztBQUFBLE1BQzFCLEtBQUs7QUFBQSxJQUNQLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULEtBQUs7QUFBQSxNQUNMLFVBQVU7QUFBQSxRQUNSLFNBQVM7QUFBQSxNQUNYO0FBQUEsTUFDQSxTQUFTLENBQUMsY0FBYyxVQUFVLGNBQWMsT0FBTztBQUFBLE1BQ3ZELFNBQVMsQ0FBQyxPQUFPLGNBQWMsT0FBTztBQUFBLElBQ3hDLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sZUFBZSxRQUFRO0FBQUEsRUFDekI7QUFBQTtBQUFBO0FBQUEsRUFHQSxRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxZQUFZO0FBQUEsSUFDZDtBQUFBO0FBQUEsRUFFRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
