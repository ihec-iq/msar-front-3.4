<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

interface Props {
  data: Array<{ label: string; value: number }>
  title?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  height: '350',
})

const chartOptions = computed(() => ({
  chart: {
    type: 'pie',
    fontFamily: 'Cairo, sans-serif',
    toolbar: {
      show: true,
    },
  },
  labels: props.data.map(item => item.label),
  colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
  legend: {
    position: 'bottom' as const,
    horizontalAlign: 'center' as const,
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => {
      return val.toFixed(1) + '%'
    },
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 300
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
}))

const series = computed(() => props.data.map(item => item.value))
</script>

<template>
  <div>
    <VueApexCharts
      v-if="data.length > 0"
      type="pie"
      :height="height"
      :options="chartOptions"
      :series="series"
    />
    <div v-else class="flex items-center justify-center h-full text-gray-400">
      <p>لا توجد بيانات للعرض</p>
    </div>
  </div>
</template>
