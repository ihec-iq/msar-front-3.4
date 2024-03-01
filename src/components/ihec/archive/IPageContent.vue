<template>
  <nav   v-motion :initial="{ opacity: 0, y: -155 }" :enter="{ opacity: 1, y: 0 }"
    class="rounded-t-lg relative flex w-full items-center justify-between h-full bg-white dark:bg-darkNav py-2 text-neutral-600 hover:text-neutral-700 focus:text-neutral-700 dark:text-neutral-200 md:flex-wrap md:justify-start"
    data-te-navbar-ref
    
  >
    <div class="flex w-full flex-wrap items-center justify-between px-2">
      <slot></slot>
    </div>
  </nav>
</template>
