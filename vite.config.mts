import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";

// Vite 8 builds with Rolldown, which takes chunk groups as regex tests rather
// than the old object form of `manualChunks`.
const chunkGroups = {
  "vue-vendor": ["vue", "vue-router", "pinia"],
  "ui-vendor": [
    "@headlessui/vue",
    "@heroicons/vue",
    "sweetalert2",
    "vue-sonner",
  ],
  "form-vendor": ["vee-validate", "@vuelidate/core", "yup"],
  "table-vendor": ["@tanstack/vue-table", "laravel-vue-pagination"],
  utils: ["axios", "dayjs", "crypto-js"],
};

// Anchor on the package directory so "vue" does not also swallow "vue-select".
const packagePattern = (pkg: string) =>
  pkg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\//g, "[\\\\/]");

const groups = Object.entries(chunkGroups).map(([name, packages]) => ({
  name,
  test: new RegExp(
    `[\\\\/]node_modules[\\\\/](${packages.map(packagePattern).join("|")})[\\\\/]`
  ),
}));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [
      vue(),
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
      // Tailwind v4's floor (Safari 16.4 / Chrome 111 / Firefox 128);
      // kept in sync with the browserslist field in package.json.
      target: ["chrome111", "edge111", "firefox128", "safari16.4"],
      cssTarget: ["chrome111", "edge111", "firefox128", "safari16.4"],
      rollupOptions: {
        output: {
          advancedChunks: { groups },
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
