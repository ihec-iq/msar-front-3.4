<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDashboard } from '../useDashboard'
import StatCard from '../components/StatCard.vue'
import ChartCard from '../components/ChartCard.vue'
import PieChart from '../components/PieChart.vue'
import BarChart from '../components/BarChart.vue'

const {
  overview,
  loading,
  fetchOverview,
  invalidateCache,
} = useDashboard()

const refreshing = ref(false)

onMounted(async () => {
  await fetchOverview()
})

const handleRefresh = async () => {
  refreshing.value = true
  await invalidateCache()
  await fetchOverview()
  refreshing.value = false
}
</script>

<template>
  <div class="dashboard-container p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">لوحة التحكم</h1>
      <button @click="handleRefresh" :disabled="refreshing"
        class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
        <i :class="['mdi mdi-refresh', { 'animate-spin': refreshing }]"></i>
        <span>تحديث البيانات</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !overview" class="flex justify-center items-center h-64">
      <div class="text-center">
        <i class="mdi mdi-loading mdi-spin text-4xl text-blue-500 mb-2"></i>
        <p class="text-gray-600">جاري تحميل البيانات...</p>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="overview" class="space-y-6">
      <!-- Employee Statistics -->
      <section>
        <h2 class="text-xl font-semibold text-gray-700 mb-4">إحصائيات الموظفين</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="إجمالي الموظفين" :value="overview.employees.total" icon="mdi-account-group" color="blue" />
          <StatCard title="الموظفون النشطون" :value="overview.employees.active" icon="mdi-account-check"
            color="green" />
          <StatCard title="الموظفون غير النشطين" :value="overview.employees.inactive" icon="mdi-account-off"
            color="red" />
          <StatCard title="الأقسام" :value="overview.employees.by_section.length" icon="mdi-office-building"
            color="purple" />
        </div>

        <!-- Employee Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="الموظفون حسب النوع">
            <PieChart :data="overview.employees.by_type" />
          </ChartCard>
          <ChartCard title="الموظفون حسب القسم">
            <BarChart :data="overview.employees.by_section.slice(0, 10)" horizontal />
          </ChartCard>
        </div>
      </section>

      <!-- Vacation Statistics -->
      <section>
        <h2 class="text-xl font-semibold text-gray-700 mb-4">إحصائيات الإجازات</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="الموظفون مع إجازات" :value="overview.vacations.total_employees_with_vacation"
            icon="mdi-calendar-check" color="blue" />
          <StatCard title="إجمالي أيام الإجازات" :value="overview.vacations.total_vacation_days"
            icon="mdi-calendar-multiple" color="green" />
          <StatCard title="الإجازات المرضية" :value="overview.vacations.total_sick_days" icon="mdi-medical-bag"
            color="red" />
          <StatCard title="المتوسط لكل موظف" :value="overview.vacations.average_per_employee"
            icon="mdi-chart-box-outline" color="purple" />
        </div>
      </section>

      <!-- Stock Statistics -->
      <section>
        <h2 class="text-xl font-semibold text-gray-700 mb-4">إحصائيات المخزن</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="إجمالي المواد" :value="overview.stock.total_items" icon="mdi-package-variant" color="blue" />
          <StatCard title="مواد منخفضة المخزون" :value="overview.stock.low_stock_items" icon="mdi-alert"
            color="yellow" />
          <StatCard title="مواد نفذت" :value="overview.stock.out_of_stock_items" icon="mdi-alert-circle" color="red" />
          <StatCard title="سندات الإدخال" :value="overview.stock.total_input_vouchers" icon="mdi-arrow-down-bold-box"
            color="green" />
          <StatCard title="سندات الصرف" :value="overview.stock.total_output_vouchers" icon="mdi-arrow-up-bold-box"
            color="purple" />
          <StatCard title="قيمة المخزون" :value="`${overview.stock.total_stock_value.toLocaleString('ar-EG')} د.ع`"
            icon="mdi-currency-usd" color="blue" />
        </div>
      </section>

      <!-- System Statistics -->
      <section>
        <h2 class="text-xl font-semibold text-gray-700 mb-4">إحصائيات النظام</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="إجمالي المستخدمين" :value="overview.system.total_users" icon="mdi-account-multiple"
            color="blue" />
          <StatCard title="المستخدمون النشطون" :value="overview.system.active_users" icon="mdi-account-check-outline"
            color="green" />
          <StatCard title="الأرشيف" :value="overview.system.total_archives" icon="mdi-archive" color="purple" />
          <StatCard title="النشاط الأخير (7 أيام)" :value="overview.system.recent_activity_count"
            icon="mdi-clock-outline" color="yellow" />
        </div>
      </section>
    </div>

    <!-- Error State -->
    <div v-else class="flex justify-center items-center h-64">
      <div class="text-center">
        <i class="mdi mdi-alert-circle text-4xl text-red-500 mb-2"></i>
        <p class="text-gray-600">حدث خطأ في تحميل البيانات</p>
        <button @click="fetchOverview" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          إعادة المحاولة
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  direction: rtl;
}
</style>
