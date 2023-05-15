export default (to, from, next) => {
  const isAuthenticated =
    localStorage.getItem("isAuthenticated") == "1" ? true : false;
  if (!isAuthenticated) {
    next({
      name: "Login",
    });
  }
  next();
};
