<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { usePermissionStore } from "@/stores/permission";
import useLanguage from "@/stores/i18n/languageStore";
const { t } = useLanguage();
//#region authorization
// const { can } = usePermissionStore();
//#endregion
const router = useRouter();
const authStore = useAuthStore();
const logout = () => {
  authStore.logout();
};
</script>
<template>
  <div class="fixed flex w-[5%] h-[90vh]">
    <div class="w-20 flex-none flex flex-col h-full pl-2 py-2">
      <div
        class="bg-lightNav h-full md:min-h-[92vh] md:h-screen px-4 py-10 sm:rounded-xl flex flex-col justify-between"
      >
        <nav class="flex items-center space-x-0 flex-col space-y-2">
          <router-link :to="{ name: 'featureControl' }">
            <a
              class="text-white/50 p-4 inline-flex justify-center rounded-md hover:text-white smooth-hover"
              href="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 sm:h-6 sm:w-6 text-gray-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                />
              </svg>
            </a>
          </router-link>
          <!-- Active: bg-gray-800 text-white, Not active: text-white/50 -->
          <router-link :to="{ name: 'companyIndex' }">
            <a
              class="text-white/50 p-4 inline-flex justify-center rounded-md hover:text-white smooth-hover"
              href="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 text-gray-700"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                />
              </svg>
            </a>
          </router-link>
          <router-link :to="{ name: 'computerIndex' }">
            <a
              class="text-white/50 p-4 inline-flex justify-center rounded-md hover:text-white smooth-hover"
              href="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 text-gray-700"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
            </a>
          </router-link>
          <router-link :to="{ name: 'featureIndex' }">
            <a
              class="text-white/50 p-4 inline-flex justify-center rounded-md hover:text-white smooth-hover"
              href="#"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 text-gray-700"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
                />
              </svg>
            </a>
          </router-link>
        </nav>
        <!-- setting and log out -->
        <div
          class="flex items-center space-x-2 lg:space-x-0 flex-col space-y-2"
        >
          <a class="" href="#">
            <div class="flex justify-center">
              <div>
                <div class="dropdown relative">
                  <button
                    class="dropdown-toggle text-white/50 p-4 inline-flex justify-center rounded-md hover:bg-gray-800 hover:text-white smooth-hover"
                    type="button"
                    id="dropdownMenuButton2"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 sm:h-6 sm:w-6"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="caret-down"
                      class="w-2 ml-2 visually-hidden"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path
                        fill="currentColor"
                        d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
                      ></path>
                    </svg>
                  </button>
                  <!-- <van-popover v-model:show="showPopover">
                    <van-grid
                      square
                      clickable
                      :border="false"
                      column-num="3"
                      style="width: 640px; hw"
                      class="ml-20"
                    >
                      <van-grid-item text="Option" @click="showPopover = false"
                        >aaa</van-grid-item
                      >
                    </van-grid>
                    <template #reference>
                      <van-button type="primary">s</van-button>
                    </template>
                  </van-popover> -->
                  <ul
                    class="dropdown-menu min-w-max absolute hidden text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg shadow-black mt-1 m-0 bg-clip-padding border-none bg-gray-800"
                    aria-labelledby="dropdownMenuButton2"
                  >
                    <li class="rounded-sm relative px-3 py-1 text-gray-300">
                      <button
                        class="w-full text-left flex items-center outline-none focus:outline-none"
                      >
                        <span class="pr-1 flex-1">{{ t("Accounts") }}</span>
                        <span class="mr-auto">
                          <svg
                            class="fill-current h-4 w-4 transition duration-150 ease-in-out"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path
                              d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                            />
                          </svg>
                        </span>
                      </button>
                      <ul
                        class="bg-gray-900 border rounded-md border-gray-800 shadow-lg shadow-gray-900 absolute top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-32"
                      >
                        <li>
                          <a
                            class="dropdown-item hover:bg-gray-800 text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-300 duration-300 hover:text-white focus:text-white focus:bg-gray-700"
                            href="#"
                            >{{ t("User") }}</a
                          >
                        </li>
                        <!-- <li
                          class="rounded-sm relative px-3 py-1 hover:bg-gray-700"
                        >
                          <button
                            class="w-full text-left flex items-center outline-none focus:outline-none"
                          >
                            <span class="pr-1 flex-1">Python</span>
                            <span class="mr-auto">
                              <svg
                                class="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                                />
                              </svg>
                            </span>
                          </button>
                          <ul
                            class="bg-white border rounded-sm absolute top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-32"
                          >
                            <li class="px-3 py-1 hover:bg-gray-100">2.7</li>
                            <li class="px-3 py-1 hover:bg-gray-100">3+</li>
                          </ul>
                        </li> -->
                        <li>
                          <a
                            class="dropdown-item hover:bg-gray-800 text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-300 duration-300 hover:text-white focus:text-white focus:bg-gray-700 active:bg-blue-600"
                            href="#"
                            >{{ t("Account") }}</a
                          >
                        </li>
                        <li>
                          <a
                            class="dropdown-item hover:bg-gray-800 text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-300 duration-300 hover:text-white focus:text-white focus:bg-gray-700"
                            href="#"
                            >{{ t("Agent") }}</a
                          >
                        </li>
                        <li>
                          <a
                            class="dropdown-item hover:bg-gray-800 text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-300 duration-300 hover:text-white focus:text-white focus:bg-gray-700"
                            href="#"
                            >{{ t("Supplier") }}</a
                          >
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a
                        class="dropdown-item hover:bg-gray-900 text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-300 duration-300 hover:text-white focus:text-white focus:bg-gray-700"
                        href="#"
                        >{{ t("Hotel") }}</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item hover:bg-gray-900 text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-300 duration-300 hover:text-white focus:text-white focus:bg-gray-700"
                        href="#"
                        >{{ t("Setting") }}</a
                      >
                    </li>
                    <li>
                      <a
                        class="dropdown-item hover:bg-gray-900 text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-300 duration-300 hover:text-white focus:text-white focus:bg-gray-700"
                        href="#"
                      >
                        {{ t("Log Out") }}
                        <!-- <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 sm:h-6 sm:w-6"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg> -->
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </a>
          <a
            class="text-white/50 p-4 inline-flex justify-center rounded-md hover:bg-gray-800 hover:text-white smooth-hover"
            href="#"
          >
            <svg
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
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* since nested groupes are not supported we have to use 
      regular css for the nested dropdowns 
  */
li > ul {
  transform: translatex(100%) scale(0);
}
li:hover > ul {
  transform: translatex(101%) scale(1);
}
li > button svg {
  transform: rotate(-90deg);
}
li:hover > button svg {
  transform: rotate(-270deg);
}
.min-w-32 {
  min-width: 8rem;
}
</style>
<!-- vant drop down need to css edits -->
<!-- <li>
            <van-collapse v-model="activeNames">
              <van-collapse-item title="Financial" name="1">
                Check Out</van-collapse-item
              >
            </van-collapse>
          </li> -->
<!-- end vant -->
