<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
// import Footer from "@/components/login/footer.vue";
import { Form } from "vee-validate";
import * as Yup from "yup";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { getError } from "@/utils/helpers";
import TextInput from "@/components/general/TextInput.vue";
import { useI18n } from "@/stores/i18n/useI18n";
import { useConfigStore } from "@/stores/config";
import { storeToRefs } from "pinia";
import Swal from "sweetalert2";
import SimpleLoading from "@/components/general/SimpleLoading.vue";
import { useDark, useToggle, useColorMode } from "@vueuse/core";
import { useRtlStore } from "@/stores/i18n/rtlPi";
const { t, setLocale, Languages } = useI18n();
const rtlStore = useRtlStore();
const { isRtl } = storeToRefs(rtlStore);
const { ChangeDirection } = useRtlStore();
const colorMode = useColorMode({
  modes: {
    red: "red",
    green: "green",
    yellow: "yellow",
    blue: "blue",
    amber: "amber",
  },
});
const change = () => {
  ChangeDirection();
};

const showPop = ref(false);
const showPopup = () => {
  showPop.value = true;
};
const closePopup = () => {
  showPop.value = false;
};
let isDark = useDark();
let themeDark = ref(false);
const toggleDark = useToggle(isDark);
const changeDark = () => {
  themeDark.value = !themeDark.value;
  toggleDark(themeDark.value);
};
const { ConnectionString } = storeToRefs(useConfigStore());
interface ILogin {
  email: string;
  password: string;
}
const loginForm = reactive<ILogin>({
  email: "admin@admin.com",
  password: "password",
});

//setFieldValue('fieldName', 'newValue');
const onSubmit = (values: any) => {
  loginForm.email = values.email;
  loginForm.password = values.password;
  Login();
};
function onInvalidSubmit() {
  const submitBtn = document.querySelector(".submit-btn");
  submitBtn?.classList.add("invalid");
  setTimeout(() => {
    submitBtn?.classList.remove("invalid");
  }, 1000);
}
const schema = Yup.object().shape({
  email: Yup.string().required(),
  password: Yup.string().min(2).required(),
});

const errs = ref("");
const isLoading = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const Login = async () => {
  isLoading.value = true;
  errs.value = "";
  await authStore
    .login(loginForm)
    .then(() => {
      router.push({
        name: "Dashboard",
      });
    })
    .catch((error) => {
      errs.value = getError(error.response);
    });
  isLoading.value = false;
};
onMounted(async () => {
  if (authStore.isAuthenticated) router.push({ name: "Dashboard" });
  await useConfigStore()
    .load()
    .then(() => {
      if (ConnectionString.value == null || ConnectionString.value == "") {
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn m-2 bg-red-700",
            cancelButton: "btn bg-grey-400",
          },
          buttonsStyling: false,
        });
        swalWithBootstrapButtons
          .fire({
            title: t("Are You Sure?"),
            text: t(
              "Your Server is down ,You want to open Connection Setting ?"
            ),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: t("Yes, open it!"),
            cancelButtonText: t("No, cancel!"),
            reverseButtons: true,
          })
          .then(async (result) => {
            if (result.isConfirmed) {
              router.push({ name: "Config" });
            }
          });
      }
    });
});
</script>
<template>
  <!-- <div
    class="bg-purple-900 absolute top-0 left-0 bg-gradient-to-b from-gray-900 via-gray-900 to-[#0051ff] bottom-0 leading-5 h-full w-full overflow-hidden"
  ></div> -->
  <div
    class="relative z-30 overflow-y-hidden sm:flex sm:flex-row justify-evenly bg-transparent rounded-3xl"
  >
    <div
      class="flex-col lg:flex xs:hidden self-center lg:px-14 sm:max-w-4xl xl:max-w-md"
    >
      <div class="self-start hidden lg:flex flex-col text-gray-300">
        <!-- <p class="pr-3 text-sm opacity-75">
          Lorem ipsum is placeholder text commonly used in the graphic, print,
          and publishing industries for previewing layouts and visual mockups
        </p> -->
      </div>
    </div>
    <div class="flex justify-center">
      <div class="p-12 bg-white mx-auto rounded-3xl w-96">
        <div class="mb-7">
          <h3 class="font-semibold text-2xl text-gray-800">
            {{ t("Sign In") }}
          </h3>
          <!-- <p class="text-gray-400">
            Don't have an account?
            <a href="#" class="text-sm text-purple-700 hover:text-purple-700">{{
              t("Sign Up")
            }}</a>
          </p> -->
        </div>
        <div class="space-y-6">
          <Form
            v-if="isLoading == false"
            :initial-values="loginForm"
            @submit="onSubmit"
            :validation-schema="schema"
            @invalid-submit="onInvalidSubmit"
          >
            <div class="relative mb-2" x-data="{ show: true }">
              <TextInput
                v-model="loginForm.email"
                name="email"
                type="email"
                :label="t('E-mail')"
                :placeholder="t('Your Email Address')"
                success-message="Got it, we won't spam you!"
              />
              <TextInput
                v-model="loginForm.password"
                name="password"
                type="password"
                :label="t('Password')"
                :placeholder="t('Your password')"
                success-message="Nice and secure!"
              />
            </div>
            <div class="flex items-center justify-between">
              <div class="mb-3 text-red-600 text-lg" v-if="errs != ''">
                {{ errs }}
              </div>
            </div>
            <!-- <div class="flex items-center justify-between">
              <div class="text-sm ml-auto mb-3">
                <a href="#" class="text-purple-700 hover:text-purple-600">
                  {{ t("Forgot your password?") }}
                </a>
              </div>
            </div> -->
            <div>
              <button
                type="submit"
                class="submit-btn w-full flex justify-center bg-[#0344d2] hover:bg-[#02287a] text-gray-100 p-3 rounded-lg tracking-wide font-semibold cursor-pointer transition ease-in duration-500"
              >
                {{ t("Sign In") }}
              </button>
            </div>
          </Form>
          <SimpleLoading v-else></SimpleLoading>
          <!-- <div class="flex items-center justify-center space-x-2 my-5">
            <span class="h-px w-16 bg-gray-100"></span>
            <span class="text-gray-700 font-normal">or</span>
            <span class="h-px w-16 bg-gray-100"></span>
          </div> -->
          <!-- <div class="flex justify-center gap-5 w-full">
            <button
              type="submit"
              class="w-full flex items-center justify-center mb-6 md:mb-0 border border-gray-300 hover:border-gray-900 hover:bg-gray-900 text-sm text-gray-500 p-3 rounded-lg tracking-wide font-medium cursor-pointer transition ease-in duration-500"
            >
              <svg
                class="w-4 mr-2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#EA4335"
                  d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                />
                <path
                  fill="#34A853"
                  d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                />
                <path
                  fill="#4A90E2"
                  d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="submit"
              class="w-full flex items-center justify-center mb-6 md:mb-0 border border-gray-300 hover:border-gray-900 hover:bg-gray-900 text-sm text-gray-500 p-3 rounded-lg tracking-wide font-medium cursor-pointer transition ease-in duration-500 px-"
            >
              <svg
                class="w-4 mr-2"
                viewBox="0 0 100 100"
                style="enable-background: new 0 0 100 100"
                xml:space="preserve"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Layer_1" />
                <g id="Layer_2">
                  <path
                    d="M50 2.5c-58.892 1.725-64.898 84.363-7.46 95h14.92c57.451-10.647 51.419-93.281-7.46-95z"
                    style="fill: #1877f2"
                  />
                  <path
                    d="M57.46 64.104h11.125l2.117-13.814H57.46v-8.965c0-3.779 1.85-7.463 7.781-7.463h6.021V22.101c-12.894-2.323-28.385-1.616-28.722 17.66V50.29H30.417v13.814H42.54V97.5h14.92V64.104z"
                    style="fill: #f1f1f1"
                  />
                </g>
              </svg>
              <span>Facebook</span>
            </button>
          </div> -->
        </div>
        <section class="flex justify-center mt-5">
          <img src="@/assets/image/avatar-3.png" alt="" />
        </section>
        <div class="mt-7 text-center text-gray-300 text-xs"></div>
      </div>
    </div>
  </div>
  <h1>{{ errs }}</h1>
  <!-- <Footer class="bg-transparent absolute w-full bottom-0 left-0 z-30">
    <div class="container p-5 mx-auto flex items-center justify-between"></div>
  </Footer> -->

  <!-- <svg
    class="absolute bottom-0 left-0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 320"
  >
    <path
      fill="#fff"
      fill-opacity="1"
      d="M0,0L40,42.7C80,85,160,171,240,197.3C320,224,400,192,480,154.7C560,117,640,75,720,74.7C800,75,880,117,960,154.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
    ></path>
  </svg> -->
  <div class="waveWrapper waveAnimation">
    <div class="waveWrapperInner bgTop">
      <div
        class="wave waveTop"
        style="
          background-image: url('http://front-end-noobs.com/jecko/img/wave-top.png');
        "
      ></div>
    </div>
    <div class="waveWrapperInner bgMiddle">
      <div
        class="wave waveMiddle"
        style="
          background-image: url('http://front-end-noobs.com/jecko/img/wave-mid.png');
        "
      ></div>
    </div>
    <div class="waveWrapperInner bgBottom">
      <div
        class="wave waveBottom"
        style="
          background-image: url('http://front-end-noobs.com/jecko/img/wave-bot.png');
        "
      ></div>
    </div>
  </div>
  <div class="fixed top-4 right-5 z-40">
    <div class="flex items-center">
      <button
        is-link
        @click="showPopup"
        class="dark:text-textGray z-50 mx-2 dark:hover:text-iconHover dark:bg-sideNavSetting bg-transparent hover:bg-transparent text-iconLight hover:text-iconHoverLight inline-flex justify-center rounded-md smooth-hover"
      >
        <svg
          class="w-7 h-7"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    </div>
  </div>
  <van-popup
    class="bg-customer lg:ltr:left-[1723px] lg:rtl:right-[1344px] h-screen z-[999999] lg:w-[20%] xs:w-full dark:bg-content flex"
    v-model:show="showPop"
    round
    ><div class="dark:text-textLight w-full">
      <div class="text-2xl text-center p-2 font-bold mt-6">
        {{ t("Setting") }}
      </div>
      <div
        v-motion
        :initial="{ opacity: 0, y: -15 }"
        :enter="{ opacity: 1, y: 0 }"
        :variants="{ custom: { scale: 2 } }"
        :delay="200"
      >
        <div class="flex items-center justify-between mx-6">
          <div class="text-text dark:text-textLight font-bold text-lg">
            {{ t("Change Theme") }}
          </div>
          <div class="switch4">
            <label class="switch">
              <input
                type="checkbox"
                @input="changeDark()"
                v-model="themeDark"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>
        <div class="flex items-center justify-between mx-6">
          <div class="text-text dark:text-textLight font-bold text-lg">
            {{ t("Change Direction") }}
          </div>
          <div class="flex items-center">
            <!-- :class="{ 'rtl; bg-red-900 ': isLtr, 'bg-green-900': !isLtr }" -->
            <div
              class="dark:text-white mb-6 text-black mt-6 ml-3 rtl:ml-3 ltr:mr-3"
            >
              {{ isRtl ? "RTL" : "LTR" }}
            </div>
            <input
              type="checkbox"
              @click="change()"
              v-model="isRtl"
              class="toggle toggle-info"
            />
          </div>
        </div>
        <div class="flex items-center justify-between mx-6">
          <div class="text-text dark:text-textLight font-bold text-lg">
            {{ t("Change Language") }}
          </div>
          <div class="flex items-center">
            <div class="dropdown dropdown-bottom ltr:ml-5 rtl:mr-3">
              <button href="#" class="items-center flex" tabindex="0">
                Languages
                <ul
                  tabindex="0"
                  class="dropdown-content ltr:right-0 rtl:left-0 menu p-2 shadow bg-settingLight dark:bg-setting text-text dark:text-textLight rounded-box mt-5"
                >
                  <li v-for="language in Languages" :key="language.code">
                    <button
                      @click="setLocale(language)"
                      class="flex justify-between"
                    >
                      {{ language.name }}
                    </button>
                  </li>
                </ul>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        @click="
          $router.push('/config');
          closePopup();
        "
        class="w-[350px] bg-amber-900 text-textLight mx-4 p-2 text-xl rounded-lg absolute bottom-14 cursor-pointer"
      >
        {{ t("Setting") }}
      </div>
      <div
        @click="closePopup()"
        class="bg-back w-[350px] text-textLight mx-4 p-2 text-xl rounded-lg absolute bottom-2 cursor-pointer"
      >
        {{ t("Close") }}
      </div>
    </div>
  </van-popup>
</template>

<style>
:root {
  --primary-color: #0071fe;
  --error-color: #f23648;
  --error-bg-color: #fddfe2;
  --success-color: #21a67a;
  --success-bg-color: #e0eee4;
}

.dark .label {
  width: 40px;
  height: 16px;
  background-color: #111;
  display: flex;
  border-radius: 50px;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  position: relative;
  transform: scale(1.5);
}
.label {
  width: 40px;
  height: 16px;
  background-color: #fff;
  display: flex;
  border-radius: 50px;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  position: relative;
  transform: scale(1.5);
}

.dark .ball {
  width: 13px;
  height: 13px;
  background-color: #fff;
  position: absolute;
  top: 1.4px;
  left: 0px;
  border-radius: 50%;
  transition: transform 0.2s linear;
}
.ball {
  width: 13px;
  height: 13px;
  background-color: #141c2a;
  position: absolute;
  top: 1.4px;
  left: 5px;
  border-radius: 50%;
  transition: transform 0.2s linear;
}

/*  target the elemenent after the label*/
.checkbox:checked + .label .ball {
  transform: translateX(24px);
}

.switch4,
.switch input {
  width: min-content;
  padding: 50px;
  /*flex*/
  display: flex;
  justify-content: center;
  align-items: center;
  /* Position */
  position: relative;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
.switch input {
  display: none;
}
.slider {
  width: 55px;
  height: 30px;
  background-color: white;
  display: block;
  border-radius: 50px;
  position: relative;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  cursor: pointer;
}
.slider::before {
  content: "";
  width: 20px;
  height: 20px;
  border-radius: 50px;
  display: block;
  position: absolute;
  top: 4px;
  left: 2px;
  transition: transform 0.8s, background-color 1s;
}
input:checked + .slider {
  background-color: black;
}
input:checked + .slider::before {
  transform: translateX(calc(60px - 24px - 8px));
}
.switch3 input:checked + .slider::before {
  transform: translateX(calc(70px - 24px));
}
.switch4 .slider::before {
  content: "☼";
  color: rgb(255, 221, 0);
  background: black;
}
.switch4 input:checked + .slider::before {
  content: "☾";
  color: pink;
  font: 900;
  text-align: center;
  background: white;
}
.fa-moon {
  color: pink;
}

.fa-sun {
  color: yellow;
}
.submit-btn {
  background: var(--primary-color);
  outline: none;
  border: none;
  color: #fff;
  font-size: 18px;
  padding: 10px 15px;
  display: block;
  width: 100%;
  border-radius: 7px;
  margin-top: 40px;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}

.submit-btn.invalid {
  animation: shake 0.5s;
  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px);
  }
  10% {
    transform: translate(-1px, -2px);
  }
  20% {
    transform: translate(-3px, 0px);
  }
  30% {
    transform: translate(3px, 2px);
  }
  40% {
    transform: translate(1px, -1px);
  }
  50% {
    transform: translate(-1px, 2px);
  }
  60% {
    transform: translate(-3px, 1px);
  }
  70% {
    transform: translate(3px, 1px);
  }
  80% {
    transform: translate(-1px, -1px);
  }
  90% {
    transform: translate(1px, 2px);
  }
  100% {
    transform: translate(1px, -2px);
  }
}

.submit-btn:hover {
  transform: scale(1.1);
}
@keyframes move_wave {
  0% {
    transform: translateX(0) translateZ(0) scaleY(1);
  }
  50% {
    transform: translateX(-25%) translateZ(0) scaleY(0.55);
  }
  100% {
    transform: translateX(-50%) translateZ(0) scaleY(1);
  }
}
.waveWrapper {
  overflow: hidden;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
}
.waveWrapperInner {
  position: absolute;
  width: 100%;
  overflow: hidden;
  height: 100%;
  bottom: -1px;
  background-image: linear-gradient(to top, #162c99 20%, #27273c 80%);
}
.bgTop {
  z-index: 15;
  opacity: 0.5;
}
.bgMiddle {
  z-index: 10;
  opacity: 0.75;
}
.bgBottom {
  z-index: 5;
}
.wave {
  position: absolute;
  left: 0;
  width: 200%;
  height: 100%;
  background-repeat: repeat no-repeat;
  background-position: 0 bottom;
  transform-origin: center bottom;
}
.waveTop {
  background-size: 50% 100px;
}
.waveAnimation .waveTop {
  animation: move-wave 3s;
  -webkit-animation: move-wave 3s;
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
}
.waveMiddle {
  background-size: 50% 120px;
}
.waveAnimation .waveMiddle {
  animation: move_wave 10s linear infinite;
}
.waveBottom {
  background-size: 50% 100px;
}
.waveAnimation .waveBottom {
  animation: move_wave 15s linear infinite;
}

.content {
  position: relative;
}

.content h2 {
  color: #fff;
  font-size: 8em;
  position: absolute;
  transform: translate(-50%, -50%);
}

.content h2:nth-child(1) {
  color: transparent;
  -webkit-text-stroke: 2px #8338ec;
}

.content h2:nth-child(2) {
  color: #c19bf5;
  animation: animate 4s ease-in-out infinite;
}

@keyframes animate {
  0%,
  100% {
    clip-path: polygon(
      0% 45%,
      16% 44%,
      33% 50%,
      54% 60%,
      70% 61%,
      84% 59%,
      100% 52%,
      100% 100%,
      0% 100%
    );
  }

  50% {
    clip-path: polygon(
      0% 60%,
      15% 65%,
      34% 66%,
      51% 62%,
      67% 50%,
      84% 45%,
      100% 46%,
      100% 100%,
      0% 100%
    );
  }
}
</style>
<!-- ///////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!--<template><div class="w-full min-h-screen flex items-center justify-center">
   <div class="w-full h-screen flex items-center justify-center">
      <div class="w-full sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 h-full bg-white flex items-center justify-center">
          <div class="w-full px-12">
              
              <h2 class="text-center text-2xl font-bold tracking-wide text-gray-800">Sign Up</h2>
              <p class="text-center text-sm text-gray-600 mt-2">Already have an account? <a href="#" class="text-blue-600 hover:text-blue-700 hover:underline" title="Sign In">Sign in here</a></p>

              <form class="my-8 text-sm">
                  <div class="flex flex-col my-4">
                      <label for="name" class="text-gray-700">Name</label>
                      <input type="text" name="name" id="name" class="mt-2 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900" placeholder="Enter your name">
                  </div>

                  <div class="flex flex-col my-4">
                      <label for="email" class="text-gray-700">Email Address</label>
                      <input type="email" name="email" id="email" class="mt-2 p-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900" placeholder="Enter your email">
                  </div>
                  
                  <div class="flex flex-col my-4">
                      <label for="password" class="text-gray-700">Password</label>
                      <div x-data="{ show: false }" class="relative flex items-center mt-2">
                          <input  name="password" id="password" class="flex-1 p-2 pr-10 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900" placeholder="Enter your password">
                          <button type="button" class="absolute right-2 bg-transparent flex items-center justify-center text-gray-700">
                              <svg x-show="!show" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
 </button>
                      </div>
                  </div>

                  <div class="flex flex-col my-4">
                      <label for="password_confirmation" class="text-gray-700">Password Confirmation</label>
                      <div x-data="{ show: false }" class="relative flex items-center mt-2">
                          <input    name="password_confirmation" id="password_confirmation" class="flex-1 p-2 pr-10 border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300 rounded text-sm text-gray-900" placeholder="Enter your password again" type="password">
                          <button type="button" class="absolute right-2 bg-transparent flex items-center justify-center text-gray-700">
                              <svg x-show="!show" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>

                              <svg x-show="show" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="display: none;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                          </button>
                      </div>
                  </div>

                  <div class="flex items-center">
                      <input type="checkbox" name="remember_me" id="remember_me" class="mr-2 focus:ring-0 rounded">
                      <label for="remember_me" class="text-gray-700">I accept the <a href="#" class="text-blue-600 hover:text-blue-700 hover:underline">terms</a> and <a href="#" class="text-blue-600 hover:text-blue-700 hover:underline">privacy policy</a></label>
                  </div>
              
                  <div class="my-4 flex items-center justify-end space-x-4">
                      <button class="bg-blue-600 hover:bg-blue-700 rounded-lg px-8 py-2 text-gray-100 hover:shadow-xl transition duration-150 uppercase">Sign Up</button>
                  </div>
              </form>
              
              <div class="flex items-center justify-between">
                  <div class="w-full h-[1px] bg-gray-300"></div>
                  <span class="text-sm uppercase mx-6 text-gray-400">Or</span>
                  <div class="w-full h-[1px] bg-gray-300"></div>
              </div>

              <div class="text-sm">
                  <a href="#" class="flex items-center justify-center space-x-2 text-gray-600 my-2 py-2 bg-gray-100 hover:bg-gray-200 rounded">
                      <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 326667 333333" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd"><path d="M326667 170370c0-13704-1112-23704-3518-34074H166667v61851h91851c-1851 15371-11851 38519-34074 54074l-311 2071 49476 38329 3428 342c31481-29074 49630-71852 49630-122593m0 0z" fill="#4285f4"></path><path d="M166667 333333c44999 0 82776-14815 110370-40370l-52593-40742c-14074 9815-32963 16667-57777 16667-44074 0-81481-29073-94816-69258l-1954 166-51447 39815-673 1870c27407 54444 83704 91852 148890 91852z" fill="#34a853"></path><path d="M71851 199630c-3518-10370-5555-21482-5555-32963 0-11482 2036-22593 5370-32963l-93-2209-52091-40455-1704 811C6482 114444 1 139814 1 166666s6482 52221 17777 74814l54074-41851m0 0z" fill="#fbbc04"></path><path d="M166667 64444c31296 0 52406 13519 64444 24816l47037-45926C249260 16482 211666 1 166667 1 101481 1 45185 37408 17777 91852l53889 41853c13520-40185 50927-69260 95001-69260m0 0z" fill="#ea4335"></path></svg>
                      <span>Sign up with Google</span>
                  </a>
                  <a href="#" class="flex items-center justify-center space-x-2 text-gray-600 my-2 py-2 bg-gray-100 hover:bg-gray-200 rounded">
                      <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 124.8 123.36"><defs
                      clipPath id="clip-path" transform="translate(0.69 0.51)">
                        <path class="cls-1" d="M27.75,0H95.13a27.83,27.83,0,0,1,27.75,27.75V94.57a27.83,27.83,0,0,1-27.75,27.74H27.75A27.83,27.83,0,0,1,0,94.57V27.75A27.83,27.83,0,0,1,27.75,0Z"></path>
                     <clipPath id="clip-path-2" transform="translate(0.69 0.51)"><rect class="cls-2" width="122.88" height="122.31"></rect></clipPath></defs><g class="cls-3"><g class="cls-4"><image width="260" height="257" transform="matrix(0.48, 0, 0, -0.48, 0, 123.36)" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQQAAAEBCAYAAACexdu5AAAACXBIWXMAABcRAAAXEQHKJvM/AAAEFUlEQVR4Xu3dwXEdIRBFUb4kZ+HwHJbDcxrSeAG+hctVJgDO2cyG9aumoYfX8zzP68evAdzr+fl9jDHG22EdcJGPMcZ4vV6ndcAFPubn+f8q4Aq2DEBmhWDLAAxbBmCzAkGFAKgQgM3qIRxWAVdwygBkVQhyAdBUBDZKAyCaikBmIDxfh2XADda0o50DUFNRhQBoKgIbgQBEIABx7AhEhQBEIACZW4a398My4AYqBCACAYhZBiCrh6BQAFQIwGZOO55WAVewVwDin4pAVlNRIACaisDG689ANBWBeLkJyOoheP0Z8Bw8sNFUBKJCAKKbCEQgAHHsCGQ99npaBtxAaQDEsSMQ045ANBWBqBCAKA2AeA4eiAoBiEAAIhCA6CEAUSEAWcNNcgEwywBs3FQEYpYBiAoByHr9WYUAqBCAzXqXwSkD4KEWYOPqMhDHjkBsGYCYZQCyjh1VCEAXk3QVAT0EYCMQgDh2BLIqBLMMQBXC+2EZcAPTjkD0EICsm4qnZcANlAZAjD8D0VQEoqkIxNVlIEoDIJqKQOY9hNMq4AoqBCB6CEDWL9RMOwIqBGDjbUcgq6noYhJglgHYaCoCWRXC52EZcIP1xyRNRaAK4bAKuIKry0D8IAWIl5uAqBCA+IUakFUh6CoCph2BzbqHYMsAuIcAbGwZgPhBChAVApA17XhaBtxAhQBEIAARCEAEAhCzDEBMOwKxZQAiEIAYbgJilgGILQOQOctwWgVcQQ8BiC0DkPUcvFwA+smql5sALzcBG8NNQGwZgKx/KtoyAO4hABulARBNRSCaikDcQwCiqQjElgHIqhDeD8uAG6xfqKkQADcVgY2mIhBNRSCaikBWhfB5WAbcwCwDEMcLQNax42kZcAMVAhCBAMTFJCDr5Sb3EAA3FYHNPGVQIQBDUxHYuLoMRFMRiKYiEBUCEBeTgDhlADLvIZxWAVfwgxQgtgxANBWBzED4clMR7vZtjOEeArBxUxGIHgIQ/0MAYvwZGLUTD6uAi8xY0EQAhqYisHEPAYimIjDGmEWB8Wcgxp+BOHYEoqkIRFMRGH82C7YMQAw3AfkYY4zH/xDgcnOzoEIAYpYBiKYiEIEAxJYBiAoBiGlHILYMQPxTEYiXm4Dx103F8aa3CDhlADa2DMCwZQD+oUIAxt/jz/9dCNzCb9iBaB4AEQhAzDIAUSEAEQhAnDIAUSEAcTEJiFMGIAIByBpuOqwCrqBCACIQgNgyAFEhAHExCYhAADJvKtoyAEOFAGwEAhCBAEQgAHEPAYgKAYhAACIQgAgEIAIBiEAAIhCACAQgAgGIQAAiEIAIBCACAYhAACIQgAgEIAIBiEAAIhCACAQgAgGIQAAiEIAIBCACAYhAACIQgAgEIAIBiEAAIhCA/AafC2PbZ0osjAAAAABJRU5ErkJggg=="></image></g></g><path class="cls-5" d="M85.36,78.92l2.72-17.76H71V49.63c0-4.86,2.38-9.59,10-9.59H88.8V24.92a94.45,94.45,0,0,0-13.75-1.2c-14,0-23.21,8.5-23.21,23.9V61.16H36.24V78.92h15.6v43.57H71V78.92Z" transform="translate(0.69 0.51)"></path></svg>
                      <span>Sign up with Facebook</span>
                  </a>
                  <a href="#" class="flex items-center justify-center space-x-2 text-gray-600 my-2 py-2 bg-gray-100 hover:bg-gray-200 rounded">
                      <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.31"><defs></defs><title>linkedin-app</title><path class="cls-1" d="M27.75,0H95.13a27.83,27.83,0,0,1,27.75,27.75V94.57a27.83,27.83,0,0,1-27.75,27.74H27.75A27.83,27.83,0,0,1,0,94.57V27.75A27.83,27.83,0,0,1,27.75,0Z"></path><path class="cls-2" d="M49.19,47.41H64.72v8h.22c2.17-3.88,7.45-8,15.34-8,16.39,0,19.42,10.2,19.42,23.47V98.94H83.51V74c0-5.71-.12-13.06-8.42-13.06s-9.72,6.21-9.72,12.65v25.4H49.19V47.41ZM40,31.79a8.42,8.42,0,1,1-8.42-8.42A8.43,8.43,0,0,1,40,31.79ZM23.18,47.41H40V98.94H23.18V47.41Z"></path></svg>
                      <span>Sign up with LinkedIn</span>
                  </a>
              </div>
          </div>
      </div>
      <div class="hidden lg:flex lg:w-1/2 xl:w-2/3 2xl:w-3/4 h-full bg-cover" style="background-image: url('https://vojislavd.com/ta-template-demo/assets/img/auth-background.jpg');">
          <div class="w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-30">
              <div class="flex items-center justify-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 xl:h-20 xl:w-20 2xl:h-24 2xl:w-24 text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path>
                  </svg>
                  <h1 class="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-100 tracking-wider">Template</h1>
              </div>
              <p class="text-gray-300 mt-4 px-16 text-center">Free admin dashboard template created with Tailwind CSS and Alpine.js</p>
              <a href="#" class="mt-6 bg-gray-100 hover:bg-gray-200 px-6 py-2 rounded text-sm uppercase text-gray-900 transition duration-150" title="Learn More">Learn More</a>                        
          </div>
      </div>
  </div>
</div></template> -->
