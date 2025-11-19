import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [
      vue({
        script: { defineModel: true },
      }),
      Components({
        resolvers: [VantResolver()],
        dts: true,
      }),
      AutoImport({
        dts: true,
        eslintrc: { enabled: true },
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
      "process.env": {},
      "process.env.NODE_ENV": JSON.stringify(mode),
    },

    base: mode === "production" ? (env.VITE_BASE ?? "/") : "/",

    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'ui-vendor': ['@headlessui/vue', '@heroicons/vue', 'sweetalert2', 'vue-sonner'],
            'form-vendor': ['vee-validate', '@vuelidate/core', 'yup'],
            'table-vendor': ['@tanstack/vue-table', 'laravel-vue-pagination'],
            'utils': ['axios', 'dayjs', 'crypto-js'],
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },

    server: {
      watch: { usePolling: true },
    },

    envPrefix: ["VITE_"],
  };
});