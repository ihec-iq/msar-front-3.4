// import auth from "@/router/middleware/auth";
import archiveIndex from "@/views/Archive/ArchiveIndexView.vue";
import archiveAdd from "@/views/Archive/ArchiveView.vue";
import archiveUpdate from "@/views/Archive/ArchiveView.vue";
import auth from "../middleware/auth";

export default [
  {
    path: "/archive/all",
    name: "archiveIndex",
    component: archiveIndex,
    meta: {
      middleware: [auth],
    },
  },
  {
    path: "/archive",
    name: "archiveAdd",
    component: archiveAdd,
    meta: {
      middleware: [auth],
    },
  },
  {
    path: "/archive/:id",
    name: "archiveUpdate",
    component: archiveUpdate,
    meta: {
      middleware: [auth],
    },
  },
];
