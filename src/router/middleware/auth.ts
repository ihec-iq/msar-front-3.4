import type { RouteLocationNormalized } from "vue-router";

export default (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: Function
) => {
  console.log("Auth")
  const isAuthenticated =
    localStorage.getItem("isAuthenticated") == "1" ? true : false;
  if (!isAuthenticated) {
    next({
      name: "Login",
    });
  }
  next();
};
