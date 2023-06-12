import authMiddleware from "../middleware/authMiddleware";

export default [
  {
    path: "/itemCategories/:search?",
    name: "itemCategoryIndex",
    component: () => import("@/views/Item/ItemCategoryIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/itemCategory",
    name: "itemCategoryAdd",
    component: () => import("@/views/Item/ItemCategoryView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/itemCategory/:id",
    name: "itemCategoryUpdate",
    component: () => import("@/views/Item/ItemCategoryView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
