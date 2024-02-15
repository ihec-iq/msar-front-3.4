import authMiddleware from "../middleware/authMiddleware";

export default [
  {
    path: "/outputVouchers/:search?",
    name: "outputVoucherIndex",
    component: () => import("@/views/Warehouse/OutputVoucher/OutputVoucherIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/outputVoucher",
    name: "outputVoucherAdd",
    component: () => import("@/views/Warehouse/OutputVoucher/OutputVoucherView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/outputVoucher/:id",
    name: "outputVoucherUpdate",
    component: () => import("@/views/Warehouse/OutputVoucher/OutputVoucherView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
