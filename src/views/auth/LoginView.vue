<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
// import Footer from "@/components/login/footer.vue";
import { Form } from "vee-validate";
import * as Yup from "yup";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { getError } from "@/utilities/helpers";
import TextInput from "@/components/general/TextInputGeneral.vue";
import { t, setLocale, Languages } from "@/utilities/I18nPlugin";
import { useConfigStore } from "@/stores/configStore";
import { storeToRefs } from "pinia";
import Swal from "sweetalert2";
import SimpleLoading from "@/components/general/SimpleLoading.vue";
import { useDark, useToggle, useColorMode } from "@vueuse/core";
import { useRtlStore } from "@/stores/i18n/rtlPi";
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
const { Config } = storeToRefs(useConfigStore());
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
      isLoading.value = false;
      errs.value = getError(error.response);
    });
  isLoading.value = false;
};
onMounted(async () => {
  if (authStore.isAuthenticated) router.push({ name: "Dashboard" });
  await useConfigStore()
    .load()
    .then(() => {
      if (Config.value.connectionString == null ||  Config.value.connectionString == "") {
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
                success-message="ادخل الاميل او اسم الحساب"
              />
              <TextInput
                v-model="loginForm.password"
                name="password"
                type="password"
                :label="t('Password')"
                :placeholder="t('Your password')"
                success-message="ادخل رمز الحساب"
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
          background-image: url(&quot;http://front-end-noobs.com/jecko/img/wave-top.png&quot;);
        "
      ></div>
    </div>
    <div class="waveWrapperInner bgMiddle">
      <div
        class="wave waveMiddle"
        style="
          background-image: url(&quot;http://front-end-noobs.com/jecko/img/wave-mid.png&quot;);
        "
      ></div>
    </div>
    <div class="waveWrapperInner bgBottom">
      <div
        class="wave waveBottom"
        style="
          background-image: url(&quot;http://front-end-noobs.com/jecko/img/wave-bot.png&quot;);
        "
      ></div>
    </div>
  </div>
  <div class="fixed top-4 right-5 z-40">
    <PopSetting></PopSetting>
  </div>
</template>

<style>
:root {
  --primary-color: #0071fe;
  --error-color: #f23648;
  --error-bg-color: #fddfe2;
  --success-color: #21a67a;
  --success-bg-color: #e0eee4;
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