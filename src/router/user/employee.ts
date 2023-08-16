import authMiddleware from "../middleware/authMiddleware";

export default [
  {
    path: "/employees/:search?",
    name: "employeeIndex",
    component: () => import("@/views/Employee/EmployeeIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/employee",
    name: "employeeAdd",
    component: () => import("@/views/Employee/EmployeeView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/employee/:id",
    name: "employeeUpdate",
    component: () => import("@/views/Employee/EmployeeView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
