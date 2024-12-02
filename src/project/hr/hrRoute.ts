import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/hr/index/:employeeId?",
    name: "hrDocumentIndex",
    component: () => import("@/project/hr/view/HrDocumentIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },  
  {
    path: "/hr/portal",
    name: "hrPortal",
    component: () => import("@/project/hr/view/HrPortalView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/hr/document",
    name: "hrDocumentAdd",
    component: () => import("@/project/hr/view/HrDocumentView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/hr/document/:id",
    name: "hrDocumentUpdate",
    component: () => import("@/project/hr/view/HrDocumentView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/hr/document/employee/:employeeId",
    name: "hrDocumentAddByEmployee",
    component: () => import("@/project/hr/view/HrDocumentView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
   
];
