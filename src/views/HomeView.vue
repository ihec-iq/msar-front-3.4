<script setup lang="ts">
import { Links } from "@/components/fixed/FixedMenu";
import { useI18n } from "@/stores/i18n/useI18n";
import { usePermissionStore } from "@/stores/permission";
import { storeToRefs } from "pinia";
import { computed } from "vue";
const { t } = useI18n();
//#region nav menu
const { permissions } = storeToRefs(usePermissionStore());
const filteredLinks = computed(() =>
  Links.filter((link) => {
    // Check if any of the link's permissions are included in userPermissions
    return link.permissions.some((permission) =>
      permissions.value.includes(permission)
    );
  })
);
// watch(nav, newSearchQuery => {
//   if(nav.value != "undefined" || nav.value != undefined ){
//     tab.value=nav.value?.toString()
//   }
// } )

//#endregion
</script>
<template>
  <div class="flex text-center self-center mt-3 col-span-3">
    <router-link
      v-for="Link in filteredLinks"
      :key="Link.routerName"
      :to="{ name: Link.routerName }"
    >
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
              <span v-html="Link.iconX"></span>
            </div>

            <h2 class="mt-4 text-xl font-medium sm:text-2xl">
              {{ Link.title }}
            </h2>
          </div>

          <div
            class="absolute p-4 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100 sm:p-6 lg:p-8"
          >
            <h3 class="mt-4 text-xl font-medium sm:text-2xl">
              {{ Link.title }}
            </h3>

            <p class="mt-4 text-sm sm:text-base">
              {{ Link.description }}
            </p>

            <p class="mt-8 font-bold">Read more</p>
          </div>
        </div>
      </span>
    </router-link>
  </div>
</template>
