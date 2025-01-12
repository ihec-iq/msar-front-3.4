import { getSecureToken } from "@/stores/authStore";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
export default async function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // Perform your authentication logic here
  await getSecureToken();
  next();
  return;
}
