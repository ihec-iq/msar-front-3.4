<script setup lang="ts">
import { onMounted } from "vue";
import PageTitle from "@/components/general/namePage.vue";
import { useI18n } from "@/stores/i18n/useI18n";
const { t } = useI18n();
import { VacationLinks } from "./VacationLinks";
import { usePermissionStore } from "@/project/user/permissionStore";
import { EnumPermission } from "@/utilities/EnumSystem";
const { checkPermissionAccessArray } = usePermissionStore();

//#region Pagination
//#endregion
onMounted(async () => {
  checkPermissionAccessArray([EnumPermission.VacationReport]);
});
</script>
<template>
  <div class="justify-between flex">
    <PageTitle> {{ t("VacationIndex") }} </PageTitle>
  </div>
  <div class="flex">
    <div class="lg:w-[95%] mb-12 lg:ml-[5%] xs:w-full md:mr-[2%]">
      <div class="w-full">
        <div class="flex flex-col">
          <div class="flex text-center self-center mt-3 col-span-3">
            <router-link
              v-for="Link in VacationLinks"
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
                      <span
                        v-html="Link.iconX"
                        class="dark:text-content"
                      ></span>
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

                    <p class="mt-8 font-bold">Move on</p>
                  </div>
                </div>
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
../VacationLinks
@/project/user/permissionStore@/utilities/EnumSystem