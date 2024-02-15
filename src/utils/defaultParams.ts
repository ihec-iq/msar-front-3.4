import { reactive } from "vue";

export const limits = reactive([
  { name: "10", val: 10, selected: true },
  { name: "20", val: 12, selected: false },
  { name: "30", val: 24, selected: false },
  { name: "50", val: 50, selected: false },
  { name: "All", val: 999999999 },
]);
 
