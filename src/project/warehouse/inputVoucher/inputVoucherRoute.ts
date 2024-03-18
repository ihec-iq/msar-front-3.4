import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/inputVouchers/:search?",
    name: "inputVoucherIndex",
    component: () => import("@/project/warehouse/inputVoucher/view/InputVoucherIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/inputVoucher",
    name: "inputVoucherAdd",
    component: () => import("@/project/warehouse/inputVoucher/view/InputVoucherView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/inputVoucher/:id",
    name: "inputVoucherUpdate",
    component: () => import("@/project/warehouse/inputVoucher/view/InputVoucherView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
