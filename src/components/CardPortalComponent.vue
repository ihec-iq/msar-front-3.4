<script setup lang="ts">
import { computed } from "vue";
import type { IconLink } from "./fixed/FixedMenu";
// The CardPortalSingleComponent is the visual representation of your link.
// It will be placed inside the Material Design card container.
import CardPortalSingleComponent from "./CardPortalSingleComponent.vue"; // Assuming path

const props = defineProps({
  links: {
    type: Array as () => IconLink[],
    required: false,
    default: () => [],
  },
});

const LinksBase = computed(() => {
  return props.links;
});
import { ref, onMounted, onUnmounted } from "vue";

const columns = ref(1);

const updateColumns = () => {
  const width = window.innerWidth;
  if (width < 640) columns.value = 1;
  else if (width < 768) columns.value = 2;
  else if (width < 1024) columns.value = 3;
  else if (width < 1280) columns.value = 4;
  else columns.value = 5;
};

onMounted(() => {
  updateColumns();
  window.addEventListener("resize", updateColumns);
});
onUnmounted(() => window.removeEventListener("resize", updateColumns));

</script>

<template>
  <div class=" w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 p-4 md:p-6">
    <router-link v-for="link in LinksBase" :key="link.routerName" :to="{ name: link.routerName }" class="
      relative block overflow-hidden rounded-2xl
      bg-neutral-50 dark:bg-neutral-800
      shadow-sm
      transition-all duration-200 ease-out
      hover:shadow-md hover:-translate-y-1
      active:scale-[0.98] active:duration-100
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400
    ">
      <CardPortalSingleComponent :Link="link" />

      <div class="
        absolute inset-0
        bg-black
        opacity-0
        transition-opacity
        duration-200
        hover:opacity-[0.05]
        active:opacity-[0.08]
      "></div>
    </router-link>
  </div>

</template>

<style scoped>
/* The 'jiggle' animation is no longer needed for this cleaner Material Design feel. */
</style>