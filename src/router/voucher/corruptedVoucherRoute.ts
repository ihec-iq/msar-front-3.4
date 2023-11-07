import authMiddleware from "../middleware/authMiddleware";

export default [
  {
    path: "/corruptedVouchers/:search?",
    name: "corruptedVoucherIndex",
    component: () =>
      import("@/views/CorruptedVoucher/CorruptedVoucherIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/corruptedVoucher",
    name: "corruptedVoucherAdd",
    component: () =>
      import("@/views/CorruptedVoucher/CorruptedVoucherView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/corruptedVoucher/:id",
    name: "corruptedVoucherUpdate",
    component: () =>
      import("@/views/CorruptedVoucher/CorruptedVoucherView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
