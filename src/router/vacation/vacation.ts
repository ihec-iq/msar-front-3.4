import authMiddleware from "../middleware/authMiddleware";

export default [
  {
    path: "/vacation",
    name: "vacationIndex",
    component: () => import("@/views/Vacation/VacationIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/report",
    name: "vacationReport",
    component: () => import("@/views/Vacation/VacationReportView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/time/:search?",
    name: "vacationTimeIndex",
    component: () => import("@/views/VacationTime/VacationTimeIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/time",
    name: "vacationTimeAdd",
    component: () => import("@/views/VacationTime/VacationTimeView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/time/:id",
    name: "vacationTimeUpdate",
    component: () => import("@/views/VacationTime/VacationTimeView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/daily/:search?",
    name: "vacationDailyIndex",
    component: () => import("@/views/VacationDaily/VacationDailyIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/daily",
    name: "vacationDailyAdd",
    component: () => import("@/views/VacationDaily/VacationDailyView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/daily/:id",
    name: "vacationDailyUpdate",
    component: () => import("@/views/VacationDaily/VacationDailyView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/sick/:search?",
    name: "vacationSickIndex",
    component: () => import("@/views/VacationSick/VacationSickIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/sick",
    name: "vacationSickAdd",
    component: () => import("@/views/VacationSick/VacationSickView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/sick/:id",
    name: "vacationSickUpdate",
    component: () => import("@/views/VacationSick/VacationSickView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
