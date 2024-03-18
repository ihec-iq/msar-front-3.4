import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/directVouchers/:search?",
    name: "directVoucherIndex",
    component: () => import("@/project/warehouse/directVoucher/view/DirectVoucherIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/directVoucher",
    name: "directVoucherAdd",
    component: () => import("@/project/warehouse/directVoucher/view/DirectVoucherView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/directVoucher/:id",
    name: "directVoucherUpdate",
    component: () => import("@/project/warehouse/directVoucher/view/DirectVoucherView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
