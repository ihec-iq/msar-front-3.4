import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/EmployeeCenters/:search?",  
    name: "EmployeeCenterIndex",
    component: () => import("./view/EmployeeCenterIndexView.vue"),
    meta: {
      middleware: [authMiddleware],   
    },

  },
  {
    path: "/EmployeeCenter",
    name: "EmployeeCenterAdd",
    component: () => import("./view/EmployeeCenterView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/EmployeeCenter/:id",
    name: "EmployeeCenterUpdate",
    component: () => import("./view/EmployeeCenterView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },

];
