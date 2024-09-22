import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/bonuses/index",
    name: "bonusesIndex",
    component: () => import("@/project/bonuses/view/BonusesView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/bonuses/portal",
    name: "bonusesPortal",
    component: () => import("@/project/bonuses/view/BonusesPortalView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/bonuses/add",
    name: "bonusesAdd",
    component: () => import("@/project/bonuses/view/BonusesView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/bonuses/:id",
    name: "bonusesUpdate",
    component: () => import("@/project/bonuses/view/BonusesView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
   
];
