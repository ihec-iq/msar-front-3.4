import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/bonus/portal",
    name: "bonusPortal",
    component: () => import("@/project/bonus/view/BonusPortalView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/bonus/index",
    name: "bonusIndex",
    component: () => import("@/project/bonus/view/BonusIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
 
  {
    path: "/bonus/add",
    name: "bonusAdd",
    component: () => import("@/project/bonus/view/BonusView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/bonus/:id",
    name: "bonusUpdate",
    component: () => import("@/project/bonus/view/BonusView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/bonus/employee/:employeeId",
    name: "bonusAddByEmployee",
    component: () => import("@/project/bonus/view/BonusView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
   //#region Bonus Job Title
  {
    path: "/bonusJobTitle/index",
    name: "bonusJobTitleIndex",
    component: () => import("@/project/bonus/view/BonusJobTitleIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },

  {
    path: "/bonusJobTitle/add",
    name: "bonusJobTitleAdd",
    component: () => import("@/project/bonus/view/BonusJobTitleView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/bonusJobTitle/:id",
    name: "bonusJobTitleUpdate",
    component: () => import("@/project/bonus/view/BonusJobTitleView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/bonusSetting",
    name: "bonusSettingView",
    component: () => import("@/project/bonus/view/BonusSettingView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/bonusChecker",
    name: "bonusCheckerView",
    component: () => import("@/project/bonus/view/BonusCheckerView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  //#endregion
];
