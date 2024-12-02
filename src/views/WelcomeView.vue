<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import ParticleImage from '@/components/ui/ParticleImage/ParticleImage.vue';
import { useDark, useToggle } from "@vueuse/core";
import RadiantText from "@/components/ui/RadiantText.vue";
import { useRouter } from 'vue-router';

let isDark = useDark();
const toggleDark = useToggle(isDark);

const router = useRouter();

const navigateTo = (path: string) => {
    router.push(path);
};

//#region  Code 
onMounted(async () => {
    //toggleDark();
});
//#endregion
</script>
<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <div class="flex flex-col items-center justify-center bg-transparent h-screen w-screen">
            <ParticleImage class="dark:bg-gray-200" image-src="/src/components/ui/ParticleImage/logo-512x512.png"
                :responsive-width="true" />
        </div>
        <div class="flex flex-col w-full items-center justify-center cursor-pointer" @click="navigateTo('/login')">
            <RadiantText
                class="inline-flex w-full items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400"
                :duration="5">
                <div class="text-3xl font-bold">✨ Independent High Electoral Commission</div>
            </RadiantText>
            <RadiantText
                class="inline-flex w-full  items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400"
                :duration="5">
                <div class="text-3xl font-bold">المفوظية العليا المستقلة للانتخابات</div>
            </RadiantText>
        </div>
    </div>

</template>