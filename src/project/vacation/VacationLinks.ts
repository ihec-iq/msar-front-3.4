import type { IconLink } from "@/components/fixed/FixedMenu";
import { EnumPermission } from "@/utilities/EnumSystem";

export const VacationLinks: Array<IconLink> = [
  {
    routerName: "vacationPortal",
    title: "الاجازات",
    icon: ' <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"   class="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24"><path fill="currentColor" d="M9.29 3.25L5.16 6.72L4 5.34l4.14-3.47l1.15 1.38M22 5.35l-1.16 1.38l-4.14-3.48l1.16-1.38L22 5.35M13 4a8 8 0 0 1 8 8a8 8 0 0 1-8 8a8 8 0 0 1-8-8a8 8 0 0 1 8-8m0 2a6 6 0 0 0-6 6a6 6 0 0 0 6 6a6 6 0 0 0 6-6a6 6 0 0 0-6-6m-1 1.5h1.5v4.53l3.22 1.47l-.62 1.36L12 13V7.5M1 14c0-2.5 1.13-4.7 2.91-6.17A9.975 9.975 0 0 0 3 12l.06 1.13L3 14c0 2.28 1.27 4.26 3.14 5.28c1.3 1.22 2.93 2.11 4.75 2.5c-.61.14-1.24.22-1.89.22a8 8 0 0 1-8-8Z"/></svg>',
    iconX:
      ' <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><path fill="currentColor" d="M9.29 3.25L5.16 6.72L4 5.34l4.14-3.47l1.15 1.38M22 5.35l-1.16 1.38l-4.14-3.48l1.16-1.38L22 5.35M13 4a8 8 0 0 1 8 8a8 8 0 0 1-8 8a8 8 0 0 1-8-8a8 8 0 0 1 8-8m0 2a6 6 0 0 0-6 6a6 6 0 0 0 6 6a6 6 0 0 0 6-6a6 6 0 0 0-6-6m-1 1.5h1.5v4.53l3.22 1.47l-.62 1.36L12 13V7.5M1 14c0-2.5 1.13-4.7 2.91-6.17A9.975 9.975 0 0 0 3 12l.06 1.13L3 14c0 2.28 1.27 4.26 3.14 5.28c1.3 1.22 2.93 2.11 4.75 2.5c-.61.14-1.24.22-1.89.22a8 8 0 0 1-8-8Z"/></svg>',
    tab: "vacationPortal",
    description: "الاجازات الزمنية والدورية والمرضية الخاصة بالموظفين",
    permissions: [EnumPermission.VacationCenter, EnumPermission.VacationOffice],
    isActive: true,
    children: [
      {
        routerName: "vacationReport",
        title: "ارصدة الموظفين",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 20 20" fill="currentColor"  >    <path  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"    />  </svg>',
        iconX:
          '<svg xmlns="http://www.w3.org/2000/svg"   width="64"    height="64" viewBox="0 0 20 20" fill="currentColor"  >    <path  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"    />  </svg>',
        tab: "vacationPortal",
        description:
          "البوابة الاساسية للنظام ومن خلالها تستطيع الدخول على كاف خدمات النظام",
        isActive: true,
        permissions: [EnumPermission.ShowVacationsDaily, EnumPermission.ShowVacationsTime, EnumPermission.ShowVacationsSick]
      },
      {
        routerName: "vacationTimeIndex",
        title: "اجازة زمنية",
        icon: '<svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"    viewBox="0 0 20 20"   stroke-width="1.5"    class="w-6 h-6"  >    <path  fill="currentColor"  d="m11.9.39l1.4 1.4c1.61.19 3.5-.74 4.61.37s.18 3 .37 4.61l1.4 1.4c.39.39.39 1.02 0 1.41l-9.19 9.2c-.4.39-1.03.39-1.42 0L1.29 11c-.39-.39-.39-1.02 0-1.42l9.2-9.19a.996.996 0 0 1 1.41 0zm.58 2.25l-.58.58l4.95 4.95l.58-.58c-.19-.6-.2-1.22-.15-1.82c.02-.31.05-.62.09-.92c.12-1 .18-1.63-.17-1.98s-.98-.29-1.98-.17c-.3.04-.61.07-.92.09c-.6.05-1.22.04-1.82-.15zm4.02.93c.39.39.39 1.03 0 1.42s-1.03.39-1.42 0s-.39-1.03 0-1.42s1.03-.39 1.42 0zm-6.72.36l-.71.7L15.44 11l.7-.71zM8.36 5.34l-.7.71l6.36 6.36l.71-.7zM6.95 6.76l-.71.7l6.37 6.37l.7-.71zM5.54 8.17l-.71.71l6.36 6.36l.71-.71zM4.12 9.58l-.71.71l6.37 6.37l.71-.71z"    />  </svg>',
        iconX:
          '<svg    xmlns="http://www.w3.org/2000/svg"    width="64"    height="64"    viewBox="0 0 20 20"   stroke-width="1.5"    >    <path  fill="currentColor"  d="m11.9.39l1.4 1.4c1.61.19 3.5-.74 4.61.37s.18 3 .37 4.61l1.4 1.4c.39.39.39 1.02 0 1.41l-9.19 9.2c-.4.39-1.03.39-1.42 0L1.29 11c-.39-.39-.39-1.02 0-1.42l9.2-9.19a.996.996 0 0 1 1.41 0zm.58 2.25l-.58.58l4.95 4.95l.58-.58c-.19-.6-.2-1.22-.15-1.82c.02-.31.05-.62.09-.92c.12-1 .18-1.63-.17-1.98s-.98-.29-1.98-.17c-.3.04-.61.07-.92.09c-.6.05-1.22.04-1.82-.15zm4.02.93c.39.39.39 1.03 0 1.42s-1.03.39-1.42 0s-.39-1.03 0-1.42s1.03-.39 1.42 0zm-6.72.36l-.71.7L15.44 11l.7-.71zM8.36 5.34l-.7.71l6.36 6.36l.71-.7zM6.95 6.76l-.71.7l6.37 6.37l.7-.71zM5.54 8.17l-.71.71l6.36 6.36l.71-.71zM4.12 9.58l-.71.71l6.37 6.37l.71-.71z"    />  </svg>',
        tab: "vacationPortal",
        description: "اضافة اجازة زمنية لعدد من الساعات",
        isActive: true,
        permissions: [EnumPermission.ShowVacationsTime]
      },
      {
        routerName: "vacationDailyIndex",
        title: "اجازة اعتيادية",
        icon: '<svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"    viewBox="0 0 20 20"   stroke-width="1.5"    class="w-6 h-6"  >    <path  fill="currentColor"  d="m11.9.39l1.4 1.4c1.61.19 3.5-.74 4.61.37s.18 3 .37 4.61l1.4 1.4c.39.39.39 1.02 0 1.41l-9.19 9.2c-.4.39-1.03.39-1.42 0L1.29 11c-.39-.39-.39-1.02 0-1.42l9.2-9.19a.996.996 0 0 1 1.41 0zm.58 2.25l-.58.58l4.95 4.95l.58-.58c-.19-.6-.2-1.22-.15-1.82c.02-.31.05-.62.09-.92c.12-1 .18-1.63-.17-1.98s-.98-.29-1.98-.17c-.3.04-.61.07-.92.09c-.6.05-1.22.04-1.82-.15zm4.02.93c.39.39.39 1.03 0 1.42s-1.03.39-1.42 0s-.39-1.03 0-1.42s1.03-.39 1.42 0zm-6.72.36l-.71.7L15.44 11l.7-.71zM8.36 5.34l-.7.71l6.36 6.36l.71-.7zM6.95 6.76l-.71.7l6.37 6.37l.7-.71zM5.54 8.17l-.71.71l6.36 6.36l.71-.71zM4.12 9.58l-.71.71l6.37 6.37l.71-.71z"    />  </svg>',
        iconX:
          '<svg    xmlns="http://www.w3.org/2000/svg"    width="64"    height="64"    viewBox="0 0 20 20"   stroke-width="1.5"    >    <path  fill="currentColor"  d="m11.9.39l1.4 1.4c1.61.19 3.5-.74 4.61.37s.18 3 .37 4.61l1.4 1.4c.39.39.39 1.02 0 1.41l-9.19 9.2c-.4.39-1.03.39-1.42 0L1.29 11c-.39-.39-.39-1.02 0-1.42l9.2-9.19a.996.996 0 0 1 1.41 0zm.58 2.25l-.58.58l4.95 4.95l.58-.58c-.19-.6-.2-1.22-.15-1.82c.02-.31.05-.62.09-.92c.12-1 .18-1.63-.17-1.98s-.98-.29-1.98-.17c-.3.04-.61.07-.92.09c-.6.05-1.22.04-1.82-.15zm4.02.93c.39.39.39 1.03 0 1.42s-1.03.39-1.42 0s-.39-1.03 0-1.42s1.03-.39 1.42 0zm-6.72.36l-.71.7L15.44 11l.7-.71zM8.36 5.34l-.7.71l6.36 6.36l.71-.7zM6.95 6.76l-.71.7l6.37 6.37l.7-.71zM5.54 8.17l-.71.71l6.36 6.36l.71-.71zM4.12 9.58l-.71.71l6.37 6.37l.71-.71z"    />  </svg>',
        tab: "vacationPortal",
        description: "اضافة اجازة اعتيادية لعدد من الايام",
        isActive: true,
        permissions: [EnumPermission.ShowVacationsDaily]
      },
      {
        routerName: "vacationSickIndex",
        title: "اجازة مرضية",
        icon: ' <svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"    viewBox="0 0 24 24"    stroke="currentColor"    class="w-6 h-6"  ><path  fill="currentColor"  d="M4 2a2 2 0 0 0-2 2v10h2V4h10V2H4m4 4a2 2 0 0 0-2 2v10h2V8h10V6H8m12 6v8h-8v-8h8m0-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Z"/>  </svg>',
        iconX:
          ' <svg    xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"    stroke="currentColor"   ><path  fill="currentColor"  d="M4 2a2 2 0 0 0-2 2v10h2V4h10V2H4m4 4a2 2 0 0 0-2 2v10h2V8h10V6H8m12 6v8h-8v-8h8m0-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Z"/>  </svg>',
        tab: "vacationPortal",
        description: "اضافة اجازة مرضية لعدد من الايام",
        isActive: true,
        permissions: [EnumPermission.ShowVacationsSick]
      },
    ]
  }
];
