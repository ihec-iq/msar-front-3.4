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
    path: "/vacation/report/:id",
    name: "vacationReportEmployee",
    component: () => import("@/views/Vacation/VacationReportEmployee.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/times/:search?",
    name: "vacationTimeIndex",
    component: () =>
      import("@/views/Vacation/VacationTime/VacationTimeIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/time",
    name: "vacationTimeAdd",
    component: () =>
      import("@/views/Vacation/VacationTime/VacationTimeView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/time/:id",
    name: "vacationTimeUpdate",
    component: () =>
      import("@/views/Vacation/VacationTime/VacationTimeView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/dailies/:search?",
    name: "vacationDailyIndex",
    component: () =>
      import("@/views/Vacation/VacationDaily/VacationDailyIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/daily",
    name: "vacationDailyAdd",
    component: () =>
      import("@/views/Vacation/VacationDaily/VacationDailyView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/daily/:id",
    name: "vacationDailyUpdate",
    component: () =>
      import("@/views/Vacation/VacationDaily/VacationDailyView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/sicks/:search?",
    name: "vacationSickIndex",
    component: () =>
      import("@/views/Vacation/VacationSick/VacationSickIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/sick",
    name: "vacationSickAdd",
    component: () =>
      import("@/views/Vacation/VacationSick/VacationSickView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/sick/:id",
    name: "vacationSickUpdate",
    component: () =>
      import("@/views/Vacation/VacationSick/VacationSickView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
