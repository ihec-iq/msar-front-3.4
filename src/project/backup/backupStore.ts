import { ref, computed } from "vue";
import { defineStore } from "pinia";
import Api from "@/api/apiConfig";
import type {
  IBackupFile,
  IBackupRunRequest,
  IBackupRunResponse,
  IBackupSettings,
  IBackupAdmin,
  IBackupAdminCreateRequest,
  IBackupAdminUpdateRequest,
  IBackupLog,
  IBackupLogFilter,
  IBackupHealthCheck,
  IBackupTestEmailRequest,
  IBackupRestoreRequest,
  IBackupTempLinkRequest,
  IBackupStatistics,
  IBackupFileFilter,
} from "./IBackup";

export const useBackupStore = defineStore("backupStore", () => {
  // ============================
  // State
  // ============================

  // Backup Files State
  const backupFiles = ref<IBackupFile[]>([]);
  const selectedBackupFile = ref<IBackupFile | null>(null);
  const isLoadingBackups = ref(false);

  // Settings State
  const settings = ref<IBackupSettings>({
    enabled: false,
    cron: "0 2 * * *",
    timezone: "Asia/Baghdad",
    max_storage_mb: 10240,
    include_files: true,
    include_paths: [],
    exclude_paths: [],
    multi_db: false,
    selected_databases: [],
    disk: "local",
    drive_folder: "",
    temp_link_expiry: 60,
    checksum_enabled: true,
    notify_enabled: false,
    notify_on: "both",
    emails: "",
    telegram_bot_token: "",
    telegram_chat_ids: "",
    webhook_urls: "",
    webhook_secret: "",
    keep_daily_days: 7,
    keep_weekly_weeks: 4,
    keep_monthly_months: 6,
    keep_yearly_years: 1,
    email_enabled: false,
    telegram_enabled: false,
    webhook_enabled: false
  });
  const isLoadingSettings = ref(false);

  // Admins State
  const admins = ref<IBackupAdmin[]>([]);
  const selectedAdmin = ref<IBackupAdmin | null>(null);
  const isLoadingAdmins = ref(false);

  // Logs State
  const logs = ref<IBackupLog[]>([]);
  const selectedLog = ref<IBackupLog | null>(null);
  const isLoadingLogs = ref(false);

  // Health State
  const healthCheck = ref<IBackupHealthCheck | null>(null);
  const isLoadingHealth = ref(false);

  // Statistics State
  const statistics = ref<IBackupStatistics | null>(null);
  const isLoadingStatistics = ref(false);

  // UI State
  const isRunningBackup = ref(false);
  const isRestoring = ref(false);
  const backupProgress = ref(0);

  // API Base Paths
  const pathBase = "/backup";
  const pathSettings = `${pathBase}/settings`;
  const pathAdmins = `${pathBase}/admins`;
  const pathHealth = `/health/backup`;

  // ============================
  // Computed Properties
  // ============================

  const totalBackups = computed(() => backupFiles.value.length);

  const totalSizeMB = computed(() => {
    return backupFiles.value.reduce((sum, file) => sum + (file.size || 0), 0) / (1024 * 1024);
  });

  const lastBackup = computed(() => {
    if (backupFiles.value.length === 0) return null;
    return backupFiles.value.reduce((latest, current) => {
      return (current.lastModified || 0) > (latest.lastModified || 0) ? current : latest;
    });
  });

  const activeAdmins = computed(() => {
    return admins.value.filter((admin) => admin.active);
  });

  const recentLogs = computed(() => {
    return logs.value.slice(0, 10);
  });

  // ============================
  // Backup Operations
  // ============================

  /**
   * Get list of all backup files
   */
  async function getBackupList() {
    isLoadingBackups.value = true;
    try {
      const response = await Api.get(`${pathBase}/list`);
      backupFiles.value = response.data.data || response.data || [];
      return response;
    } catch (error) {
      console.error("Error fetching backup list:", error);
      throw error;
    } finally {
      isLoadingBackups.value = false;
    }
  }

  /**
   * Get filtered backup list
   */
  async function getBackupListFiltered(filters: IBackupFileFilter) {
    isLoadingBackups.value = true;
    try {
      const response = await Api.get(`${pathBase}/list`, { params: filters });
      backupFiles.value = response.data.data || response.data || [];
      return response;
    } catch (error) {
      console.error("Error fetching filtered backup list:", error);
      throw error;
    } finally {
      isLoadingBackups.value = false;
    }
  }

  /**
   * Run a new backup
   */
  async function runBackup(params: IBackupRunRequest = {}) {
    isRunningBackup.value = true;
    backupProgress.value = 0;
    try {
      const response = await Api.post<IBackupRunResponse>(`${pathBase}/run`, params);

      // Refresh the backup list after successful run
      if (response.data.status === "ok") {
        await getBackupList();
      }

      return response;
    } catch (error) {
      console.error("Error running backup:", error);
      throw error;
    } finally {
      isRunningBackup.value = false;
      backupProgress.value = 100;
    }
  }

  /**
   * Delete a single backup file
   */
  async function deleteBackup(path: string) {
    try {
      const response = await Api.delete(`${pathBase}/delete`, {
        data: { path },
      });

      // Remove from local state
      backupFiles.value = backupFiles.value.filter((file) => file.path !== path);

      return response;
    } catch (error) {
      console.error("Error deleting backup:", error);
      throw error;
    }
  }

  /**
   * Delete all backup files
   */
  async function deleteAllBackups() {
    try {
      const response = await Api.delete(`${pathBase}/delete_all`);

      // Clear local state
      backupFiles.value = [];

      return response;
    } catch (error) {
      console.error("Error deleting all backups:", error);
      throw error;
    }
  }

  /**
   * Delete all backups by logs
   */
  async function deleteAllBackupsByLogs() {
    try {
      const response = await Api.delete(`${pathBase}/deleteAllByLogs`);

      // Refresh the list
      await getBackupList();

      return response;
    } catch (error) {
      console.error("Error deleting backups by logs:", error);
      throw error;
    }
  }

  /**
   * Get temporary download link for a backup file
   */
  async function getTempDownloadLink(path: string) {
    try {
      const response = await Api.post(`${pathBase}/temp-link`, { path });
      return response;
    } catch (error) {
      console.error("Error getting temp link:", error);
      throw error;
    }
  }

  /**
   * Restore a backup
   */
  async function restoreBackup(params: IBackupRestoreRequest) {
    isRestoring.value = true;
    try {
      const response = await Api.post(`${pathBase}/restore`, params);
      return response;
    } catch (error) {
      console.error("Error restoring backup:", error);
      throw error;
    } finally {
      isRestoring.value = false;
    }
  }

  // ============================
  // Settings Operations
  // ============================

  /**
   * Get backup settings
   */
  async function getSettings() {
    isLoadingSettings.value = true;
    try {
      const response = await Api.get(pathSettings);
      settings.value = response.data.data || response.data;
      return response;
    } catch (error) {
      console.error("Error fetching settings:", error);
      throw error;
    } finally {
      isLoadingSettings.value = false;
    }
  }

  /**
   * Update backup settings
   */
  async function updateSettings(params: Partial<IBackupSettings>) {
    isLoadingSettings.value = true;
    try {
      const response = await Api.put(pathSettings, params);
      settings.value = { ...settings.value, ...(response.data.data || response.data) };
      return response;
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    } finally {
      isLoadingSettings.value = false;
    }
  }

  // ============================
  // Admins Operations
  // ============================

  /**
   * Get all admins
   */
  async function getAdmins() {
    isLoadingAdmins.value = true;
    try {
      const response = await Api.get(pathAdmins);
      admins.value = response.data.data || response.data || [];
      return response;
    } catch (error) {
      console.error("Error fetching admins:", error);
      throw error;
    } finally {
      isLoadingAdmins.value = false;
    }
  }

  /**
   * Create a new admin
   */
  async function createAdmin(params: IBackupAdminCreateRequest) {
    try {
      const response = await Api.post(pathAdmins, params);

      // Add to local state
      if (response.data) {
        admins.value.push(response.data);
      }

      return response;
    } catch (error) {
      console.error("Error creating admin:", error);
      throw error;
    }
  }

  /**
   * Update an admin
   */
  async function updateAdmin(id: number, params: IBackupAdminUpdateRequest) {
    try {
      const response = await Api.put(`${pathAdmins}/${id}`, params);

      // Update local state
      const index = admins.value.findIndex((admin) => admin.id === id);
      const updatedAdmin = response.data.data || response.data;
      if (index !== -1 && updatedAdmin) {
        admins.value[index] = updatedAdmin;
      }

      return response;
    } catch (error) {
      console.error("Error updating admin:", error);
      throw error;
    }
  }

  /**
   * Delete an admin
   */
  async function deleteAdmin(id: number) {
    try {
      const response = await Api.delete(`${pathAdmins}/${id}`);

      // Remove from local state
      admins.value = admins.value.filter((admin) => admin.id !== id);

      return response;
    } catch (error) {
      console.error("Error deleting admin:", error);
      throw error;
    }
  }

  // ============================
  // Health Check Operations
  // ============================

  /**
   * Get health check status
   */
  async function getHealthCheck() {
    isLoadingHealth.value = true;
    try {
      const response = await Api.get(pathHealth);
      healthCheck.value = response.data.data || response.data;
      return response;
    } catch (error) {
      console.error("Error fetching health check:", error);
      throw error;
    } finally {
      isLoadingHealth.value = false;
    }
  }

  // ============================
  // Testing Operations
  // ============================

  /**
   * Send test email
   */
  async function sendTestEmail(params: IBackupTestEmailRequest) {
    try {
      const response = await Api.post(`${pathBase}/test-email`, params);
      return response;
    } catch (error) {
      console.error("Error sending test email:", error);
      throw error;
    }
  }

  /**
   * Preview email in browser
   */
  async function previewEmail(event: "success" | "failure" = "success") {
    try {
      const response = await Api.get(`${pathBase}/preview-email`, {
        params: { event },
      });
      return response;
    } catch (error) {
      console.error("Error previewing email:", error);
      throw error;
    }
  }

  // ============================
  // Logs Operations (if needed)
  // ============================

  /**
   * Get backup logs
   */
  async function getBackupLogs(filters?: IBackupLogFilter) {
    isLoadingLogs.value = true;
    try {
      const response = await Api.get(`${pathBase}/logs`, { params: filters });
      console.log("BackupLogs API Response:", response.data);
      logs.value = response.data.data || response.data || [];
      console.log("Logs value after assignment:", logs.value);
      return response;
    } catch (error) {
      console.error("Error fetching backup logs:", error);
      throw error;
    } finally {
      isLoadingLogs.value = false;
    }
  }

  /**
   * Get single backup log details
   */
  async function getBackupLog(id: number) {
    try {
      const response = await Api.get(`${pathBase}/logs/${id}`);
      selectedLog.value = response.data;
      return response;
    } catch (error) {
      console.error("Error fetching backup log:", error);
      throw error;
    }
  }

  // ============================
  // Statistics Operations
  // ============================

  /**
   * Get backup statistics for dashboard
   */
  async function getStatistics() {
    isLoadingStatistics.value = true;
    try {
      const response = await Api.get(`${pathBase}/statistics`);
      statistics.value = response.data;
      return response;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw error;
    } finally {
      isLoadingStatistics.value = false;
    }
  }

  // ============================
  // Utility Functions
  // ============================

  /**
   * Reset settings to default
   */
  const resetSettings = () => {
    settings.value = {
      enabled: false,
      cron: "0 2 * * *",
      timezone: "Asia/Baghdad",
      max_storage_mb: 10240,
      include_files: true,
      include_paths: [],
      exclude_paths: [],
      multi_db: false,
      selected_databases: [],
      disk: "local",
      drive_folder: "",
      temp_link_expiry: 60,
      checksum_enabled: true,
      notify_enabled: false,
      notify_on: "both",
      emails: "",
      telegram_bot_token: "",
      telegram_chat_ids: "",
      webhook_urls: "",
      webhook_secret: "",
      keep_daily_days: 7,
      keep_weekly_weeks: 4,
      keep_monthly_months: 6,
      keep_yearly_years: 1,
      email_enabled: false,
      telegram_enabled: false,
      webhook_enabled: false
    };
  };

  /**
   * Clear selected backup file
   */
  const clearSelectedBackup = () => {
    selectedBackupFile.value = null;
  };

  /**
   * Clear selected admin
   */
  const clearSelectedAdmin = () => {
    selectedAdmin.value = null;
  };

  /**
   * Set selected backup file
   */
  const setSelectedBackup = (file: IBackupFile) => {
    selectedBackupFile.value = file;
  };

  /**
   * Set selected admin
   */
  const setSelectedAdmin = (admin: IBackupAdmin) => {
    selectedAdmin.value = admin;
  };

  // ============================
  // Return Store
  // ============================

  return {
    // State
    backupFiles,
    selectedBackupFile,
    isLoadingBackups,
    settings,
    isLoadingSettings,
    admins,
    selectedAdmin,
    isLoadingAdmins,
    logs,
    selectedLog,
    isLoadingLogs,
    healthCheck,
    isLoadingHealth,
    statistics,
    isLoadingStatistics,
    isRunningBackup,
    isRestoring,
    backupProgress,

    // Computed
    totalBackups,
    totalSizeMB,
    lastBackup,
    activeAdmins,
    recentLogs,

    // Backup Actions
    getBackupList,
    getBackupListFiltered,
    runBackup,
    deleteBackup,
    deleteAllBackups,
    deleteAllBackupsByLogs,
    getTempDownloadLink,
    restoreBackup,

    // Settings Actions
    getSettings,
    updateSettings,

    // Admins Actions
    getAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,

    // Health Actions
    getHealthCheck,

    // Testing Actions
    sendTestEmail,
    previewEmail,

    // Logs Actions
    getBackupLogs,
    getBackupLog,

    // Statistics Actions
    getStatistics,

    // Utility Actions
    resetSettings,
    clearSelectedBackup,
    clearSelectedAdmin,
    setSelectedBackup,
    setSelectedAdmin,
  };
});
