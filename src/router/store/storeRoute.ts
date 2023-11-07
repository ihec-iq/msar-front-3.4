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
    path: "/ItemHistory/:id",
    name: "ItemHistory",
    component: () => import("@/views/store/StoreItemHistoryView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
