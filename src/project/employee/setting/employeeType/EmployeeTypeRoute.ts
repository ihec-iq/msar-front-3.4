import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/EmployeeTypes/:search?",
    name: "EmployeeTypeIndex",
    component: () => import("./view/EmployeeTypeIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/EmployeeType",
    name: "EmployeeTypeAdd",
    component: () => import("./view/EmployeeTypeView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/EmployeeType/:id",
    name: "EmployeeTypeUpdate",
    component: () => import("./view/EmployeeTypeView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
