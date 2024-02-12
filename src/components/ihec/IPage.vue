<script setup lang="ts"></script>
<template>
  <div class="container mx-auto px-10 py-5">
    <slot name="header"></slot>
    <div class="bg-slate-50 dark:bg-slate-800">
      <slot name="content"></slot>
    </div>
    <slot name="footer"></slot>
  </div>
</template>
