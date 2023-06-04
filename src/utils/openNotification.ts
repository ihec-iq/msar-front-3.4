import type { Router } from "vue-router";
export function openNotification(router: Router, type: string, id: number) {
  let path = "";
  if (type == "bug") {
    path = "allBugs";
  } else if (type == "Feedback") {
    path = "allSupport";
  } else if (type == "active request") {
    path = "activeIndex";
  } else if (type == "feature request") {
    path = "activeIndex";
  } else {
    path = "activeIndex";
  }
  console.log(path);

  router.push({
    name: path,
    params: { id: id },
  });
}
