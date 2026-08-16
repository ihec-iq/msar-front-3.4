import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/inputVoucherStates/:search?",
    name: "inputVoucherStateIndex",
    component: () => import("./view/InputVoucherStateIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/inputVoucherState",
    name: "inputVoucherStateAdd",
    component: () => import("./view/InputVoucherStateView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/inputVoucherState/:id",
    name: "inputVoucherStateUpdate",
    component: () => import("./view/InputVoucherStateView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
