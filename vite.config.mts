import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig(({ mode }) => {
  // نحمل فقط المفاتيح التي تبدأ بـ VITE_ (لن تُسرّب غيرها)
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

    // ✅ لا تسرّب process.env — نُعرّف NODE_ENV فقط للمكتبات التي تحتاجه
    // (esbuild يعطي أولوية للتطابق الأطول، لذا NODE_ENV يتقدّم على process.env)
    define: {
      "process.env": {}, // يمنع كسر مكتبات تفحص وجوده
      "process.env.NODE_ENV": JSON.stringify(mode),
    },

    // ✅ استخدم متغيّر عام VITE_BASE أو افتراضي
    base: mode === "production" ? (env.VITE_BASE ?? "/erp-msar/") : "/",

    // ✅ لا تمرّر بورت للعميل؛ استعمل VITE_PORT لو حاب تغيّره محليًا
    server: {
      watch: { usePolling: true },
      // port: Number(env.VITE_PORT ?? 1991),
    },

    // يضمن أن Vite يمرّر فقط VITE_* للمتصفح
    envPrefix: ["VITE_"],
  };
});