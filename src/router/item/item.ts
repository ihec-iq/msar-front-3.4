import authMiddleware from "../middleware/authMiddleware";

export default [
  {
    path: "/items/:search?",
    name: "itemIndex",
    component: () => import("@/views/Item/ItemIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/item",
    name: "itemAdd",
    component: () => import("@/views/Item/ItemView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/item/:id",
    name: "itemUpdate",
    component: () => import("@/views/Item/ItemView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
