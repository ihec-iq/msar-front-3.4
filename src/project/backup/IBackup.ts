// ============================
// Backup Interfaces
// ============================

export interface IBackupFile {
  path: string;
  size: number;
  lastModified: number;
  url: string | null;
  fileName?: string;
  formattedSize?: string;
  formattedDate?: string;
  type?: "db" | "files" | "both";
}

export interface IBackupRunRequest {
  backup_type?: "db" | "files" | "both";
}

export interface IBackupRunResponse {
  status: string;
  ran_at: string;
  backup_type: string;
  message?: string;
}

export interface IBackupDeleteRequest {
  path: string;
}

export interface IBackupTempLinkRequest {
  path: string;
}

export interface IBackupTempLinkResponse {
  url: string;
  expires_at: string;
}

export interface IBackupRestoreRequest {
  backup_log_id: number;
  restore_database: boolean;
  restore_files: boolean;
  verify_checksum: boolean;
}

export interface IBackupRestoreResponse {
  status: string;
  message: string;
  restored_at: string;
}

// ============================
// Settings Interfaces
// ============================

export interface IBackupSettings {
  id?: number;

  // General Settings
  enabled: boolean;
  cron: string;
  timezone: string;
  max_storage_mb: number;

  // Backup Scope
  include_files: boolean;
  include_paths: string[];
  exclude_paths: string[];
  multi_db: boolean;
  selected_databases: string[];

  // Storage Settings
  disk: "local" | "google";
  drive_folder: string;
  temp_link_expiry: number;
  checksum_enabled: boolean;

  // Notification Settings
  notify_enabled: boolean;
  notify_on: "success" | "failure" | "both";
  emails: string;
  telegram_bot_token: string;
  telegram_chat_ids: string;
  webhook_urls: string;
  webhook_secret: string;

  // Retention Policy
  keep_daily_days: number;
  keep_weekly_weeks: number;
  keep_monthly_months: number;
  keep_yearly_years: number;

  // Timestamps
  created_at?: string;
  updated_at?: string;
}

// ============================
// Admin Interfaces
// ============================

export interface IBackupAdmin {
  id?: number;
  name: string;
  email: string;
  telegram_id?: string;
  notify_via: ("email" | "telegram")[];
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IBackupAdminCreateRequest {
  name: string;
  email: string;
  telegram_id?: string;
  notify_via: string[];
  active: boolean;
}

export interface IBackupAdminUpdateRequest {
  name?: string;
  email?: string;
  telegram_id?: string;
  notify_via?: string[];
  active?: boolean;
}

// ============================
// Backup Logs Interfaces
// ============================

export interface IBackupLog {
  id: number;
  backup_type: "manual" | "auto";
  status: "success" | "failed" | "running" | "pending";
  include_files: boolean;
  size?: number;
  duration?: number;
  message?: string;
  error_details?: string;
  databases?: string[];
  files?: string[];
  checksum?: string;
  created_at: string;
  updated_at?: string;
  started_at?: string;
  completed_at?: string;
}

export interface IBackupLogFilter {
  limit?: number;
  status?: "success" | "failed" | "running" | "pending" | "all";
  backup_type?: "manual" | "auto" | "all";
  date_from?: string;
  date_to?: string;
  page?: number;
}

// ============================
// Health Check Interfaces
// ============================

export interface IBackupHealthCheck {
  overall_status: "healthy" | "warning" | "error";
  checks: {
    last_backup_success: {
      status: "pass" | "fail" | "warning";
      message: string;
      last_backup_time?: string;
    };
    disk_space: {
      status: "pass" | "fail" | "warning";
      message: string;
      available_space_mb?: number;
      used_space_mb?: number;
      percentage_used?: number;
    };
    configuration: {
      status: "pass" | "fail" | "warning";
      message: string;
      issues?: string[];
    };
    stale_backup: {
      status: "pass" | "fail" | "warning";
      message: string;
      hours_since_last_backup?: number;
    };
  };
  last_checked_at: string;
}

// ============================
// Testing Interfaces
// ============================

export interface IBackupTestEmailRequest {
  email: string;
  event?: "success" | "failure";
}

export interface IBackupTestEmailResponse {
  status: string;
  message: string;
}

// ============================
// Statistics & Dashboard Interfaces
// ============================

export interface IBackupStatistics {
  total_backups: number;
  total_size_mb: number;
  last_backup: {
    date: string;
    status: string;
    type: string;
  } | null;
  success_rate: number;
  failed_count: number;
  storage_used_percentage: number;
  backups_by_type: {
    db: number;
    files: number;
    both: number;
  };
  backups_by_date: {
    date: string;
    count: number;
    size_mb: number;
  }[];
}

// ============================
// Filter & Pagination Interfaces
// ============================

export interface IBackupFileFilter {
  search?: string;
  type?: "db" | "files" | "both" | "all";
  date_from?: string;
  date_to?: string;
  min_size_mb?: number;
  max_size_mb?: number;
  sort_by?: "name" | "size" | "date";
  sort_order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface IPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: IPaginationMeta;
}

// ============================
// UI State Interfaces
// ============================

export interface IBackupUIState {
  isLoading: boolean;
  isRunningBackup: boolean;
  isRestoring: boolean;
  currentProgress: number;
  selectedBackup: IBackupFile | null;
  showRunDialog: boolean;
  showRestoreDialog: boolean;
  showDeleteDialog: boolean;
  showSettingsDialog: boolean;
}

// ============================
// Notification Interfaces
// ============================

export interface IBackupNotification {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
}

// ============================
// Cron Expression Helper Interface
// ============================

export interface ICronExpression {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  expression: string;
  humanReadable: string;
  nextRun?: string;
}

// ============================
// Export Options Interface
// ============================

export interface IBackupExportOptions {
  format: "csv" | "json" | "pdf";
  include_logs: boolean;
  include_settings: boolean;
  date_range?: {
    from: string;
    to: string;
  };
}
