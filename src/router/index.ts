import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from "vue-router";
import HomeView from "@/views/HomeView.vue";
import start from "@/views/AboutView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import _404 from "@/views/404.vue";
import Unauthorized from "@/views/Unauthorized.vue";
// import featureIndex from "@/views/user/";
// import completed from "@/views/user/CompletedIndexView.vue";
// admin
import notification from "@/views/NotificationView.vue";
import archive from "./archive/archive";
//#region for split routes in many files
import NProgress from "nprogress";
// import reports from "./reports/index";
// import role from "./role/index";
//#endregion
//#region Middleware
import auth from "./middleware/auth";
//#endregion

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), //import.meta.env.BASE_URL
  linkExactActiveClass: "linkExactActiveClass",
  routes: [
    ...archive,
    {
      path: "/login",
      name: "Login",
      component: LoginView,
    },
    {
      path: "/",
      name: "start",
      component: start,
    },
    {
      path: "/unauthorized",
      name: "Unauthorized",
      component: Unauthorized,
      meta: {
        middleware: [auth],
      },
    },
    {
      path: "/notification",
      name: "notification",
      component: notification,
      meta: {
        middleware: [auth],
      },
    },
    // {
    //   path: "/completed",
    //   name: "completed",
    //   component: completed,
    //   // meta: {
    //   //   middleware: [auth],
    //   // },
    // },
    // ...role,
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: _404,
      meta: {
        middleware: [auth],
      },
    },
  ],
});
router.beforeEach((to, from) => {
  // ...
  // explicitly return false to cancel the navigation
  console.log("from : " + from.fullPath);
  console.log("to : " + to.fullPath);
});
export default router;
