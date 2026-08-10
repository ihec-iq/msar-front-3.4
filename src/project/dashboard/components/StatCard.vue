<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";

interface Props {
  title: string;
  value: number | string;
  icon?: string;
  color?: string;
  trend?: number;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  icon: "mdi-chart-line",
  color: "blue",
  loading: false,
});

const cardClass = computed(() => {
  const baseClass =
    "bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow";
  return baseClass;
});

const iconColor = computed(() => {
  const colors: Record<string, string> = {
    blue: "text-blue-500",
    green: "text-green-500",
    red: "text-red-500",
    yellow: "text-yellow-500",
    purple: "text-purple-500",
  };
  return colors[props.color] || colors.blue;
});

const trendClass = computed(() => {
  if (!props.trend) return "";
  return props.trend > 0 ? "text-green-600" : "text-red-600";
});

const trendIcon = computed(() => {
  if (!props.trend) return "";
  return props.trend > 0 ? "mdi:trending-up" : "mdi:trending-down";
});

const mainIcon = computed(() => {
  // Convert mdi-icon-name to mdi:icon-name format
  return props.icon.startsWith("mdi:")
    ? props.icon
    : `mdi:${props.icon.replace("mdi-", "")}`;
});
</script>

<template>
  <div :class="cardClass">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm text-gray-600 mb-1">{{ title }}</p>
        <div v-if="loading" class="animate-pulse">
          <div class="h-8 bg-gray-200 rounded w-24"></div>
        </div>
        <p v-else class="text-3xl font-bold text-gray-900">
          {{
            typeof value === "number" ? value.toLocaleString("ar-EG") : value
          }}
        </p>

        <div v-if="trend" class="flex items-center mt-2" :class="trendClass">
          <Icon :icon="trendIcon" class="text-sm ml-1" />
          <span class="text-sm font-medium">{{ Math.abs(trend) }}%</span>
        </div>
      </div>

      <div class="mr-4">
        <div
          class="w-12 h-12 rounded-full bg-opacity-10 flex items-center justify-center"
          :class="`bg-${color}-500`"
        >
          <Icon :icon="mainIcon" class="text-2xl" :class="iconColor" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional styling if needed */
</style>
