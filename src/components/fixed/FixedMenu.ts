import { ArchiveLinks } from "@/project/archive/ArchiveLinks";
import { EmployeeLinks } from "@/project/employee/EmployeeLinks";
import { ItemLinks } from "@/project/item/ItemLinks";
import { UserLinks } from "@/project/user/UserLinks";
import { VacationLinks } from "@/project/vacation/VacationLinks";
import { WarehouseLinks } from "@/project/warehouse/WarehouseLinks";
import { EnumPermission } from "@/utilities/EnumSystem";

export interface IconLink {
  routerName: string;
  title: string;
  icon: string;
  iconX: string;
  tab: string;
  description: string;
  permissions: Array<string>;
  isActive: boolean;
  children?: Array<IconLink>;
  mdi?: string
}

export const Links: Array<IconLink> = [
  {
    routerName: "Dashboard",
    title: "الواجهة الاساسية",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 20 20" fill="currentColor"  >    <path  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"    />  </svg>',
    iconX:
      '<svg xmlns="http://www.w3.org/2000/svg"   width="64"    height="64" viewBox="0 0 20 20" fill="currentColor"  >    <path  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"    />  </svg>',
    tab: "Dashboard",
    description:
      "البوابة الاساسية للنظام ومن خلالها تستطيع الدخول على كاف خدمات النظام",
    permissions: [EnumPermission.Dashboard],
    isActive: true,
  },
  {
    routerName: "Profile",
    title: "لوحتي الشخصية",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24"><path fill="currentColor" d="M19 4c-.6 0-1 .4-1 1v1h-1.5l-1.4-3c-.1-.2-.2-.4-.4-.5c-.5-.5-1.3-.6-2-.3l-.7.2l-.7-.3c-.7-.3-1.5-.2-2 .3c-.2.2-.3.4-.4.6L7.5 6H6V5c0-.6-.4-1-1-1s-1 .4-1 1v1c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V5c0-.5-.4-1-1-1M4 22v-3c0-2.67 5.33-4 8-4s8 1.33 8 4v3H4m14.1-1.9V19c0-.64-3.13-2.1-6.1-2.1S5.9 18.36 5.9 19v1.1h12.2M16 9v1c0 2.21-1.79 4-4 4s-4-1.79-4-4V9h2v1a2 2 0 1 0 4 0V9h2Z"/></svg>',
    iconX:
      '<svg xmlns="http://www.w3.org/2000/svg"  width="64"    height="64" viewBox="0 0 24 24"><path fill="currentColor" d="M19 4c-.6 0-1 .4-1 1v1h-1.5l-1.4-3c-.1-.2-.2-.4-.4-.5c-.5-.5-1.3-.6-2-.3l-.7.2l-.7-.3c-.7-.3-1.5-.2-2 .3c-.2.2-.3.4-.4.6L7.5 6H6V5c0-.6-.4-1-1-1s-1 .4-1 1v1c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V5c0-.5-.4-1-1-1M4 22v-3c0-2.67 5.33-4 8-4s8 1.33 8 4v3H4m14.1-1.9V19c0-.64-3.13-2.1-6.1-2.1S5.9 18.36 5.9 19v1.1h12.2M16 9v1c0 2.21-1.79 4-4 4s-4-1.79-4-4V9h2v1a2 2 0 1 0 4 0V9h2Z"/></svg>',
    tab: "Profile",
    description:
      "البوابة الاساسية للنظام ومن خلالها تستطيع الدخول على كاف خدمات النظام",
    permissions: [EnumPermission.Dashboard],
    isActive: true,
  },
  ...ArchiveLinks,
  ...ItemLinks,
  ...WarehouseLinks,
  ...EmployeeLinks,
  ...VacationLinks,
  ...UserLinks, 
  {
    routerName: "settingPortal",
    title: "الاعدادات",
    icon: ' <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"   class="h-5 w-5 sm:h-6 sm:w-6"  viewBox="0 0 24 24"><path fill="currentColor" d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7Z"/></svg>',
    iconX:
      ' <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><path fill="currentColor" d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7Z"/></svg>',
    tab: "settingPortal",
    description: "الاعدادات العامة",
    permissions: [EnumPermission.Setting],
    isActive: true,
  }
];
