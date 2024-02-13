<script setup lang="ts"></script>
<template>
  <div class="container mx-auto p-3">
    <slot name="header"></slot>
    <div class="bg-slate-50 dark:bg-slate-800">
      <slot name="content"></slot>
      <slot name="footer"></slot>
    </div>
  </div>
</template>
