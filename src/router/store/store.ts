import authMiddleware from "../middleware/authMiddleware";

export default [
  {
    path: "/storeIndex",
    name: "storeIndex",
    component: () => import("@/views/store/StoreIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/storeItemHistory/:id",
    name: "storeItemHistory",
    component: () => import("@/views/store/StoreItemHistoryView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
