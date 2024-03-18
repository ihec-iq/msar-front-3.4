import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/corruptedVouchers/:search?",
    name: "corruptedVoucherIndex",
    component: () =>
      import("@/project/warehouse/corruptedVoucher/view/CorruptedVoucherIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/corruptedVoucher",
    name: "corruptedVoucherAdd",
    component: () =>
      import("@/project/warehouse/corruptedVoucher/view/CorruptedVoucherView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/corruptedVoucher/:id",
    name: "corruptedVoucherUpdate",
    component: () =>
      import("@/project/warehouse/corruptedVoucher/view/CorruptedVoucherView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
