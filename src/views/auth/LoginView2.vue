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
            isLoading.value = false;
            errs.value = getError(error.response);
            const submitBtn = document.querySelector(".submit-btn");
            submitBtn?.classList.add("invalid");
            setTimeout(() => {
                submitBtn?.classList.remove("invalid");
            }, 1000);
            setTimeout(() => {
                errs.value = '';
            }, 5000);

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
    <div class="fixed top-4 right-5 z-40">
        <PopSetting></PopSetting>
    </div>
    <div class="bg-gray-100 dark:bg-gray-900 ">
        <div class="h-20"></div>
        <div
            class="max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-800 shadow-lg p-6 mb-10">
            <div class="text-center">
                <img class="h-8 w-auto mx-auto" src="@/assets/logo-512x512.png" alt="Apple">
                <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">لوحة الدخول
                </h2>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    ليس لديك حساب؟
                    <a href="/" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300">انشاء
                        حساب
                        →</a>
                </p>
            </div>

            <Form class="space-y-6 mt-8" v-if="isLoading == false" :initial-values="loginForm" @submit="onSubmit"
                :validation-schema="schema" @invalid-submit="onInvalidSubmit">

                <TextInput v-model="loginForm.email" name="email" type="email" :label="t('E-mail')"
                    :placeholder="t('Your Email Address')" success-message="ادخل الاميل او اسم الحساب" />
                <TextInput v-model="loginForm.password" name="password" type="password" :label="t('Password')"
                    :placeholder="t('Your password')" success-message="ادخل رمز الحساب" />

                <div class="flex items-center justify-center mt-3 border border-red-600 p-4 rounded-lg"
                    v-if="errs != ''">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600 mr-2" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p class="text-red-600 text-lg font-semibold">{{ errs }}</p>
                </div>


                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember_me" type="checkbox"
                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                        <label for="remember"
                            class="ml-2 block text-sm text-gray-900 dark:text-gray-300 p-2">تذكرني</label>
                    </div>
                    <div class="text-sm ">
                        <a href="" class="font-medium  text-indigo-600 hover:text-indigo-500 dark:text-indigo-300">نسيت
                            كلمة
                            المرور؟</a>
                    </div>
                </div>

                <div>
                    <button type="submit"
                        class="inline-flex submit-btn items-center border font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 text-base bg-black font-medium text-white hover:bg-gray-800 border border-black focus:ring-black w-full justify-center">دخول</button>
                </div>
            </Form>
            <SimpleLoading v-else></SimpleLoading>
        </div>
        <div class="h-20"></div>
    </div>
</template>
<style scoped>
:root {
    --primary-color: #0071fe;
    --error-color: #f23648;
    --error-bg-color: #fddfe2;
    --success-color: #21a67a;
    --success-bg-color: #e0eee4;
}

.submit-btn {
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
    transform: scale(0.98);
}

@keyframes animate {

    0%,
    100% {
        clip-path: polygon(0% 45%, 16% 44%, 33% 50%, 54% 60%, 70% 61%, 84% 59%, 100% 52%, 100% 100%, 0% 100%);
    }

    50% {
        clip-path: polygon(0% 60%, 15% 65%, 34% 66%, 51% 62%, 67% 50%, 84% 45%, 100% 46%, 100% 100%, 0% 100%);
    }
}
</style>
