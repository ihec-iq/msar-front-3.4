import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/stocks/:search?",
    name: "stockIndex",
    component: () => import("./view/StockIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/stock",
    name: "stockAdd",
    component: () => import("./view/StockView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/stock/:id",
    name: "stockUpdate",
    component: () => import("./view/StockView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
