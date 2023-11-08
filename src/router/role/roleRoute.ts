import authMiddleware from "@/router/middleware/authMiddleware";
import role from "@/views/role/RoleIndex.vue";
import permission from "@/views/role/permission/PermissionView.vue";
import roleUpdate from "@/views/role/permission/PermissionView.vue";
import roleShow from "@/views/role/RoleShowView.vue";
export default [
  {
    path: "/setting/role",
    name: "role",
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
