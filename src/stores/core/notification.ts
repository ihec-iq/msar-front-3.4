import { ref, onMounted, reactive } from "vue";
import { defineStore } from "pinia";
import { getError } from "@/utils/helpers";
import Api from "@/api/apiConfig";
import type INotification from "@/types/core/INotification";
export const useNotificationStore = defineStore("notificationStore", () => {
  const notification = reactive<INotification>({
    is_read: 0,
    id: 0,
    details: "",
    type: "",
    color: "",
  });
  const notifications = ref<Array<INotification>>([]);

  async function get() {
    return await Api.get("/hd/notification");
  }
  async function store(id: number) {
    return await Api.post(`/hd/notification/${id}`);
  }
  onMounted(async () => {
    await get();
  });
  return { notifications, notification, get, store, getError };
});
