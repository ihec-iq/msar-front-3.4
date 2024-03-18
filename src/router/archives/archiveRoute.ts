import authMiddleware from "../middleware/authMiddleware";

export default [
  {
    path: "/archives/:search?",
    name: "archiveIndex",
    component: () => import("@/views/Archive/ArchiveIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/archive",
    name: "archiveAdd",
    component: () => import("@/views/Archive/ArchiveView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/archive/:id",
    name: "archiveUpdate",
    component: () => import("@/views/Archive/ArchiveView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/archiveTypes",
    name: "archiveTypeIndex",
    component: () =>
      import("@/views/Archive/archiveType/archiveTypeIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/archiveType/:id",
    name: "archiveTypeUpdate",
    component: () => import("@/views/Archive/archiveType/archiveTypeView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/archiveType",
    name: "archiveTypeAdd",
    component: () => import("@/views/Archive/archiveType/archiveTypeView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
