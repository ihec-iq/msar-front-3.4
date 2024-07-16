import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/hr/:search?",
    name: "hrDocumentIndex",
    component: () => import("@/project/hr/view/HrDocumentIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/hrPortal",
    name: "hrPortal",
    component: () => import("@/project/hr/view/HrPortalView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/hrDocument",
    name: "hrDocumentAdd",
    component: () => import("@/project/hr/view/HrDocumentView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/hrDocument/:id",
    name: "hrDocumentUpdate",
    component: () => import("@/project/hr/view/HrDocumentView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
   
];
