<template>
  <div class="w-full flex justify-between">
    <div
      class="font-bold mt-4 ml-4 cursor-default text-center rounded-xl p-2 bg-namePage dark:bg-title text-text dark:text-textLight w-64 text-xl mb-10"
    >
      <slot></slot>
    </div>
    <div class="w-[320px]"></div>
  </div>
</template>
<style scoped>
@media (max-width: 390px) {
  .w-full {
    margin-left: 80px;
  }
}
</style>
