<script setup lang="ts">
import { computed } from "vue";
import type { IconLink } from "./fixed/FixedMenu";
import { t } from "@/utilities/I18nPlugin";
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
  <IRow col="4" md="2">
    <ICol
      span="1"
      spanMd="1"
      spanSm="1"
      v-for="Link in LinksBase"
      :key="Link.routerName"
    >
      <router-link :to="{ name: Link.routerName }">
        <span href="" class="group relative block h-64 sm:h-50 lg:h-60">
          <span
            class="absolute inset-0 border-2 border-dashed border-black"
          ></span>

          <div
            class="relative flex h-full transform items-end border-2 border-black bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2"
          >
            <div
              class="p-4 !pt-0 transition-opacity group-hover:absolute group-hover:opacity-0 sm:p-6 lg:p-8"
            >
              <div
                title="Feature"
                class="dark:text-navIconColorHoverDark dark:hover:text-navIconColoDark hover:text-navIconColoDark text-[#444] p-4 inline-flex justify-center rounded-md smooth-hover"
              >
                <span v-html="Link.iconX" class="dark:text-content"></span>
              </div>

              <h2 class="dark:text-gray-800 mt-4 text-xl font-medium sm:text-2xl ">
                {{ Link.title }}
              </h2>
            </div>

            <div
              class="absolute p-4 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100 sm:p-6 lg:p-8"
            >
              <h3 class="dark:text-gray-700 mt-4 text-xl font-medium sm:text-2xl">
                {{ Link.title }}
              </h3>

              <p class="dark:text-gray-600 mt-4 text-sm sm:text-base">
                {{ Link.description }}
              </p>

              <p class="dark:text-gray-600 mt-8 font-bold">
                {{ t("Show") }}
              </p>
            </div>
          </div>
        </span>
      </router-link>
    </ICol>
  </IRow>
</template>
