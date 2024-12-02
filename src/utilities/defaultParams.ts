import { reactive } from "vue";

export const limits = reactive([
  { name: "5", id: 5, selected: false },
  { name: "10", id: 10, selected: true },
  { name: "20", id: 12, selected: false },
  { name: "30", id: 24, selected: false },
  { name: "50", id: 50, selected: false },
  { name: "All", id: 999999999, selected: false },
]);
