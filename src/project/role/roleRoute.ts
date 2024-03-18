import authMiddleware from "@/router/middleware/authMiddleware";
import role from "./view/RoleIndex.vue";
import permission from "./view/PermissionView.vue";
import roleUpdate from "./view/PermissionView.vue";
import roleShow from "./view/RoleShowView.vue";
export default [
  {
    path: "/setting/role",
    name: "roleIndex",
    component: role,
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/setting/role/permission",
    name: "permission",
    component: permission,
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/setting/role/:id/show",
    name: "roleShow",
    component: roleShow,
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/setting/role/permission",
    name: "permissions",
    component: permission,
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/setting/role/:id/update",
    name: "roleUpdate",
    component: roleUpdate,
    meta: {
      middleware: [authMiddleware],
    },
  },
];
