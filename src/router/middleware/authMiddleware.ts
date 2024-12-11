import { useLocalStorageStore } from "@/project/core/localStorageStore";
import { EnumNameToken , useAuthStore} from "@/stores/authStore";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
 
export default async function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // Perform your authentication logic here
  await useAuthStore().getSecureToken();
  next();
  return;
}
