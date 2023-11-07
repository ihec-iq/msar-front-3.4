import authMiddleware from "../middleware/authMiddleware";

export default [
  {
    path: "/setting/user/:search?",
    name: "userIndex",
    component: () => import("@/views/Employee/EmployeeIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/setting/user",
    name: "userAdd",
    component: () => import("@/views/Employee/EmployeeView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/setting/user/:id",
    name: "userUpdate",
    component: () => import("@/views/Employee/EmployeeView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/setting/user/:id/history",
    name: "userHistory",
    component: () => import("@/views/Employee/EmployeeHistoryView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
