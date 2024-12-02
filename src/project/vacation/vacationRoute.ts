import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/vacationPortal",
    name: "vacationPortal",
    component: () => import("@/project/vacation/view/VacationPortalView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/report/period",
    name: "vacationPeriod",
    component: () => import("@/project/vacation/view/VacationReportPeriodView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/report",
    name: "vacationReport",
    component: () => import("@/project/vacation/view/VacationReportView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/report/:id",
    name: "vacationReportEmployee",
    component: () => import("@/project/vacation/view/VacationReportEmployee.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/times/:search?",
    name: "vacationTimeIndex",
    component: () =>
      import("@/project/vacation/vacationTime/view/VacationTimeIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/time",
    name: "vacationTimeAdd",
    component: () =>
      import("@/project/vacation/vacationTime/view/VacationTimeView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/time/:id",
    name: "vacationTimeUpdate",
    component: () =>
      import("@/project/vacation/vacationTime/view/VacationTimeView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/dailies/:search?",
    name: "vacationDailyIndex",
    component: () =>
      import("@/project/vacation/vacationDaily/view/VacationDailyIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/daily",
    name: "vacationDailyAdd",
    component: () =>
      import("@/project/vacation/vacationDaily/view/VacationDailyView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/daily/:id",
    name: "vacationDailyUpdate",
    component: () =>
      import("@/project/vacation/vacationDaily/view/VacationDailyView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/sicks/:search?",
    name: "vacationSickIndex",
    component: () =>
      import("@/project/vacation/vacationSick/view/VacationSickIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/sick",
    name: "vacationSickAdd",
    component: () =>
      import("@/project/vacation/vacationSick/view/VacationSickView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/vacation/sick/:id",
    name: "vacationSickUpdate",
    component: () =>
      import("@/project/vacation/vacationSick/view/VacationSickView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
