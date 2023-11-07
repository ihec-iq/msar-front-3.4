interface IconLink {
  routerName: string;
  title: string;
  icon: string;
  iconX: string;
  tab: string;
  description: string;
  permissions: Array<string>;
}

export const Links: Array<IconLink> = [
  {
    routerName: "Dashboard",
    title: "الواجهة الاساسية",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 20 20" fill="currentColor"  >    <path  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"    />  </svg>',
    iconX:
      '<svg xmlns="http://www.w3.org/2000/svg"   width="64"    height="64" viewBox="0 0 20 20" fill="currentColor"  >    <path  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"    />  </svg>',
    tab: "Feature Admin",
    description:
      "البوابة الاساسية للنظام ومن خلالها تستطيع الدخول على كاف خدمات النظام",
    permissions: ["dashboard"],
  },
  {
    routerName: "archiveIndex",
    title: "الارشيف",
    icon: '<svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"    viewBox="0 0 20 20"   stroke-width="1.5"    class="w-6 h-6"  >    <path  fill="currentColor"  d="m11.9.39l1.4 1.4c1.61.19 3.5-.74 4.61.37s.18 3 .37 4.61l1.4 1.4c.39.39.39 1.02 0 1.41l-9.19 9.2c-.4.39-1.03.39-1.42 0L1.29 11c-.39-.39-.39-1.02 0-1.42l9.2-9.19a.996.996 0 0 1 1.41 0zm.58 2.25l-.58.58l4.95 4.95l.58-.58c-.19-.6-.2-1.22-.15-1.82c.02-.31.05-.62.09-.92c.12-1 .18-1.63-.17-1.98s-.98-.29-1.98-.17c-.3.04-.61.07-.92.09c-.6.05-1.22.04-1.82-.15zm4.02.93c.39.39.39 1.03 0 1.42s-1.03.39-1.42 0s-.39-1.03 0-1.42s1.03-.39 1.42 0zm-6.72.36l-.71.7L15.44 11l.7-.71zM8.36 5.34l-.7.71l6.36 6.36l.71-.7zM6.95 6.76l-.71.7l6.37 6.37l.7-.71zM5.54 8.17l-.71.71l6.36 6.36l.71-.71zM4.12 9.58l-.71.71l6.37 6.37l.71-.71z"    />  </svg>',
    iconX:
      '<svg    xmlns="http://www.w3.org/2000/svg"    width="64"    height="64"    viewBox="0 0 20 20"   stroke-width="1.5"    >    <path  fill="currentColor"  d="m11.9.39l1.4 1.4c1.61.19 3.5-.74 4.61.37s.18 3 .37 4.61l1.4 1.4c.39.39.39 1.02 0 1.41l-9.19 9.2c-.4.39-1.03.39-1.42 0L1.29 11c-.39-.39-.39-1.02 0-1.42l9.2-9.19a.996.996 0 0 1 1.41 0zm.58 2.25l-.58.58l4.95 4.95l.58-.58c-.19-.6-.2-1.22-.15-1.82c.02-.31.05-.62.09-.92c.12-1 .18-1.63-.17-1.98s-.98-.29-1.98-.17c-.3.04-.61.07-.92.09c-.6.05-1.22.04-1.82-.15zm4.02.93c.39.39.39 1.03 0 1.42s-1.03.39-1.42 0s-.39-1.03 0-1.42s1.03-.39 1.42 0zm-6.72.36l-.71.7L15.44 11l.7-.71zM8.36 5.34l-.7.71l6.36 6.36l.71-.7zM6.95 6.76l-.71.7l6.37 6.37l.7-.71zM5.54 8.17l-.71.71l6.36 6.36l.71-.71zM4.12 9.58l-.71.71l6.37 6.37l.71-.71z"    />  </svg>',
    tab: "Company",
    description: "نظام ارشيف الكتب الرسمية",
    permissions: ["show archives"],
  },
  {
    routerName: "itemIndex",
    title: "المواد",
    icon: ' <svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"    viewBox="0 0 24 24"    stroke="currentColor"    class="w-6 h-6"  ><path  fill="currentColor"  d="M4 2a2 2 0 0 0-2 2v10h2V4h10V2H4m4 4a2 2 0 0 0-2 2v10h2V8h10V6H8m12 6v8h-8v-8h8m0-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Z"/>  </svg>',
    iconX:
      ' <svg    xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"    stroke="currentColor"   ><path  fill="currentColor"  d="M4 2a2 2 0 0 0-2 2v10h2V4h10V2H4m4 4a2 2 0 0 0-2 2v10h2V8h10V6H8m12 6v8h-8v-8h8m0-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Z"/>  </svg>',
    tab: "Computer",
    description: "المواد الاساسية في النظام والاصناف الخاصة بها",
    permissions: ["show items"],
  },
  {
    routerName: "inputVoucherIndex",
    title: "الادخال المخزني",
    icon: '<svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"    viewBox="0 0 24 24"    stroke="currentColor"    class="w-6 h-6"  >    <path  fill="currentColor"  d="M22 4V2H2v2h9v14.17l-5.5-5.5l-1.42 1.41L12 22l7.92-7.92l-1.42-1.41l-5.5 5.5V4h9Z"    />  </svg>',
    iconX:
      '<svg    xmlns="http://www.w3.org/2000/svg"    width="64" height="64"    viewBox="0 0 24 24"    stroke="currentColor"    >    <path  fill="currentColor"  d="M22 4V2H2v2h9v14.17l-5.5-5.5l-1.42 1.41L12 22l7.92-7.92l-1.42-1.41l-5.5 5.5V4h9Z"    />  </svg>',
    tab: "Active",
    description: "مستند الادخال المخزني",
    permissions: ["show inputVouchers"],
  },
  {
    routerName: "storeIndex",
    title: "المخزنية",
    icon: '<svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"    viewBox="0 0 24 24"    class="h-5 w-5 sm:h-6 sm:w-6"  >    <path  fill="currentColor"  d="M8 11.5V10h8v1.5H8Zm1 3V13h6v1.5H9ZM1 20V4h22v16H1Zm5-2h12V6H6v12Z"    />  </svg>',
    iconX:
      '<svg    xmlns="http://www.w3.org/2000/svg"    width="64" height="64"    viewBox="0 0 24 24" stroke="currentColor"    >    <path  fill="currentColor"  d="M8 11.5V10h8v1.5H8Zm1 3V13h6v1.5H9ZM1 20V4h22v16H1Zm5-2h12V6H6v12Z"    />  </svg>',
    tab: "News",
    description: "تقرير المخزنية الحالية للمواد",
    permissions: ["show storage"],
  },
  {
    routerName: "outputVoucherIndex",
    title: "الاخراج المخزني",
    icon: '<svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"    viewBox="0 0 24 24"    stroke="currentColor"    class="w-6 h-6"  >    <path  fill="currentColor"  d="M2 20v2h20v-2h-9V5.83l5.5 5.5l1.42-1.41L12 2L4.08 9.92l1.42 1.41l5.5-5.5V20H2Z"    />  </svg>',
    iconX:
      '<svg    xmlns="http://www.w3.org/2000/svg"    width="64" height="64"    viewBox="0 0 24 24"    stroke="currentColor" >    <path  fill="currentColor"  d="M2 20v2h20v-2h-9V5.83l5.5 5.5l1.42-1.41L12 2L4.08 9.92l1.42 1.41l5.5-5.5V20H2Z"    />  </svg>',
    tab: "general",
    description: "مستند الاخراج المخزني",
    permissions: ["show outputVouchers"],
  },
  {
    routerName: "directVoucherIndex",
    title: "الصرف المباشر",
    icon: '<svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"    stroke="currentColor"    viewBox="0 0 24 24"    class="w-6 h-6"  >    <path  fill="currentColor"  d="M18.75 8.65q-.675.675-1.55 1.025t-1.75.35q-.875 0-1.725-.338T12.2 8.65l-1.875-1.875q-.375-.375-.85-.563T8.5 6.026q-.5 0-.975.188t-.85.562L4.8 8.65L3.375 7.225L5.25 5.35q.675-.675 1.525-1.012T8.5 4q.875 0 1.713.338t1.512 1.012L13.6 7.225q.4.4.875.588T15.45 8q.5 0 .988-.188t.887-.587L19.2 5.35l1.425 1.425L18.75 8.65Zm0 5q-.675.675-1.538 1.012T15.475 15q-.875 0-1.737-.338T12.2 13.65l-1.875-1.875q-.375-.375-.85-.563t-.975-.187q-.5 0-.975.188t-.85.562L4.8 13.65l-1.425-1.4l1.875-1.9q.675-.675 1.525-1.012T8.5 9q.875 0 1.713.338t1.512 1.012l1.875 1.875q.4.4.875.588t.975.187q.5 0 .988-.187t.887-.588L19.2 10.35l1.425 1.425l-1.875 1.875Zm-.025 5q-.675.675-1.525 1.012T15.475 20q-.875 0-1.737-.338T12.2 18.65l-1.9-1.875q-.375-.375-.85-.562t-.975-.188q-.5 0-.975.188t-.85.562L4.775 18.65l-1.4-1.4l1.875-1.9q.675-.675 1.525-1.012T8.5 14q.875 0 1.713.338t1.512 1.012l1.875 1.875q.4.4.888.588t.987.187q.5 0 .975-.188t.875-.587L19.2 15.35l1.4 1.425l-1.875 1.875Z"/>  </svg>',
    iconX:
      '<svg    xmlns="http://www.w3.org/2000/svg"    width="64" height="64"    stroke="currentColor"    viewBox="0 0 24 24"  >    <path  fill="currentColor"  d="M18.75 8.65q-.675.675-1.55 1.025t-1.75.35q-.875 0-1.725-.338T12.2 8.65l-1.875-1.875q-.375-.375-.85-.563T8.5 6.026q-.5 0-.975.188t-.85.562L4.8 8.65L3.375 7.225L5.25 5.35q.675-.675 1.525-1.012T8.5 4q.875 0 1.713.338t1.512 1.012L13.6 7.225q.4.4.875.588T15.45 8q.5 0 .988-.188t.887-.587L19.2 5.35l1.425 1.425L18.75 8.65Zm0 5q-.675.675-1.538 1.012T15.475 15q-.875 0-1.737-.338T12.2 13.65l-1.875-1.875q-.375-.375-.85-.563t-.975-.187q-.5 0-.975.188t-.85.562L4.8 13.65l-1.425-1.4l1.875-1.9q.675-.675 1.525-1.012T8.5 9q.875 0 1.713.338t1.512 1.012l1.875 1.875q.4.4.875.588t.975.187q.5 0 .988-.187t.887-.588L19.2 10.35l1.425 1.425l-1.875 1.875Zm-.025 5q-.675.675-1.525 1.012T15.475 20q-.875 0-1.737-.338T12.2 18.65l-1.9-1.875q-.375-.375-.85-.562t-.975-.188q-.5 0-.975.188t-.85.562L4.775 18.65l-1.4-1.4l1.875-1.9q.675-.675 1.525-1.012T8.5 14q.875 0 1.713.338t1.512 1.012l1.875 1.875q.4.4.888.588t.987.187q.5 0 .975-.188t.875-.587L19.2 15.35l1.4 1.425l-1.875 1.875Z"/>  </svg>',
    tab: "general",
    description: "مستند الصرف المباشر للمواد قابلة الاستهلاك السريع",
    permissions: ["show directVouchers"],
  },
  {
    routerName: "employeeIndex",
    title: "الموظفين",
    icon: ' <svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"    stroke="currentColor"    viewBox="0 0 256 256"    class="w-6 h-6"  >    <path  fill="currentColor"  d="M128 18a94.11 94.11 0 0 0-94 94c0 23.6 12.41 54.2 33.21 81.83C83.27 215.18 107.68 238 128 238s44.73-22.82 60.79-44.17C209.59 166.2 222 135.6 222 112a94.11 94.11 0 0 0-94-94Zm51.21 168.62C161.48 210.17 140.91 226 128 226s-33.48-15.83-51.21-39.38C57.8 161.37 46 132.78 46 112a82 82 0 0 1 164 0c0 20.78-11.8 49.37-30.79 74.62ZM118 136a38 38 0 0 0-38-38a14 14 0 0 0-14 14a38 38 0 0 0 38 38a14 14 0 0 0 14-14Zm-14 2a26 26 0 0 1-26-26a2 2 0 0 1 2-2a26 26 0 0 1 26 26a2 2 0 0 1-2 2Zm72-40a38 38 0 0 0-38 38a14 14 0 0 0 14 14a38 38 0 0 0 38-38a14 14 0 0 0-14-14Zm-24 40a2 2 0 0 1-2-2a26 26 0 0 1 26-26a2 2 0 0 1 2 2a26 26 0 0 1-26 26Zm-2 46a6 6 0 0 1-6 6h-32a6 6 0 0 1 0-12h32a6 6 0 0 1 6 6Z"/>  </svg>',
    iconX:
      ' <svg    xmlns="http://www.w3.org/2000/svg"    width="64" height="64"    stroke="currentColor"    viewBox="0 0 256 256"   >    <path  fill="currentColor"  d="M128 18a94.11 94.11 0 0 0-94 94c0 23.6 12.41 54.2 33.21 81.83C83.27 215.18 107.68 238 128 238s44.73-22.82 60.79-44.17C209.59 166.2 222 135.6 222 112a94.11 94.11 0 0 0-94-94Zm51.21 168.62C161.48 210.17 140.91 226 128 226s-33.48-15.83-51.21-39.38C57.8 161.37 46 132.78 46 112a82 82 0 0 1 164 0c0 20.78-11.8 49.37-30.79 74.62ZM118 136a38 38 0 0 0-38-38a14 14 0 0 0-14 14a38 38 0 0 0 38 38a14 14 0 0 0 14-14Zm-14 2a26 26 0 0 1-26-26a2 2 0 0 1 2-2a26 26 0 0 1 26 26a2 2 0 0 1-2 2Zm72-40a38 38 0 0 0-38 38a14 14 0 0 0 14 14a38 38 0 0 0 38-38a14 14 0 0 0-14-14Zm-24 40a2 2 0 0 1-2-2a26 26 0 0 1 26-26a2 2 0 0 1 2 2a26 26 0 0 1-26 26Zm-2 46a6 6 0 0 1-6 6h-32a6 6 0 0 1 0-12h32a6 6 0 0 1 6 6Z"/>  </svg>',
    tab: "general1",
    description: "جميع معلومات الموظفين",
    permissions: ["show employees"],
  },
  {
    routerName: "vacationIndex",
    title: "الاجازات",
    icon: ' <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M9.29 3.25L5.16 6.72L4 5.34l4.14-3.47l1.15 1.38M22 5.35l-1.16 1.38l-4.14-3.48l1.16-1.38L22 5.35M13 4a8 8 0 0 1 8 8a8 8 0 0 1-8 8a8 8 0 0 1-8-8a8 8 0 0 1 8-8m0 2a6 6 0 0 0-6 6a6 6 0 0 0 6 6a6 6 0 0 0 6-6a6 6 0 0 0-6-6m-1 1.5h1.5v4.53l3.22 1.47l-.62 1.36L12 13V7.5M1 14c0-2.5 1.13-4.7 2.91-6.17A9.975 9.975 0 0 0 3 12l.06 1.13L3 14c0 2.28 1.27 4.26 3.14 5.28c1.3 1.22 2.93 2.11 4.75 2.5c-.61.14-1.24.22-1.89.22a8 8 0 0 1-8-8Z"/></svg>',
    iconX:
      ' <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><path fill="currentColor" d="M9.29 3.25L5.16 6.72L4 5.34l4.14-3.47l1.15 1.38M22 5.35l-1.16 1.38l-4.14-3.48l1.16-1.38L22 5.35M13 4a8 8 0 0 1 8 8a8 8 0 0 1-8 8a8 8 0 0 1-8-8a8 8 0 0 1 8-8m0 2a6 6 0 0 0-6 6a6 6 0 0 0 6 6a6 6 0 0 0 6-6a6 6 0 0 0-6-6m-1 1.5h1.5v4.53l3.22 1.47l-.62 1.36L12 13V7.5M1 14c0-2.5 1.13-4.7 2.91-6.17A9.975 9.975 0 0 0 3 12l.06 1.13L3 14c0 2.28 1.27 4.26 3.14 5.28c1.3 1.22 2.93 2.11 4.75 2.5c-.61.14-1.24.22-1.89.22a8 8 0 0 1-8-8Z"/></svg>',
    tab: "general1",
    description: "الاجازات الزمنية والدورية والمرضية الخاصة بالموظفين",
    permissions: ["vacations"],
  },
  {
    routerName: "userIndex",
    title: "المستخدمين",
    icon: ' <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7Z"/></svg>',
    iconX:
      ' <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><path fill="currentColor" d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.39 3.39 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.39 3.39 0 0 0 15 11a3.5 3.5 0 0 0 0-7Z"/></svg>',
    tab: "general1",
    description: "المستخدمين والصلاحيات",
    permissions: ["show users"],
  },
];
