<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, onBeforeMount } from "vue";
import Swal from "sweetalert2";
import { usePermissionStore } from "@/stores/permission";
import { i18nRepository } from "@/stores/i18n/I18nRepository";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";

import { useNotificationStore } from "@/stores/core/notification";
import type INotification from "@/types/core/INotification";
import { openNotification } from "@/utils/openNotification";

const rtlStore = useRtlStore();
const { isClose } = storeToRefs(rtlStore);
const st = i18nRepository.getState();
const t = (text: string) => {
  return st.langTextRepo[st.info.lang][text] || text;
};

//#region authorization
const { can, checkPermissionAccess } = usePermissionStore();
//#endregion
const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const notifications = ref<Array<INotification>>([]);
const notificationStore = useNotificationStore();

const { notification } = notificationStore;
const getData = async () => {
  notificationStore.get().then((response) => {
    if (response.status == 200) {
      notifications.value = response.data.data;
      console.log(notifications.value);
    }
  });
};
const errors = ref<String | null>();
const store = (id: number) => {
  notification.is_read = 1;
  errors.value = null;
  notificationStore
    .store(id)
    .then(() => {
      getData();
    })
    .catch((error) => {
      errors.value = notificationStore.getError(error);
      Swal.fire({
        icon: "error",
        title: t("create new data fails!!!"),
        text: error.response.data.message,
        footer: "",
      });
    });
};

const open = (notification: any) => {
  openNotification(router, notification.type, notification.id);
};
// const Delete = async (id: number) => {
//   const swalWithBootstrapButtons = Swal.mixin({
//     customClass: {
//       confirmButton: "btn m-2 bg-red-700",
//       cancelButton: "btn bg-grey-400",
//     },
//     buttonsStyling: false,
//   });
//   swalWithBootstrapButtons
//     .fire({
//       title: t("Are You Sure?"),
//       text: t("You Won't Be Able To Revert This!"),
//       icon: "Warning",
//       showCancelButton: true,
//       confirmButtonText: t("Yes, delete it!"),
//       cancelButtonText: t("No, cancel!"),
//       reverseButtons: true,
//     })
//     .then(async (result) => {
//       if (result.isConfirmed) {
//         await _delete(id).then((response) => {
//           swalWithBootstrapButtons.fire(
//             t("Deleted!"),
//             t("Deleted successfully ."),
//             "success"
//           );
//           getData();
//         });
//       }
//     });
// };
onBeforeMount(() => {
  isLoading.value = true;
});
onMounted(async () => {
  getData();
});
</script>
<template>
  <PageTitle>{{ t("Notifications") }}</PageTitle>
  <div class="w-full mb-12">
    <div class="w-full">
      <div
        class="flex flex-col xs:ml-14 lg:overflow-visible xs:overflow-x-auto xs:overflow-y-visible"
      >
        <div
          class="py-4 inline-block min-w-full xs:min-w-fit sm:px-5 lg:px-8 xs:ml-9 xs:mr-3"
        >
          <div class="rounded-xl">
            <div class="lg:overflow-visible xs:overflow-auto">
              <table
                v-motion
                :initial="{ opacity: 0, y: -15 }"
                :enter="{ opacity: 1, y: 0 }"
                :variants="{ custom: { scale: 2 } }"
                :delay="200"
                class="min-w-full text-center"
              >
                <thead class="dark:bg-tableHead bg-LightTableHead shadow">
                  <tr>
                    <th
                      scope="col"
                      class="text-lg font-medium rounded-tl-md rounded-bl-md text-text dark:text-textLight px-6 py-4"
                    >
                      {{ t("aa") }}
                    </th>
                    <th
                      scope="col"
                      class="text-lg font-medium rounded-tl-md rounded-bl-md text-text dark:text-textLight px-6 py-4"
                    >
                      {{ t("Details") }}
                    </th>
                    <th
                      scope="col"
                      class="text-lg font-medium text-text dark:text-textLight px-6 py-4"
                    >
                      {{ t("Type") }}
                    </th>
                    <th
                      scope="col"
                      class="text-lg font-medium text-text dark:text-textLight px-6 py-4"
                    >
                      {{ t("Read") }}
                    </th>
                  </tr>
                </thead>
                <tbody class="dark:bg-tableBody dark:text-textLight">
                  <tr
                    class="dark:hover:bg-tableBodyHover cursor-pointer bg-gray-100 dark:bg-tableBody hover:bg-gray-300 duration-300 border-t border-gray-400 dark:border-gray-900"
                    v-for="item in notifications"
                    :key="item.id"
                    @click="
                      open(item);
                      store(item.id);
                    "
                  >
                    <td class="text-sm font-light px-6 py-4 whitespace-nowrap">
                      <svg
                        v-if="item.type == 'bug'"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0115.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 00-.575-1.752M4.921 6a24.048 24.048 0 00-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 01-5.223 1.082"
                        />
                      </svg>
                      <svg
                        v-if="item.type == 'Feedback'"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                        />
                      </svg>
                      <svg
                        v-if="item.type == 'active request'"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                        />
                      </svg>
                      <svg
                        v-if="item.type == 'feature request'"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                    </td>
                    <td class="text-sm font-light px-6 py-4 whitespace-nowrap">
                      {{ item.details }}
                    </td>
                    <td class="text-sm font-light px-6 py-4 whitespace-nowrap">
                      {{ item.type }}
                    </td>
                    <td class="text-sm font-light px-6 py-4 whitespace-nowrap">
                      {{ item.is_read == 1 ? "Read" : "UnRead" }}
                      <div v-if="item.is_read == 0" class="relative flex">
                        <div
                          class="relative noti-shadow inline-flex w-3 h-3 bg-red-500 rounded-full bottom-6 left-[10rem]"
                        ></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.noti-shadow {
  box-shadow: 0px 0px 9px 0px rgb(255, 63, 63);
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.loading-fade-leave-action {
  @apply transition-opacity duration-700;
}
.loading-fade-leave-to {
  @apply opacity-0;
}
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
@media (max-width: 390px) {
  .bottom {
    width: 103%;
  }
  .backBtn {
    margin-left: 2%;
  }
}
</style>
