import { useLocalStorageStore } from "@/project/core/localStorageStore";
import { EnumNameToken , useAuthStore} from "@/stores/authStore";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
 
export default async function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // Perform your authentication logic here
  const token =await useAuthStore().getSecureToken();
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
