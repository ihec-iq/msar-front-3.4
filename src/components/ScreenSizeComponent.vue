<script lan="ts" setup>
// Debug info
const screenWidth = ref(0);
const currentBreakpoint = ref("xs");
const updateDebugInfo = () => {
  screenWidth.value = window.innerWidth;
  if (screenWidth.value >= 1536) currentBreakpoint.value = "xxl";
  else if (screenWidth.value >= 1280) currentBreakpoint.value = "xl";
  else if (screenWidth.value >= 1024) currentBreakpoint.value = "lg";
  else if (screenWidth.value >= 768) currentBreakpoint.value = "md";
  else if (screenWidth.value >= 640) currentBreakpoint.value = "sm";
  else currentBreakpoint.value = "xs";
};
onMounted(() => {
  updateDebugInfo();
  window.addEventListener("resize", updateDebugInfo);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateDebugInfo);
});
</script>
<template>
  <div class="debug-info">
    <h3>Debug Info</h3>
    <p>Current screen width: {{ screenWidth }}px</p>
    <p>Current breakpoint: {{ currentBreakpoint }}</p>
  </div>
</template>
<style scoped>
.debug-info {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
</style>
