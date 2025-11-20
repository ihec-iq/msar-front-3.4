<script setup lang="ts">
import { ref, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

interface Props {
  data: Array<{ label: string; value: number }>
  title?: string
  height?: string
  horizontal?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  height: '350',
  horizontal: false,
})

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    fontFamily: 'Cairo, sans-serif',
    toolbar: {
      show: true,
    },
  },
  plotOptions: {
    bar: {
      horizontal: props.horizontal,
      borderRadius: 4,
      dataLabels: {
        position: 'top',
      },
    }
  },
  colors: ['#3B82F6'],
  dataLabels: {
    enabled: true,
    offsetY: props.horizontal ? 0 : -20,
    style: {
      fontSize: '12px',
      colors: ['#304758']
    }
  },
  xaxis: {
    categories: props.data.map(item => item.label),
    labels: {
      style: {
        fontSize: '12px',
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        fontSize: '12px',
      }
    }
  },
  grid: {
    borderColor: '#f1f1f1',
  }
}))

const series = computed(() => [{
  name: props.title || 'العدد',
  data: props.data.map(item => item.value)
}])
</script>

<template>
  <div>
    <VueApexCharts
      v-if="data.length > 0"
      type="bar"
      :height="height"
      :options="chartOptions"
      :series="series"
    />
    <div v-else class="flex items-center justify-center h-full text-gray-400">
      <p>لا توجد بيانات للعرض</p>
    </div>
  </div>
</template>
