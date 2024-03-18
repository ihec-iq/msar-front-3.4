import authMiddleware from "@/router/middleware/authMiddleware";
export default [
  {
    path: "/user/portal",
    name: "userPortal",
    component: () => import("./view/UserPortalView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/user/profile",
    name: "Profile",
    component: () => import("./view/ProfileView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/user",
    name: "userIndex",
    component: () => import("./view/UserIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/user/add",
    name: "userAdd",
    component: () => import("./view/UserView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/user/:id/update",
    name: "userUpdate",
    component: () => import("./view/UserView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/user/:id/show",
    name: "userShow",
    component: () => import("./view/UserView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
