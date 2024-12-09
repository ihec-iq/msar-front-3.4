import { useLocalStorageStore } from "@/project/core/localStorageStore";
import { EnumNameToken } from "@/stores/authStore";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
 
export default async function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // Perform your authentication logic here
  const token = useLocalStorageStore().get({
    key: EnumNameToken.tokenENCRYPT,
    withEncrypt: true,
  });
  const isAuthenticated = token != "" && token != undefined ? true : false; // Replace with your authentication check
  if (!isAuthenticated) {
    // If not authenticated, redirect to login
    next("/login");
    return;
  }
  // If authenticated, proceed to the next middleware
  next();
  return;
}
