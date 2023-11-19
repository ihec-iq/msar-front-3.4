import { createRouter, createWebHistory } from "vue-router";
import notification from "@/views/NotificationView.vue";
import archive from "./archives/archiveRoute";
//#region for split routes in many files
// import reports from "./reports/index";
// import role from "./role/index";
//#endregion
//#region Middleware
import authMiddleware from "./middleware/authMiddleware";
import item from "./item/itemRoute";
import inputVoucher from "./voucher/inputVoucherRoute";
import outputVoucher from "./voucher/outputVoucherRoute";
import corruptedVoucher from "./voucher/corruptedVoucherRoute";
import directVoucher from "./voucher/directVoucherRoute";
import itemCategory from "./item/itemCategoryRoute";
import vacation from "./vacation/vacationRoute";
import userRoute from "./user/userRoute";
import roleRoute from "./role/roleRoute";
import store from "./store/storeRoute";
import DefaultLayout from "@/views/layouts/MainView.vue";

import employee from "./user/employeeRoute";

//#endregion

const router = createRouter({
  history: createWebHistory(
    process.env.NODE_ENV === "production" ? "/10/" : "/"
  ), //import.meta.env.BASE_URL
  linkExactActiveClass: "linkExactActiveClass",
  routes: [
    {
      path: "/login",
      children: [
        {
          name: "login",
          path: "",
          component: () => import("@/views/auth/LoginView.vue"),
        },
      ],
    },
    {
      path: "/",
      name: "main",
      component: DefaultLayout,
      children: [
        ...archive,
        ...item,
        ...itemCategory,
        ...inputVoucher,
        ...outputVoucher,
        ...corruptedVoucher,
        ...directVoucher,
        ...vacation,
        ...userRoute,
        ...roleRoute,
        ...store,
        ...employee,
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
          component: () => import("@/views/UnauthorizedView.vue"),
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
      ],
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
