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
  backup_path: string;
  max_storage_mb: number;

  // Auto Backup Settings
  auto_backup_enabled: boolean;
  auto_backup_interval: number;
  auto_backup_type: "db" | "files" | "both";
  last_auto_backup_at?: string;

  // Retention Policy
  keep_daily_days: number;
  keep_weekly_weeks: number;
  keep_monthly_months: number;

  // Notification Settings
  notify_enabled: boolean;
  notify_on_success: boolean;
  notify_on_failure: boolean;
  stale_hours: number | null;
  notify_admins: boolean;

  // Email Notification
  email_enabled: boolean;
  email_recipients: string[] | null;

  // Telegram Notification
  telegram_enabled: boolean;
  telegram_bot_token: string | null;
  telegram_chat_ids: string[] | null;

  // Webhook Notification
  webhook_enabled: boolean;
  webhook_urls: string | null;
  webhook_secret: string | null;

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
  webhook_url?: string;
  notify_via: ("email" | "telegram" | "webhook")[];
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IBackupAdminCreateRequest {
  name: string;
  email: string;
  telegram_id?: string;
  webhook_url?: string;
  notify_via: string[];
  active: boolean;
}

export interface IBackupAdminUpdateRequest {
  name?: string;
  email?: string;
  telegram_id?: string;
  webhook_url?: string;
  notify_via?: string[];
  active?: boolean;
}

// ============================
// Backup Logs Interfaces
// ============================

export interface IBackupLog {
  id: number;
  type: "manual" | "auto";
  status: "success" | "failed" | "running" | "pending";
  include_files: boolean;
  total_size?: number;
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
  type?: "manual" | "auto" | "all";
  date_from?: string;
  date_to?: string;
  page?: number;
}

// ============================
// Health Check Interfaces
// ============================

export interface IBackupHealthCheck {
  status: "ok" | "error" | "warning";
  last_success_at: string;
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
