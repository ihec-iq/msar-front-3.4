import type { IconLink } from "@/components/fixed/FixedMenu";
import { EnumPermission } from "@/utilities/EnumSystem";

export const SettingsLinks: Array<IconLink> = [
  {
    routerName: "settingsPortal",
    title: "الاعدادات",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    iconX:
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    tab: "settingsPortal",
    description: "الاعدادات العامة",
    permissions: [EnumPermission.ShowBackupHealth],
    isActive: true,
    children: [
      {
        routerName: "healthCheck",
        title: "حالة النظام",
        mdi: 'mdi-health-potion',
        tab: "HealthCheck",
        description: "حالة النظام العامة",
        isActive: true,
        permissions: [],
      },
      {
        routerName: "logs",
        title: "ملفات اللوج",
        mdi: 'mdi-bug-report',
        tab: "Logs",
        description: "ملفات اللوج للنظام",
        isActive: true,
        permissions: [],
      },
    ],
  },
];
