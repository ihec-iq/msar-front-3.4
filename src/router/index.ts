import { createRouter, createWebHistory } from "vue-router";
//#region Middleware
import authMiddleware from "./middleware/authMiddleware";
//#endregion
//#region RouteArray
import archiveRoute from "@/project/archive/archiveRoute";
import itemRoute from "@/project/item/itemRoute";
import itemCategoryRoute from "@/project/item/itemCategoryRoute";
import vacationRoute from "@/project/vacation/vacationRoute";
import userRoute from "@/project/user/userRoute";
import roleRoute from "@/project/role/roleRoute";
import warehouseRoute from "@/project/warehouse/warehouseRoute";
import employeeRoute from "@/project/employee/employeeRoute";
import hrRoute from '@/project/hr/hrRoute';

//#endregion
import DefaultLayout from "@/views/layouts/MainView.vue";
import bonusesRoute from "@/project/bonuses/bonusesRoute";
const router = createRouter({
  history: createWebHistory(
    process.env.NODE_ENV === "production" ? "/10/" : "/",
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
      children: [
        {
          name: "start",
          path: "/",
          component: () => import("@/views/AboutView.vue"),
        },
      ],
    },
    {
      path: "/config",
      name: "Config",
      component: () => import("@/views/ConnectionSettingView.vue"),
    },
    {
      path: "/",
      name: "main",
      component: DefaultLayout,
      children: [
        ...archiveRoute,
        ...itemRoute,
        ...itemCategoryRoute,
        ...vacationRoute,
        ...userRoute,
        ...roleRoute,
        ...warehouseRoute,
        ...employeeRoute,
        ...hrRoute,
        ...bonusesRoute,
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
          path: "/unauthorized",
          name: "Unauthorized",
          component: () => import("@/views/UnauthorizedView.vue"),
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
  return;
});
router.onError(err => {
  console.log('<!-- router error: ' + err.message + ' -->')
})
export default router;
