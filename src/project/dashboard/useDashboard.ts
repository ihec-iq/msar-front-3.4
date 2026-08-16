import { ref, computed } from "vue";
import type { Ref } from "vue";
import Api from "@/api/apiConfig";
import { useToast } from "vue-toastification";

export interface DashboardOverview {
  employees: EmployeeStats;
  vacations: VacationStats;
  stock: StockStats;
  system: SystemStats;
}

export interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
  by_type: ChartData[];
  by_section: ChartData[];
}

export interface VacationStats {
  total_employees_with_vacation: number;
  total_vacation_days: number;
  total_sick_days: number;
  average_per_employee: number;
}

export interface StockStats {
  total_items: number;
  low_stock_items: number;
  out_of_stock_items: number;
  total_input_vouchers: number;
  total_output_vouchers: number;
  total_stock_value: number;
}

export interface SystemStats {
  total_users: number;
  active_users: number;
  total_archives: number;
  recent_activity_count: number;
}

export interface ChartData {
  label: string;
  value: number;
}

export interface ActivityStats {
  new_employees: number;
  new_vacations: number;
  new_archives: number;
  new_input_vouchers: number;
  new_output_vouchers: number;
}

export function useDashboard() {
  const toast = useToast();

  // State
  const overview: Ref<DashboardOverview | null> = ref(null);
  const employeeStats: Ref<EmployeeStats | null> = ref(null);
  const vacationStats: Ref<VacationStats | null> = ref(null);
  const stockStats: Ref<StockStats | null> = ref(null);
  const activityStats: Ref<ActivityStats | null> = ref(null);
  const loading = ref(false);
  const error: Ref<string | null> = ref(null);

  /**
   * Fetch complete dashboard overview
   */
  const fetchOverview = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await Api.get("/dashboard/overview");
      overview.value = response.data.data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch overview";
      toast.error("فشل في تحميل بيانات لوحة التحكم");
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch employee statistics
   */
  const fetchEmployeeStats = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await Api.get("/dashboard/employees/stats");
      employeeStats.value = response.data.data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch employee stats";
      toast.error("فشل في تحميل إحصائيات الموظفين");
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch vacation statistics
   */
  const fetchVacationStats = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await Api.get("/dashboard/vacations/stats");
      vacationStats.value = response.data.data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch vacation stats";
      toast.error("فشل في تحميل إحصائيات الإجازات");
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch vacation trends
   */
  const fetchVacationTrends = async (period: string = "month") => {
    loading.value = true;
    error.value = null;

    try {
      const response = await Api.get(
        `/dashboard/vacations/trends?period=${period}`
      );
      return response.data.data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch vacation trends";
      toast.error("فشل في تحميل اتجاهات الإجازات");
      return [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch stock statistics
   */
  const fetchStockStats = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await Api.get("/dashboard/stock/stats");
      stockStats.value = response.data.data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch stock stats";
      toast.error("فشل في تحميل إحصائيات المخزن");
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch low stock items
   */
  const fetchLowStockItems = async (threshold: number = 10) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await Api.get(
        `/dashboard/stock/low-stock?threshold=${threshold}`
      );
      return response.data.data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch low stock items";
      toast.error("فشل في تحميل المواد المنخفضة");
      return [];
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch activity statistics
   */
  const fetchActivityStats = async (period: string = "week"): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await Api.get(`/dashboard/activity?period=${period}`);
      activityStats.value = response.data.data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch activity stats";
      toast.error("فشل في تحميل إحصائيات النشاط");
    } finally {
      loading.value = false;
    }
  };

  /**
   * Invalidate dashboard cache
   */
  const invalidateCache = async (): Promise<boolean> => {
    try {
      await Api.post("/dashboard/cache/invalidate");
      toast.success("تم تحديث البيانات بنجاح");
      return true;
    } catch (err: any) {
      toast.error("فشل في تحديث البيانات");
      return false;
    }
  };

  /**
   * Refresh all dashboard data
   */
  const refreshAll = async (): Promise<void> => {
    await fetchOverview();
  };

  // Computed
  const hasData = computed(() => overview.value !== null);

  return {
    // State
    overview,
    employeeStats,
    vacationStats,
    stockStats,
    activityStats,
    loading,
    error,

    // Methods
    fetchOverview,
    fetchEmployeeStats,
    fetchVacationStats,
    fetchVacationTrends,
    fetchStockStats,
    fetchLowStockItems,
    fetchActivityStats,
    invalidateCache,
    refreshAll,

    // Computed
    hasData,
  };
}
