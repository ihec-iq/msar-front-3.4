import authMiddleware from "../middleware/authMiddleware";

export default [
  {
    path: "/vacation/daily/:search?",
    name: "vacationDailyIndex",
    component: () => import("@/views/Archive/ArchiveIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/daily",
    name: "vacationDailyAdd",
    component: () => import("@/views/Archive/ArchiveView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/daily/:id",
    name: "vacationDailyUpdate",
    component: () => import("@/views/Archive/ArchiveView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
