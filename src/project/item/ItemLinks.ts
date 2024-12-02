import type { IconLink } from "@/components/fixed/FixedMenu";
import { EnumPermission } from "@/utilities/EnumSystem";

interface IconUserLink {
  routerName: string;
  title: string;
  icon: string;
  iconX: string;
  tab: string;
  description: string;
  permissions: Array<string>;
  isActive: boolean;
  children?: Array<IconLink>;
}

export const ItemLinks: Array<IconUserLink> = [
  {
    routerName: "itemPortal",
    title: "المواد",
    icon: ' <svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"  class="h-5 w-5 sm:h-6 sm:w-6"   viewBox="0 0 24 24"    stroke="currentColor"     ><path  fill="currentColor"  d="M4 2a2 2 0 0 0-2 2v10h2V4h10V2H4m4 4a2 2 0 0 0-2 2v10h2V8h10V6H8m12 6v8h-8v-8h8m0-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Z"/>  </svg>',
    iconX:
      ' <svg    xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"    stroke="currentColor"   ><path  fill="currentColor"  d="M4 2a2 2 0 0 0-2 2v10h2V4h10V2H4m4 4a2 2 0 0 0-2 2v10h2V8h10V6H8m12 6v8h-8v-8h8m0-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Z"/>  </svg>',
    tab: "itemPortal",
    description: "المواد الاساسية في النظام والاصناف الخاصة بها",
    permissions: [EnumPermission.ShowItems],
    isActive: true,
    children: [
      {
        routerName: "itemIndex",
        title: "المواد",
        icon: ' <svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"  class="h-5 w-5 sm:h-6 sm:w-6"   viewBox="0 0 24 24"    stroke="currentColor"     ><path  fill="currentColor"  d="M4 2a2 2 0 0 0-2 2v10h2V4h10V2H4m4 4a2 2 0 0 0-2 2v10h2V8h10V6H8m12 6v8h-8v-8h8m0-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Z"/>  </svg>',
        iconX:
          ' <svg    xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"    stroke="currentColor"   ><path  fill="currentColor"  d="M4 2a2 2 0 0 0-2 2v10h2V4h10V2H4m4 4a2 2 0 0 0-2 2v10h2V8h10V6H8m12 6v8h-8v-8h8m0-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Z"/>  </svg>',
        tab: "itemPortal",
        description: "المواد الاساسية في النظام والاصناف الخاصة بها",
        permissions: [EnumPermission.ShowItems],
        isActive: true,
      },
      {
        routerName: "itemCategoryIndex",
        title: "اصناف المواد",
        icon: '<svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32" class="h-5 w-5 sm:h-6 sm:w-6"   viewBox="0 0 24 24"    stroke="currentColor"    >    <path  fill="currentColor"  d="M22 4V2H2v2h9v14.17l-5.5-5.5l-1.42 1.41L12 22l7.92-7.92l-1.42-1.41l-5.5 5.5V4h9Z"    />  </svg>',
        iconX:
          '<svg    xmlns="http://www.w3.org/2000/svg"    width="64" height="64"    viewBox="0 0 24 24"    stroke="currentColor"    >    <path  fill="currentColor"  d="M22 4V2H2v2h9v14.17l-5.5-5.5l-1.42 1.41L12 22l7.92-7.92l-1.42-1.41l-5.5 5.5V4h9Z"    />  </svg>',
        tab: "itemPortal",
        description: "اصناف المواد",
        permissions: [EnumPermission.ShowCategoriesItem],
        isActive: true,
      },
    ],
  }
];
