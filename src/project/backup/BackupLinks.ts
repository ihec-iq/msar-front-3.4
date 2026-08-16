import type { IconLink } from "@/components/fixed/FixedMenu";
import { EnumPermission } from "@/utilities/EnumSystem";

export const BackupLinks: Array<IconLink> = [
  {
    routerName: "backupPortal",
    title: "النسخ الاحتياطي",
    mdi: "mdi-backup",
    tab: "backupPortal",
    description: "نظام إدارة النسخ الاحتياطي",
    permissions: [EnumPermission.ShowBackups],
    isActive: true,
    children: [
      {
        routerName: "backupIndex",
        title: "قائمة النسخ الاحتياطية",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
        iconX:
          '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
        tab: "backupPortal",
        description: "عرض وإدارة النسخ الاحتياطية",
        permissions: [EnumPermission.ShowBackups],
        isActive: true,
      },
      {
        routerName: "backupCreate",
        title: "إنشاء نسخة احتياطية",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
        iconX:
          '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
        tab: "backupPortal",
        description: "إنشاء نسخة احتياطية جديدة",
        permissions: [EnumPermission.CreateBackup],
        isActive: true,
      },
      {
        routerName: "backupSettings",
        title: "إعدادات النظام",
        mdi: "mdi-settings",
        tab: "backupPortal",
        description: "إعدادات النسخ الاحتياطي",
        permissions: [EnumPermission.ManageBackupSettings],
        isActive: true,
      },
      {
        routerName: "backupAdmins",
        title: "إدارة المسؤولين",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        iconX:
          '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        tab: "backupPortal",
        description: "إدارة المسؤولين عن النسخ الاحتياطي",
        permissions: [EnumPermission.ManageBackupAdmins],
        isActive: true,
      },
      {
        routerName: "backupLogs",
        title: "السجلات",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
        iconX:
          '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
        tab: "backupPortal",
        description: "سجلات النسخ الاحتياطي",
        permissions: [EnumPermission.ShowBackupLogs],
        isActive: true,
      },
      {
        routerName: "backupHealth",
        title: "حالة النظام",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
        iconX:
          '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
        tab: "backupPortal",
        description: "حالة وصحة نظام النسخ الاحتياطي",
        permissions: [EnumPermission.ShowBackupHealth],
        isActive: true,
      },
    ],
  },
];
