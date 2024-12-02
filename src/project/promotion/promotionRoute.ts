import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/promotion/portal",
    name: "promotionPortal",
    component: () => import("@/project/promotion/view/PromotionPortalView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/promotion/index",
    name: "promotionIndex",
    component: () => import("@/project/promotion/view/PromotionIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
 
  {
    path: "/promotion/add",
    name: "promotionAdd",
    component: () => import("@/project/promotion/view/PromotionView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/promotion/:id",
    name: "promotionUpdate",
    component: () => import("@/project/promotion/view/PromotionView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/promotion/employee/:employeeId",
    name: "promotionAddByEmployee",
    component: () => import("@/project/promotion/view/PromotionView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
   //#region Promotion Job Title
  {
    path: "/promotionJobTitle/index",
    name: "promotionJobTitleIndex",
    component: () => import("@/project/bonus/view/BonusJobTitleIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/promotionSetting",
    name: "promotionSettingView",
    component: () => import("@/project/promotion/view/PromotionSettingView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/promotionChecker",
    name: "promotionCheckerView",
    component: () => import("@/project/promotion/view/PromotionCheckerView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  //#endregion
];
