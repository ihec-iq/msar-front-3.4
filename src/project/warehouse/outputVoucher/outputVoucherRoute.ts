import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/outputVouchers/:search?",
    name: "outputVoucherIndex",
    component: () => import("@/project/warehouse/outputVoucher/view/OutputVoucherIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/outputVoucher",
    name: "outputVoucherAdd",
    component: () => import("@/project/warehouse/outputVoucher/view/OutputVoucherView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/outputVoucher/:id",
    name: "outputVoucherUpdate",
    component: () => import("@/project/warehouse/outputVoucher/view/OutputVoucherView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
