import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

export default async function permissionMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // Perform your permission checks here
  const hasPermission = true; // Replace with your permission check
  if (!hasPermission) {
    // If no permission, redirect to a permission denied page
    next("/403");
    return;
  } else {
    // If permission granted, proceed to the route
    next();
    return;
  }
}
