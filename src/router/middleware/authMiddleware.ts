import { getSecureToken } from "@/stores/authStore";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import Api from "@/api/apiConfig";
export default async function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // Perform your authentication logic here
  Api.defaults.headers.common["Authorization"] =
    "Bearer " + (await getSecureToken());
  next();
  return;
}
