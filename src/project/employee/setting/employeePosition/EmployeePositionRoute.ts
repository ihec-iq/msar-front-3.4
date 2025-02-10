import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/EmployeePositions/:search?",
    name: "EmployeePositionIndex",
    component: () => import("./view/EmployeePositionIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },

  {
    path: "/EmployeePosition",
    name: "EmployeePositionAdd",
    component: () => import("./view/EmployeePositionView.vue"),
    meta: {
      middleware: [authMiddleware],
    },

  },
  {
    path: "/EmployeePosition/:id",
    name: "EmployeePositionUpdate",
    component: () => import("./view/EmployeePositionView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
