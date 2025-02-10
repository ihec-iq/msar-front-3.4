import authMiddleware from "@/router/middleware/authMiddleware";
import EmployeeTypeRoute from "./setting/employeeType/EmployeeTypeRoute";
import EmployeeCenterRoute from "./setting/employeeCenter/EmployeeCenterRoute";
import EmployeePositionRoute from "./setting/employeePosition/EmployeePositionRoute";

export default [
  ...EmployeeTypeRoute,
  ...EmployeeCenterRoute,
  ...EmployeePositionRoute,
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
    path: "/employee/bonus/:id",
    name: "Employee.Update.Info.Bonus",
    component: () => import("./view/EmployeeBonusInfoView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },{
    path: "/employeeSettingPortal",
    name: "employeeSettingPortal",
    component: () => import("./view/EmployeeSettingPortalView.vue"),
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
