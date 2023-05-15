<script setup lang="ts">
const props = defineProps({
  header: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
});
</script>
<template>
  <table
    v-motion
    :initial="{ opacity: 0, y: -15 }"
    :enter="{ opacity: 1, y: 0 }"
    :variants="{ custom: { scale: 2 } }"
    :delay="200"
    class="min-w-full text-center rounded-md"
  >
    <thead class="dark:bg-tableHead bg-LightTableHead">
      <tr>
        <th
          scope="col"
          class="text-lg font-medium text-text dark:text-textLight px-6 py-4"
        >
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody
      class="dark:bg-designTableHead bg-LightTableHead text-text dark:text-textLight"
    >
      <tr
        v-for="(row, index) in rows"
        :key="index"
        v-motion
        :initial="{ opacity: 0.5, y: -5 }"
        :enter="{ opacity: 1, y: 0 }"
        :variants="{ custom: { scale: 2 } }"
        :delay="200"
        class="duration-300 border-t border-gray-500"
      >
        <td class="ont-light px-6 py-4 whitespace-nowrap">{{ row }}</td>
      </tr>
    </tbody>
  </table>
</template>
