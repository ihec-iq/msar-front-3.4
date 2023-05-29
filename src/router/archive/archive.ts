import archiveIndex from "@/views/Archive/ArchiveIndexView.vue";
import archiveAdd from "@/views/Archive/ArchiveView.vue";
import archiveUpdate from "@/views/Archive/ArchiveView.vue";
import authMiddleware from "../middleware/authMiddleware";

export default [
  {
    path: "/archive/all",
    name: "archiveIndex",
    component: archiveIndex,
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/archive",
    name: "archiveAdd",
    component: archiveAdd,
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/archive/:id",
    name: "archiveUpdate",
    component: archiveUpdate,
    meta: {
      middleware: [authMiddleware],
    },
  },
];
