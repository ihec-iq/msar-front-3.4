import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/employees/:search?",
    name: "Employee.Index",
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
    name: "Employee.Add",
    component: () => import("./view/EmployeeView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/employee/:id",
    name: "Employee.Update",
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
