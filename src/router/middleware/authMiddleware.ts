import { getSecureToken } from "@/stores/authStore";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
export default async function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // Perform your authentication logic here
  const token = await getSecureToken();
  if (token == null) {
    next({ name: "login" });
    return;
  }
  next();
  return;
}
