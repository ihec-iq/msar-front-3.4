import { onMounted, ref } from "vue";
import { defineStore } from "pinia";

export const useRtlStore = defineStore("rtlStore", () => {
  const isRtl = ref(false);
  const isClose = ref(true);
  const is = ref(false);
  const ChangeDirection = () => {
    // console.log("old RTL : " + isRtl.value);
    isRtl.value = !isRtl.value;
    // console.log("New RTL : " + isRtl.value);
    if (isRtl.value) {
      localStorage.setItem("dir", "rtl");
      //localStorage.setItem("isRtl", "true");
    } else {
      //localStorage.setItem("isRtl", "false");
      localStorage.setItem("dir", "ltr");
    }
    const htmlEl = document.querySelector("html");
    // let dir: string | any = "ltr";
    // if (localStorage.getItem("dir")?.toString() != undefined)
    //   dir = localStorage.getItem("dir")?.toString();
    htmlEl?.setAttribute("dir", isRtl.value ? "rtl" : "ltr");
  };
  onMounted(() => {
    let dir: string | any = "rtl";
    if (localStorage.getItem("dir")?.toString() != undefined)
      dir = localStorage.getItem("dir")?.toString();
    isRtl.value = dir == "ltr" ? false : true;
    const htmlEl = document.querySelector("html");
    htmlEl?.setAttribute("dir", isRtl.value ? "rtl" : "ltr");
  });
  return { isRtl, isClose, ChangeDirection, is };
});
