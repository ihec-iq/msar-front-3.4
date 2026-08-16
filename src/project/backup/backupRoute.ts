import authMiddleware from "@/router/middleware/authMiddleware";

export default [
  {
    path: "/backupPortal",
    name: "backupPortal",
    component: () => import("@/project/backup/view/BackupPortalView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/backups",
    name: "backupIndex",
    component: () => import("@/project/backup/view/BackupIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/backup/create",
    name: "backupCreate",
    component: () => import("@/project/backup/view/BackupCreateView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/backup/settings",
    name: "backupSettings",
    component: () => import("@/project/backup/view/BackupSettingsView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/backup/admins",
    name: "backupAdmins",
    component: () => import("@/project/backup/view/BackupAdminsView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/backup/logs",
    name: "backupLogs",
    component: () => import("@/project/backup/view/BackupLogsView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/backup/health",
    name: "backupHealth",
    component: () => import("@/project/backup/view/BackupHealthView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/backup/:id/restore",
    name: "backupRestore",
    component: () => import("@/project/backup/view/BackupRestoreView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
