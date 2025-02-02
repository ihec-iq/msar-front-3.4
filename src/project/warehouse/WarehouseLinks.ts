import type { IconLink } from "@/components/fixed/FixedMenu";
import { EnumPermission } from "@/utilities/EnumSystem";

export const WarehouseLinks: Array<IconLink> = [
  {
    routerName: "warehousePortal",
    title: "المخزنية",
    icon: '<svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"   class="h-5 w-5 sm:h-6 sm:w-6"  viewBox="0 0 24 24"      >    <path  fill="currentColor"  d="M8 11.5V10h8v1.5H8Zm1 3V13h6v1.5H9ZM1 20V4h22v16H1Zm5-2h12V6H6v12Z"    />  </svg>',
    iconX:
      '<svg    xmlns="http://www.w3.org/2000/svg"    width="64" height="64"    viewBox="0 0 24 24" stroke="currentColor"    >    <path  fill="currentColor"  d="M8 11.5V10h8v1.5H8Zm1 3V13h6v1.5H9ZM1 20V4h22v16H1Zm5-2h12V6H6v12Z"    />  </svg>',
    tab: "warehousePortal",
    description: "لوحة التحكم بالمخزن",
    permissions: [EnumPermission.ShowStorage],
    isActive: true,
    children: [
      {
        routerName: "storeIndex",
        title: "المخزنية",
        icon: '<svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"   class="h-5 w-5 sm:h-6 sm:w-6"  viewBox="0 0 24 24"      >    <path  fill="currentColor"  d="M8 11.5V10h8v1.5H8Zm1 3V13h6v1.5H9ZM1 20V4h22v16H1Zm5-2h12V6H6v12Z"    />  </svg>',
        iconX:
          '<svg    xmlns="http://www.w3.org/2000/svg"    width="64" height="64"    viewBox="0 0 24 24" stroke="currentColor"    >    <path  fill="currentColor"  d="M8 11.5V10h8v1.5H8Zm1 3V13h6v1.5H9ZM1 20V4h22v16H1Zm5-2h12V6H6v12Z"    />  </svg>',
        tab: "warehousePortal",
        description: "تقرير المخزنية الحالية للمواد",
        permissions: [EnumPermission.ShowStorage],
        isActive: true,
      },
      {
        routerName: "inputVoucherIndex",
        title: "الاستلام المخزني",
        icon: '<svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32" class="h-5 w-5 sm:h-6 sm:w-6"   viewBox="0 0 24 24"    stroke="currentColor"    >    <path  fill="currentColor"  d="M22 4V2H2v2h9v14.17l-5.5-5.5l-1.42 1.41L12 22l7.92-7.92l-1.42-1.41l-5.5 5.5V4h9Z"    />  </svg>',
        iconX:
          '<svg    xmlns="http://www.w3.org/2000/svg"    width="64" height="64"    viewBox="0 0 24 24"    stroke="currentColor"    >    <path  fill="currentColor"  d="M22 4V2H2v2h9v14.17l-5.5-5.5l-1.42 1.41L12 22l7.92-7.92l-1.42-1.41l-5.5 5.5V4h9Z"    />  </svg>',
        tab: "warehousePortal",
        description: "مستند الادخال المخزني",
        permissions: [EnumPermission.ShowInputVouchers],
        isActive: true,
      },
      {
        routerName: "outputVoucherIndex",
        title: "الاصدار المخزني",
        icon: '<svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"  class="h-5 w-5 sm:h-6 sm:w-6"   viewBox="0 0 24 24"    stroke="currentColor"    >    <path  fill="currentColor"  d="M2 20v2h20v-2h-9V5.83l5.5 5.5l1.42-1.41L12 2L4.08 9.92l1.42 1.41l5.5-5.5V20H2Z"    />  </svg>',
        iconX:
          '<svg    xmlns="http://www.w3.org/2000/svg"    width="64" height="64"    viewBox="0 0 24 24"    stroke="currentColor" >    <path  fill="currentColor"  d="M2 20v2h20v-2h-9V5.83l5.5 5.5l1.42-1.41L12 2L4.08 9.92l1.42 1.41l5.5-5.5V20H2Z"    />  </svg>',
        tab: "warehousePortal",
        description: "مستند الاخراج المخزني",
        permissions: [EnumPermission.ShowOutputVouchers],
        isActive: true,
      },

      // {
      //   routerName: "retrievalVoucherIndex",
      //   title: "مستند استرجاع",
      //   icon: '<svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"  class="h-5 w-5 sm:h-6 sm:w-6"   viewBox="0 0 24 24"    stroke="currentColor"    >    <path  fill="currentColor"  d="M2 20v2h20v-2h-9V5.83l5.5 5.5l1.42-1.41L12 2L4.08 9.92l1.42 1.41l5.5-5.5V20H2Z"    />  </svg>',
      //   iconX:
      //     '<svg    xmlns="http://www.w3.org/2000/svg"    width="64" height="64"    viewBox="0 0 24 24"    stroke="currentColor" >    <path  fill="currentColor"  d="M2 20v2h20v-2h-9V5.83l5.5 5.5l1.42-1.41L12 2L4.08 9.92l1.42 1.41l5.5-5.5V20H2Z"    />  </svg>',
      //   tab: "general",
      //   description: "مستند استرجاع المخزني",
      //   permissions: [EnumPermission.ShowOutputVouchers],
      //   isActive: true,
      // },
      {
        routerName: "retrievalVoucherIndex",
        title: "الاسترجاع المخزي",
        icon: '<svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"   class="h-5 w-5 sm:h-6 sm:w-6"  stroke="currentColor"    viewBox="0 0 24 24"     >    <path  fill="currentColor"  d="M18.75 8.65q-.675.675-1.55 1.025t-1.75.35q-.875 0-1.725-.338T12.2 8.65l-1.875-1.875q-.375-.375-.85-.563T8.5 6.026q-.5 0-.975.188t-.85.562L4.8 8.65L3.375 7.225L5.25 5.35q.675-.675 1.525-1.012T8.5 4q.875 0 1.713.338t1.512 1.012L13.6 7.225q.4.4.875.588T15.45 8q.5 0 .988-.188t.887-.587L19.2 5.35l1.425 1.425L18.75 8.65Zm0 5q-.675.675-1.538 1.012T15.475 15q-.875 0-1.737-.338T12.2 13.65l-1.875-1.875q-.375-.375-.85-.563t-.975-.187q-.5 0-.975.188t-.85.562L4.8 13.65l-1.425-1.4l1.875-1.9q.675-.675 1.525-1.012T8.5 9q.875 0 1.713.338t1.512 1.012l1.875 1.875q.4.4.875.588t.975.187q.5 0 .988-.187t.887-.588L19.2 10.35l1.425 1.425l-1.875 1.875Zm-.025 5q-.675.675-1.525 1.012T15.475 20q-.875 0-1.737-.338T12.2 18.65l-1.9-1.875q-.375-.375-.85-.562t-.975-.188q-.5 0-.975.188t-.85.562L4.775 18.65l-1.4-1.4l1.875-1.9q.675-.675 1.525-1.012T8.5 14q.875 0 1.713.338t1.512 1.012l1.875 1.875q.4.4.888.588t.987.187q.5 0 .975-.188t.875-.587L19.2 15.35l1.4 1.425l-1.875 1.875Z"/>  </svg>',
        iconX:
          '<svg    xmlns="http://www.w3.org/2000/svg"    width="64" height="64"    stroke="currentColor"    viewBox="0 0 24 24"  >    <path  fill="currentColor"  d="M18.75 8.65q-.675.675-1.55 1.025t-1.75.35q-.875 0-1.725-.338T12.2 8.65l-1.875-1.875q-.375-.375-.85-.563T8.5 6.026q-.5 0-.975.188t-.85.562L4.8 8.65L3.375 7.225L5.25 5.35q.675-.675 1.525-1.012T8.5 4q.875 0 1.713.338t1.512 1.012L13.6 7.225q.4.4.875.588T15.45 8q.5 0 .988-.188t.887-.587L19.2 5.35l1.425 1.425L18.75 8.65Zm0 5q-.675.675-1.538 1.012T15.475 15q-.875 0-1.737-.338T12.2 13.65l-1.875-1.875q-.375-.375-.85-.563t-.975-.187q-.5 0-.975.188t-.85.562L4.8 13.65l-1.425-1.4l1.875-1.9q.675-.675 1.525-1.012T8.5 9q.875 0 1.713.338t1.512 1.012l1.875 1.875q.4.4.875.588t.975.187q.5 0 .988-.187t.887-.588L19.2 10.35l1.425 1.425l-1.875 1.875Zm-.025 5q-.675.675-1.525 1.012T15.475 20q-.875 0-1.737-.338T12.2 18.65l-1.9-1.875q-.375-.375-.85-.562t-.975-.188q-.5 0-.975.188t-.85.562L4.775 18.65l-1.4-1.4l1.875-1.9q.675-.675 1.525-1.012T8.5 14q.875 0 1.713.338t1.512 1.012l1.875 1.875q.4.4.888.588t.987.187q.5 0 .975-.188t.875-.587L19.2 15.35l1.4 1.425l-1.875 1.875Z"/>  </svg>',
        tab: "warehousePortal",
        description: "مستند الصرف المباشر للمواد قابلة الاستهلاك السريع",
        permissions: [EnumPermission.ShowRetrievalVouchers],
        isActive: true,
      },
      {
        routerName: "directVoucherIndex",
        title: "الصرف المباشر",
        icon: '<svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"   class="h-5 w-5 sm:h-6 sm:w-6"  stroke="currentColor"    viewBox="0 0 24 24"     >    <path  fill="currentColor"  d="M18.75 8.65q-.675.675-1.55 1.025t-1.75.35q-.875 0-1.725-.338T12.2 8.65l-1.875-1.875q-.375-.375-.85-.563T8.5 6.026q-.5 0-.975.188t-.85.562L4.8 8.65L3.375 7.225L5.25 5.35q.675-.675 1.525-1.012T8.5 4q.875 0 1.713.338t1.512 1.012L13.6 7.225q.4.4.875.588T15.45 8q.5 0 .988-.188t.887-.587L19.2 5.35l1.425 1.425L18.75 8.65Zm0 5q-.675.675-1.538 1.012T15.475 15q-.875 0-1.737-.338T12.2 13.65l-1.875-1.875q-.375-.375-.85-.563t-.975-.187q-.5 0-.975.188t-.85.562L4.8 13.65l-1.425-1.4l1.875-1.9q.675-.675 1.525-1.012T8.5 9q.875 0 1.713.338t1.512 1.012l1.875 1.875q.4.4.875.588t.975.187q.5 0 .988-.187t.887-.588L19.2 10.35l1.425 1.425l-1.875 1.875Zm-.025 5q-.675.675-1.525 1.012T15.475 20q-.875 0-1.737-.338T12.2 18.65l-1.9-1.875q-.375-.375-.85-.562t-.975-.188q-.5 0-.975.188t-.85.562L4.775 18.65l-1.4-1.4l1.875-1.9q.675-.675 1.525-1.012T8.5 14q.875 0 1.713.338t1.512 1.012l1.875 1.875q.4.4.888.588t.987.187q.5 0 .975-.188t.875-.587L19.2 15.35l1.4 1.425l-1.875 1.875Z"/>  </svg>',
        iconX:
          '<svg    xmlns="http://www.w3.org/2000/svg"    width="64" height="64"    stroke="currentColor"    viewBox="0 0 24 24"  >    <path  fill="currentColor"  d="M18.75 8.65q-.675.675-1.55 1.025t-1.75.35q-.875 0-1.725-.338T12.2 8.65l-1.875-1.875q-.375-.375-.85-.563T8.5 6.026q-.5 0-.975.188t-.85.562L4.8 8.65L3.375 7.225L5.25 5.35q.675-.675 1.525-1.012T8.5 4q.875 0 1.713.338t1.512 1.012L13.6 7.225q.4.4.875.588T15.45 8q.5 0 .988-.188t.887-.587L19.2 5.35l1.425 1.425L18.75 8.65Zm0 5q-.675.675-1.538 1.012T15.475 15q-.875 0-1.737-.338T12.2 13.65l-1.875-1.875q-.375-.375-.85-.563t-.975-.187q-.5 0-.975.188t-.85.562L4.8 13.65l-1.425-1.4l1.875-1.9q.675-.675 1.525-1.012T8.5 9q.875 0 1.713.338t1.512 1.012l1.875 1.875q.4.4.875.588t.975.187q.5 0 .988-.187t.887-.588L19.2 10.35l1.425 1.425l-1.875 1.875Zm-.025 5q-.675.675-1.525 1.012T15.475 20q-.875 0-1.737-.338T12.2 18.65l-1.9-1.875q-.375-.375-.85-.562t-.975-.188q-.5 0-.975.188t-.85.562L4.775 18.65l-1.4-1.4l1.875-1.9q.675-.675 1.525-1.012T8.5 14q.875 0 1.713.338t1.512 1.012l1.875 1.875q.4.4.888.588t.987.187q.5 0 .975-.188t.875-.587L19.2 15.35l1.4 1.425l-1.875 1.875Z"/>  </svg>',
        tab: "warehousePortal",
        description: "مستند الصرف المباشر للمواد قابلة الاستهلاك السريع",
        permissions: [EnumPermission.ShowDirectVouchers],
        isActive: true,
      }
      ,
      {
        routerName: "WarehouseSettingPortalView",
        title: "الاعدادات",
        mdi: "mdi-cog",
        tab: "warehousePortal",
        description: "الاعدادات المخزنية",
        permissions: [],
        isActive: true,
        children: [
          {
            routerName: "stockIndex",
            title: "المخازن",
            tab: "warehousePortal",
            mdi: "mdi-warehouse",
            description: "اعدادات المخازن",
            permissions: [],
            isActive: true,
          },
          {
            routerName: "inputVoucherStateIndex",
            title: "حالة الاستلام",
            tab: "warehousePortal",
            mdi: "mdi-state-machine",
            description: "اعدادات حالة الاستلام",
            permissions: [],
            isActive: true,
          },
        ],
      },
    ],
  }
];
