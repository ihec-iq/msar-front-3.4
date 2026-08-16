import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("./view/DashboardView.vue"),
    meta: {
      requiresAuth: true,
      meta: {
        middleware: [authMiddleware],
      },
    },
  },
];
