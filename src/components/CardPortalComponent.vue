<script setup lang="ts">
import { computed } from "vue";
import type { IconLink } from "./fixed/FixedMenu"; 
import ICol2 from "./ihec/ICol2.vue";
import IRow2 from "./ihec/IRow2.vue";
const props = defineProps({
  links: {
    type: Array<Object>,
    required: false,
    default: [],
  },
});
const LinksBase = computed(() => {
  return props.links as Array<IconLink>;
});
</script>

<template>
  <IRow2 :gap="5">
    <ICol2   v-for="Link in LinksBase" :key="Link.routerName">
      <router-link :to="{ name: Link.routerName }">
        <CardPortalSingleComponent :Link="Link"></CardPortalSingleComponent>
      </router-link>
    </ICol2>
  </IRow2>
</template>

<style scoped>
.animate-shake {
  animation: shake 0.5s infinite;
}

@keyframes shake {
  0%,
  100% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(-5deg);
  }

  75% {
    transform: rotate(5deg);
  }
}
</style>