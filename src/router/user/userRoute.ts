import authMiddleware from "../middleware/authMiddleware";
export default [
  {
    path: "/core/user",
    name: "userIndex",
    component: () => import("@/views/User/UserIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/core/user/add",
    name: "userAdd",
    component: () => import("@/views/User/UserView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/core/user/:id/update",
    name: "userUpdate",
    component: () => import("@/views/User/UserView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/core/user/:id/show",
    name: "userShow",
    component: () => import("@/views/User/UserView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
