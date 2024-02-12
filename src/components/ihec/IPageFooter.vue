<script setup lang="ts"></script>

<template>
  <nav
    class="rounded-b-lg relative flex w-full items-center justify-between h-10 bg-neutral-300 py-2 text-neutral-600 hover:text-neutral-700 focus:text-neutral-700 dark:bg-neutral-600 dark:text-neutral-200 md:flex-wrap md:justify-start"
    data-te-navbar-ref
  >
    <div class="flex w-full flex-wrap items-center justify-between px-3">
      <div class="flex items-center"></div>

      <div>
        <slot name="buttons"></slot>
      </div>
    </div>
  </nav>
</template>
