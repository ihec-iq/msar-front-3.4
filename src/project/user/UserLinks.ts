import type { IconLink } from "@/components/fixed/FixedMenu";
import { EnumPermission } from "@/utilities/EnumSystem";
 
export const UserLinks: Array<IconLink> = [
  {
    routerName: "userPortal",
    title: "المستخدمين",
    icon: ' <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"   class="h-5 w-5 sm:h-6 sm:w-6"  viewBox="0 0 24 24"><path fill="currentColor" d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7Z"/></svg>',
    iconX:
      ' <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><path fill="currentColor" d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7Z"/></svg>',
    tab: "general1",
    description: "المستخدمين والصلاحيات",
    permissions: [EnumPermission.ShowUsers],
    isActive: true,
    children: [
      {
        routerName: "userIndex",
        title: "المستخدمين",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 20 20" fill="currentColor"  >    <path  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"    />  </svg>',
        iconX: '<svg xmlns="http://www.w3.org/2000/svg"   width="64"    height="64" viewBox="0 0 20 20" fill="currentColor"  >    <path  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"    />  </svg>',
        tab: "userPortal",
        description: "التحكم في معلومات المستخدمين",
        isActive: true,
        permissions: [EnumPermission.ShowUsers]
      },
      {
        routerName: "roleIndex",
        title: "كروبات الصلاحيات",
        icon: '<svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"    viewBox="0 0 20 20"   stroke-width="1.5"    class="w-6 h-6"  >    <path  fill="currentColor"  d="m11.9.39l1.4 1.4c1.61.19 3.5-.74 4.61.37s.18 3 .37 4.61l1.4 1.4c.39.39.39 1.02 0 1.41l-9.19 9.2c-.4.39-1.03.39-1.42 0L1.29 11c-.39-.39-.39-1.02 0-1.42l9.2-9.19a.996.996 0 0 1 1.41 0zm.58 2.25l-.58.58l4.95 4.95l.58-.58c-.19-.6-.2-1.22-.15-1.82c.02-.31.05-.62.09-.92c.12-1 .18-1.63-.17-1.98s-.98-.29-1.98-.17c-.3.04-.61.07-.92.09c-.6.05-1.22.04-1.82-.15zm4.02.93c.39.39.39 1.03 0 1.42s-1.03.39-1.42 0s-.39-1.03 0-1.42s1.03-.39 1.42 0zm-6.72.36l-.71.7L15.44 11l.7-.71zM8.36 5.34l-.7.71l6.36 6.36l.71-.7zM6.95 6.76l-.71.7l6.37 6.37l.7-.71zM5.54 8.17l-.71.71l6.36 6.36l.71-.71zM4.12 9.58l-.71.71l6.37 6.37l.71-.71z"    />  </svg>',
        iconX: '<svg    xmlns="http://www.w3.org/2000/svg"    width="64"    height="64"    viewBox="0 0 20 20"   stroke-width="1.5"    >    <path  fill="currentColor"  d="m11.9.39l1.4 1.4c1.61.19 3.5-.74 4.61.37s.18 3 .37 4.61l1.4 1.4c.39.39.39 1.02 0 1.41l-9.19 9.2c-.4.39-1.03.39-1.42 0L1.29 11c-.39-.39-.39-1.02 0-1.42l9.2-9.19a.996.996 0 0 1 1.41 0zm.58 2.25l-.58.58l4.95 4.95l.58-.58c-.19-.6-.2-1.22-.15-1.82c.02-.31.05-.62.09-.92c.12-1 .18-1.63-.17-1.98s-.98-.29-1.98-.17c-.3.04-.61.07-.92.09c-.6.05-1.22.04-1.82-.15zm4.02.93c.39.39.39 1.03 0 1.42s-1.03.39-1.42 0s-.39-1.03 0-1.42s1.03-.39 1.42 0zm-6.72.36l-.71.7L15.44 11l.7-.71zM8.36 5.34l-.7.71l6.36 6.36l.71-.7zM6.95 6.76l-.71.7l6.37 6.37l.7-.71zM5.54 8.17l-.71.71l6.36 6.36l.71-.71zM4.12 9.58l-.71.71l6.37 6.37l.71-.71z"    />  </svg>',
        tab: "userPortal",
        description: "كروبات الصلاحيات والتعديل عليها",
        isActive: true,
        permissions: [EnumPermission.ShowUsers]
      },
    ]
  }
];
