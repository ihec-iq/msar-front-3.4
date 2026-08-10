<script setup lang="ts">
import type { PropType } from "vue";
import type { IconLink } from "./fixed/FixedMenu";
import { t } from "@/utilities/I18nPlugin";
import { Icon } from "@iconify/vue";

const props = defineProps({
  Link: {
    type: Object as PropType<IconLink>,
    required: false,
    default: [],
  },
});
</script>

<template>
  <div
    class="group relative block h-64 sm:h-72 lg:h-80 w-full max-w-sm mx-auto"
  >
    <!-- Shadow/border effect -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl transform translate-x-2 translate-y-2 opacity-30"
    ></div>

    <!-- Main card -->
    <div
      class="relative flex h-full transform items-end bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-black border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-300 ease-out group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-black/20 overflow-hidden"
    >
      <!-- Animated background gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-100/50 dark:to-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      ></div>

      <!-- Default state content -->
      <div
        class="relative flex flex-col items-center justify-center w-full h-full p-6 transition-opacity duration-300 group-hover:opacity-0"
      >
        <!-- Icon container with enhanced styling -->
        <div class="relative mb-6">
          <div
            class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl transform scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500"
          ></div>
          <div
            class="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-lg transform transition-transform duration-300 group-hover:scale-110"
          >
            <span
              v-if="Link.iconX"
              v-html="Link.iconX"
              class="text-gray-700 dark:text-gray-300 text-2xl"
            ></span>
            <Icon
              v-if="Link?.mdi"
              :icon="Link?.mdi"
              class="text-gray-700 dark:text-gray-300 text-[40px]"
              :class="{
                ['text-' + Link.color]: Link?.color,
                'animate-shake': Link?.shake,
              }"
            />
          </div>
        </div>

        <!-- Title with responsive sizing -->
        <h2
          class="text-gray-700 dark:text-gray-200 font-bold text-center leading-tight transition-colors duration-300"
          :class="{
            'text-lg sm:text-xl lg:text-2xl': Link?.title?.length > 20,
            'text-xl sm:text-2xl lg:text-2xl':
              Link?.title?.length <= 20 && Link?.title?.length > 10,
            'text-2xl sm:text-2xl lg:text-2xl': Link?.title?.length <= 10,
          }"
        >
          {{ Link.title }}
        </h2>
      </div>

      <!-- Hover state content -->
      <div
        class="absolute inset-0 flex flex-col justify-between p-6 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:backdrop-blur-sm"
      >
        <!-- Top section with icon and title -->
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <div
              class="flex items-center px-2 justify-center w-12 h-12 bg-gradient-to-br from-white/80 to-gray-100/80 dark:from-gray-700/80 dark:to-gray-800/80 rounded-xl shadow-md backdrop-blur-sm"
            >
              <span
                v-if="Link.iconX"
                v-html="Link.iconX"
                class="text-gray-700 dark:text-gray-300 text-lg"
              ></span>
              <Icon
                v-if="Link?.mdi"
                :icon="Link?.mdi"
                class="text-gray-700 dark:text-gray-300 text-lg"
                :class="{
                  ['text-' + Link.color]: Link?.color,
                  'animate-shake': Link?.shake,
                }"
              />
            </div>
          </div>

          <div class="flex-1 min-w-0 px-2">
            <h3
              class="text-gray-700 dark:text-gray-200 font-bold leading-tight mb-3"
              :class="{
                'text-base sm:text-lg': Link?.title?.length > 25,
                'text-lg sm:text-xl':
                  Link?.title?.length <= 25 && Link?.title?.length > 15,
                'text-xl sm:text-2xl': Link?.title?.length <= 15,
              }"
            >
              {{ Link.title }}
            </h3>

            <!-- Description with adaptive sizing -->
            <p
              class="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-4"
              :class="{
                'text-xs sm:text-sm': Link?.description?.length > 150,
                'text-sm sm:text-base':
                  Link?.description?.length <= 150 &&
                  Link?.description?.length > 80,
                'text-base sm:text-lg': Link?.description?.length <= 80,
              }"
            >
              {{ Link.description }}
            </p>
          </div>
        </div>

        <!-- Bottom action -->
        <div
          class="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50"
        >
          <div
            class="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200"
          >
            <span>{{ t("Show") }}</span>
            <svg
              class="w-4 h-4 ml-2 transform transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>

          <!-- Optional: Add status indicator -->
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-shake {
  animation: shake 0.8s ease-in-out infinite;
}

@keyframes shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: rotate(-3deg);
  }
  20%,
  40%,
  60%,
  80% {
    transform: rotate(3deg);
  }
}

/* Line clamp utility for description */
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Backdrop blur fallback */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>
