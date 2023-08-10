import authMiddleware from "../middleware/authMiddleware";

export default [
  {
    path: "/inputVouchers/:search?",
    name: "inputVoucherIndex",
    component: () => import("@/views/InputVoucher/InputVoucherIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/inputVoucher",
    name: "inputVoucherAdd",
    component: () => import("@/views/InputVoucher/InputVoucherView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/inputVoucher/:id",
    name: "inputVoucherUpdate",
    component: () => import("@/views/InputVoucher/InputVoucherView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
