import authMiddleware from "@/router/middleware/authMiddleware";
 export default [
  {
    path: "/settingPortal",
     name: "settingPortal",
    component: () => import("./view/SettingPortalView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/setting",
    name: "settingIndex",
    component: () => import("./view/SettingIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/setting/add",
    name: "settingAdd",
    component: () => import("./view/SettingView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/setting/:id/update",
    name: "settingUpdate",
    component: () => import("./view/SettingView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/setting/:id/show",
    name: "settingShow",
    component: () => import("./view/SettingView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
