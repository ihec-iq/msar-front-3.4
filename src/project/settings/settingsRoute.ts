import authMiddleware from "@/router/middleware/authMiddleware";
export default [
  {
    path: "/settinsgPortal",
    name: "settingsPortal",
    component: () => import("./view/SettingsPortalView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  }, 
  {
    path: "/healthCheck",
    name: "healthCheck",
    component: () => import("@/project/settings/view/HealthView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/logs",
    name: "logs",
    component: () => import("@/project/settings/view/LogView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
