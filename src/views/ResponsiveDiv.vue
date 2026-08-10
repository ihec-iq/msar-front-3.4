<template>
  <div :class="responsiveClasses" :style="customStyles">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

// Define breakpoint types
type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
type SizeValue =
  "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "full" | "auto" | number;

// Props interface
interface Props {
  // Default size (mobile-first)
  size?: SizeValue;
  // Responsive sizes for different breakpoints
  xs?: SizeValue;
  sm?: SizeValue;
  md?: SizeValue;
  lg?: SizeValue;
  xl?: SizeValue;
  xxl?: SizeValue; // Changed from '2xl' to 'xxl'
  // Additional custom styles
  customClass?: string;
  // Height settings
  height?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  size: "full",
});

// Current screen size tracking
const currentBreakpoint = ref<Breakpoint>("xs");
const screenWidth = ref(0);

// Breakpoint definitions (matching Tailwind CSS defaults)
const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

// Convert size value to percentage or specific value
const getSizeValue = (size: SizeValue): string => {
  if (typeof size === "number") {
    return `${size}px`;
  }

  switch (size) {
    case "1/4":
      return "25%";
    case "1/3":
      return "33.333333%";
    case "1/2":
      return "50%";
    case "2/3":
      return "66.666667%";
    case "3/4":
      return "75%";
    case "full":
      return "100%";
    case "auto":
      return "auto";
    default:
      return "100%";
  }
};

// Get current breakpoint based on screen width
const getCurrentBreakpoint = (width: number): Breakpoint => {
  if (width >= breakpoints.xxl) return "xxl";
  if (width >= breakpoints.xl) return "xl";
  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.md) return "md";
  if (width >= breakpoints.sm) return "sm";
  return "xs";
};

// Update screen size and breakpoint
const updateScreenSize = () => {
  screenWidth.value = window.innerWidth;
  currentBreakpoint.value = getCurrentBreakpoint(screenWidth.value);
};

// Get the appropriate size for current breakpoint
const getCurrentSize = computed((): SizeValue => {
  // Check for breakpoint-specific sizes in order of priority
  const breakpointSizes: Record<Breakpoint, SizeValue | undefined> = {
    xxl: props.xxl,
    xl: props.xl,
    lg: props.lg,
    md: props.md,
    sm: props.sm,
    xs: props.xs,
  };

  // Find the most specific breakpoint size that applies
  const breakpointOrder: Breakpoint[] = ["xxl", "xl", "lg", "md", "sm", "xs"];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint.value);

  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const breakpoint = breakpointOrder[i];
    if (breakpointSizes[breakpoint] !== undefined) {
      return breakpointSizes[breakpoint]!;
    }
  }

  // Fall back to default size
  return props.size;
});

// Computed styles
const customStyles = computed(() => {
  const styles: Record<string, string> = {
    width: getSizeValue(getCurrentSize.value),
  };

  if (props.height) {
    styles.height =
      typeof props.height === "number" ? `${props.height}px` : props.height;
  }

  if (props.minHeight) {
    styles.minHeight =
      typeof props.minHeight === "number"
        ? `${props.minHeight}px`
        : props.minHeight;
  }

  if (props.maxHeight) {
    styles.maxHeight =
      typeof props.maxHeight === "number"
        ? `${props.maxHeight}px`
        : props.maxHeight;
  }

  return styles;
});

// Computed classes
const responsiveClasses = computed(() => {
  const classes = ["responsive-div"];

  if (props.customClass) {
    classes.push(props.customClass);
  }

  return classes.join(" ");
});

// Lifecycle hooks
onMounted(() => {
  updateScreenSize();
  window.addEventListener("resize", updateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenSize);
});

// Expose current breakpoint for parent components if needed
defineExpose({
  currentBreakpoint,
  screenWidth,
  getCurrentSize,
});
</script>

<style scoped>
.responsive-div {
  transition: width 0.2s ease-in-out;
  box-sizing: border-box;
}
</style>
