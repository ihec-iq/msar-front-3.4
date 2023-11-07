import authMiddleware from "../middleware/authMiddleware";

export default [
  {
    path: "/directVouchers/:search?",
    name: "directVoucherIndex",
    component: () => import("@/views/DirectVoucher/DirectVoucherIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/directVoucher",
    name: "directVoucherAdd",
    component: () => import("@/views/DirectVoucher/DirectVoucherView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/directVoucher/:id",
    name: "directVoucherUpdate",
    component: () => import("@/views/DirectVoucher/DirectVoucherView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
