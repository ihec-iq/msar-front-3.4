import authMiddleware from "../middleware/authMiddleware";
export default [
  {
    path: "/user/portal",
    name: "userPortal",
    component: () => import("@/views/User/UserPortalView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/user/profile",
    name: "Profile",
    component: () => import("@/views/User/ProfileView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/user",
    name: "userIndex",
    component: () => import("@/views/User/UserIndexViewTest.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/user/add",
    name: "userAdd",
    component: () => import("@/views/User/UserView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/user/:id/update",
    name: "userUpdate",
    component: () => import("@/views/User/UserView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/user/:id/show",
    name: "userShow",
    component: () => import("@/views/User/UserView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
