import authMiddleware from "@/router/middleware/authMiddleware";
import role from "@/views/role/RoleIndex.vue";
import permission from "@/views/role/permission/PermissionView.vue";
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
];
