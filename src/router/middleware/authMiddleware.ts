import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

export default async function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // Perform your authentication logic here
  const isAuthenticated =
    localStorage.getItem("token") != "" &&
    localStorage.getItem("token") != undefined
      ? true
      : false; // Replace with your authentication check
  if (!isAuthenticated) {
    // If not authenticated, redirect to login
    next("/login");
    return;
  } else {
    // If authenticated, proceed to the next middleware
    next();
    return;
  }
}
