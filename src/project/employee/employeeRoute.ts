import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/employees/:search?",
    name: "employeeIndex",
    component: () => import("./view/EmployeeIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/employeePortal",
    name: "employeePortal",
    component: () => import("./view/EmployeePortalView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/employee",
    name: "employeeAdd",
    component: () => import("./view/EmployeeView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/employee/:id",
    name: "employeeUpdate",
    component: () => import("./view/EmployeeView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/employee/:id/history",
    name: "employeeHistory",
    component: () => import("./view/EmployeeHistoryView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
