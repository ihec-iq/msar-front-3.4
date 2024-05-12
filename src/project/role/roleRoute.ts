import authMiddleware from "@/router/middleware/authMiddleware";
import role from "./view/RoleIndex.vue";
import permission from "./view/RoleView.vue";
import roleUpdate from "./view/RoleView.vue";
import roleShow from "./view/RoleShowView.vue";
export default [
  {
    path: "/setting/role",
    name: "roleIndex",
    component: () => import("./view/RoleIndex.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/setting/role/add",
    name: "roleAdd",
    component: () => import("./view/RoleView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/setting/role/:id/update",
    name: "roleUpdate",
    component: import("./view/RoleView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },

];
