import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/retrievalVouchers/:search?",
    name: "retrievalVoucherIndex",
    component: () =>
      import("@/project/warehouse/retrievalVoucher/view/RetrievalVoucherIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/retrievalVoucher",
    name: "retrievalVoucherAdd",
    component: () =>
      import("@/project/warehouse/retrievalVoucher/view/RetrievalVoucherView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/retrievalVoucher/:id",
    name: "retrievalVoucherUpdate",
    component: () =>
      import("@/project/warehouse/retrievalVoucher/view/RetrievalVoucherView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
