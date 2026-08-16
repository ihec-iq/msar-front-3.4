import { onMounted, ref } from "vue";
import { defineStore } from "pinia";
import { useLocalStorage } from "@/compositions/uselocalStorage";

export const useRtlStore = defineStore("rtlStore", () => {
  const isRtl = ref<boolean>(false);
  const isClose = ref<boolean>(true);
  const isCloseStick = ref<boolean>(false);

  const is = ref(false);
  const ChangeDirection = () => {
    // console.log("old RTL : " + isRtl.value);
    isRtl.value = !isRtl.value;
    // console.log("New RTL : " + isRtl.value);
    if (isRtl.value) {
      useLocalStorage().set({
        key: "dir",
        value: "rtl",
        withEncrypt: false,
      });
      //localStorage.setItem("isRtl", "true");
    } else {
      //localStorage.setItem("isRtl", "false");
      useLocalStorage().set({
        key: "dir",
        value: "ltr",
        withEncrypt: false,
      });
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
  return { isRtl, isClose, isCloseStick, ChangeDirection, is };
});
