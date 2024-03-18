import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/items/:search?",
    name: "itemIndex",
    component: () => import("./view/ItemIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/item",
    name: "itemAdd",
    component: () => import("./view/ItemView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/item/:id",
    name: "itemUpdate",
    component: () => import("./view/ItemView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
