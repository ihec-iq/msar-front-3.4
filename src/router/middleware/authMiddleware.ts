import { useLocalStorage } from "@/compositions/uselocalStorage";
import { getSecureToken } from "@/stores/authStore";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
export default async function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // Perform your authentication logic
  const token = await getSecureToken();
  if (token == null) {
    useLocalStorage().set({
      key: "redirectPathMsar",
      value: to.name?.toString() || "",
      withEncrypt: false,
    });
    next({ name: "login" });
    return;
  }
  next();
  return;
}
