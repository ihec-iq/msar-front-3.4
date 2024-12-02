import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/archives/:search?",
    name: "archiveIndex",
    component: () => import("@/project/archive/view/ArchiveIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/archivesPortal",
    name: "archivePortal",
    component: () => import("@/project/archive/view/ArchivePortalView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/archive",
    name: "archiveAdd",
    component: () => import("@/project/archive/view/ArchiveView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/archive/:id",
    name: "archiveUpdate",
    component: () => import("@/project/archive/view/ArchiveView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/archiveTypes",
    name: "archiveTypeIndex",
    component: () =>
      import("@/project/archive/archiveType/view/archiveTypeIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/archiveType/:id",
    name: "archiveTypeUpdate",
    component: () => import("@/project/archive/archiveType/view/archiveTypeView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/archiveType",
    name: "archiveTypeAdd",
    component: () => import("@/project/archive/archiveType/view/archiveTypeView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
