import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/itemCategories/:search?",
    name: "itemCategoryIndex",
    component: () => import("./view/ItemCategoryIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/itemCategory",
    name: "itemCategoryAdd",
    component: () => import("./view/ItemCategoryView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/itemCategory/:id",
    name: "itemCategoryUpdate",
    component: () => import("./view/ItemCategoryView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
