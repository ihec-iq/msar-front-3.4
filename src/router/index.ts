import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import notification from "@/views/NotificationView.vue";
import archive from "./archive/archive";
//#region for split routes in many files
import NProgress from "nprogress";
// import reports from "./reports/index";
// import role from "./role/index";
//#endregion
//#region Middleware
import authMiddleware from "./middleware/authMiddleware";
import item from "./item/item";
import inputVoucher from "./voucher/inputVoucher";
import outputVoucher from "./voucher/outputVoucher";
import itemCategory from "./item/itemCategory";
import store from "./store/store";
import blank from "@/views/layouts/BlankView.vue";

//#endregion

const router = createRouter({
  history: createWebHistory(
    process.env.NODE_ENV === "production" ? "/10/" : "/"
  ), //import.meta.env.BASE_URL
  linkExactActiveClass: "linkExactActiveClass",
  routes: [
    ...archive,
    ...item,
    ...itemCategory,
    ...inputVoucher,
    ...outputVoucher,
    ...store,
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/auth/LoginView.vue"),
      meta: {
        layout: blank,
      },
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("@/views/HomeView.vue"),
      meta: {
        middleware: [authMiddleware],
      },
    },
    {
      path: "/test",
      name: "Test",
      component: () => import("@/views/TestView.vue"),
      meta: {
        middleware: [authMiddleware],
      },
    },
    {
      path: "/config",
      name: "Config",
      component: () => import("@/views/ConnectionSettingView.vue"),
    },
    {
      path: "/",
      name: "start",
      component: () => import("@/views/AboutView.vue"),
    },
    {
      path: "/unauthorized",
      name: "Unauthorized",
      component: () => import("@/views/Unauthorized.vue"),
      meta: {
        middleware: [authMiddleware],
      },
    },
    {
      path: "/notification",
      name: "notification",
      component: notification,
      meta: {
        middleware: [authMiddleware],
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/404.vue"),
      meta: {
        middleware: [authMiddleware],
      },
    },
  ],
});
router.beforeResolve(async (to, from, next) => {
  const middlewares: unknown = to.meta.middleware;
  if (middlewares) {
    // If middlewares are defined for the route
    for (const middleware of middlewares as Function[]) {
      await middleware(to, from, next);
    }
  }
  next();
});
export default router;
