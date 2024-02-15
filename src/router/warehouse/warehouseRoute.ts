import authMiddleware from "../middleware/authMiddleware";

export default [
  {
    path: "/storeIndex",
    name: "storeIndex",
    component: () => import("@/views/Warehouse/StoreIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/ItemHistory/:id",
    name: "ItemHistory",
    component: () => import("@/views/Warehouse/StoreItemHistoryView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
