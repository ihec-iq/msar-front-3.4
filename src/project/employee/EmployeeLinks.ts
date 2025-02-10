import type { IconLink } from "@/components/fixed/FixedMenu";
import { EnumPermission } from "@/utilities/EnumSystem";
import { t } from "@/utilities/I18nPlugin";


export const EmployeeLinks: Array<IconLink> = [
  {
    routerName: "employeePortal",
    title: "الموارد البشرية",
    mdi: "mdi-account-group",
    tab: "employeePortal",
    description: "جميع معلومات الموظفين",
    permissions: [EnumPermission.ShowEmployees],
    isActive: true,
    children: [
      {
        routerName: "Employee.Index",
        title: "الموظفين",
        icon: ' <svg    xmlns="http://www.w3.org/2000/svg"    width="32"    height="32"  class="h-5 w-5 sm:h-6 sm:w-6"   stroke="currentColor"    viewBox="0 0 256 256"     >    <path  fill="currentColor"  d="M128 18a94.11 94.11 0 0 0-94 94c0 23.6 12.41 54.2 33.21 81.83C83.27 215.18 107.68 238 128 238s44.73-22.82 60.79-44.17C209.59 166.2 222 135.6 222 112a94.11 94.11 0 0 0-94-94Zm51.21 168.62C161.48 210.17 140.91 226 128 226s-33.48-15.83-51.21-39.38C57.8 161.37 46 132.78 46 112a82 82 0 0 1 164 0c0 20.78-11.8 49.37-30.79 74.62ZM118 136a38 38 0 0 0-38-38a14 14 0 0 0-14 14a38 38 0 0 0 38 38a14 14 0 0 0 14-14Zm-14 2a26 26 0 0 1-26-26a2 2 0 0 1 2-2a26 26 0 0 1 26 26a2 2 0 0 1-2 2Zm72-40a38 38 0 0 0-38 38a14 14 0 0 0 14 14a38 38 0 0 0 38-38a14 14 0 0 0-14-14Zm-24 40a2 2 0 0 1-2-2a26 26 0 0 1 26-26a2 2 0 0 1 2 2a26 26 0 0 1-26 26Zm-2 46a6 6 0 0 1-6 6h-32a6 6 0 0 1 0-12h32a6 6 0 0 1 6 6Z"/>  </svg>',
        iconX:
          ' <svg    xmlns="http://www.w3.org/2000/svg"    width="64" height="64"    stroke="currentColor"    viewBox="0 0 256 256"   >    <path  fill="currentColor"  d="M128 18a94.11 94.11 0 0 0-94 94c0 23.6 12.41 54.2 33.21 81.83C83.27 215.18 107.68 238 128 238s44.73-22.82 60.79-44.17C209.59 166.2 222 135.6 222 112a94.11 94.11 0 0 0-94-94Zm51.21 168.62C161.48 210.17 140.91 226 128 226s-33.48-15.83-51.21-39.38C57.8 161.37 46 132.78 46 112a82 82 0 0 1 164 0c0 20.78-11.8 49.37-30.79 74.62ZM118 136a38 38 0 0 0-38-38a14 14 0 0 0-14 14a38 38 0 0 0 38 38a14 14 0 0 0 14-14Zm-14 2a26 26 0 0 1-26-26a2 2 0 0 1 2-2a26 26 0 0 1 26 26a2 2 0 0 1-2 2Zm72-40a38 38 0 0 0-38 38a14 14 0 0 0 14 14a38 38 0 0 0 38-38a14 14 0 0 0-14-14Zm-24 40a2 2 0 0 1-2-2a26 26 0 0 1 26-26a2 2 0 0 1 2 2a26 26 0 0 1-26 26Zm-2 46a6 6 0 0 1-6 6h-32a6 6 0 0 1 0-12h32a6 6 0 0 1 6 6Z"/>  </svg>',
        tab: "employeePortal",
        description: "جميع معلومات الموظفين",
        permissions: [EnumPermission.ShowEmployees],
        isActive: true,
        children: [
          {
            routerName: "EmployeeTypeIndex",
            title: t('Employee.Type'),
            mdi:"setting",
            tab: "employeePortal",
            description: "",
            permissions: [EnumPermission.ShowEmployees],
            isActive: true,
          },]
      },
      {
        routerName: "hrDocumentIndex",
        title: "ضبارة الموظفين",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 20 20" fill="currentColor"  >    <path  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"    />  </svg>',
        iconX:
          '<svg xmlns="http://www.w3.org/2000/svg"   width="64"    height="64" viewBox="0 0 20 20" fill="currentColor"  >    <path  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"    />  </svg>',
        tab: "employeePortal",
        description:
          "البوابة الاساسية لضبارة الموظفين ومن خلالها تستطيع الدخول على كاف خدمات النظام",
        isActive: true,
        permissions: [EnumPermission.ShowEmployees]
      },
      {
        routerName: "bonusPortal",
        title: "العلاوات",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 20 20" fill="currentColor"  >    <path  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"    />  </svg>',
        iconX:
          '<svg xmlns="http://www.w3.org/2000/svg"   width="64"    height="64" viewBox="0 0 20 20" fill="currentColor"  >    <path  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"    />  </svg>',
        tab: "employeePortal",
        description: "اضافة العلاوات للموظفين",
        isActive: true,
        permissions: [EnumPermission.ShowEmployees]
      },
      {
        routerName: "promotionPortal",
        title: "الترفيعات",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 20 20" fill="currentColor"  >    <path  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"    />  </svg>',
        iconX:
          '<svg xmlns="http://www.w3.org/2000/svg"   width="64"    height="64" viewBox="0 0 20 20" fill="currentColor"  >    <path  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"    />  </svg>',
        tab: "employeePortal",
        description: "اضافة الترفيعات للموظفين",
        isActive: true,
        permissions: [EnumPermission.ShowEmployees]
      },
      {
        routerName: "employeeSettingPortal",
        title: t('Setting.Name'),
        mdi:"mdi-cog",
        tab: "employeePortal",
        description: "",
        isActive: true,
        permissions: [EnumPermission.ShowEmployeeSetting],
        children:[
          {
            routerName: "EmployeeTypeIndex",
            title: t('EmployeeType.Index'),
            mdi: "mdi-cog",
            tab: "employeePortal",
            description: "",
            isActive: true,
            permissions: [EnumPermission.ShowEmployeeSetting],
          },
          {
            routerName: "EmployeeCenterIndex",
            title: t('EmployeeCenter.Index'),
            mdi: "mdi-cog",
            tab: "employeePortal",
            description: "",
            isActive: true,
            permissions: [EnumPermission.ShowEmployeeSetting],
          },
          {
            routerName: "EmployeePositionIndex",
            title: t('EmployeePosition.Index'),
            mdi: "mdi-cog",
            tab: "employeePortal",
            description: "",
            isActive: true,
            permissions: [EnumPermission.ShowEmployeeSetting],
          }   
        ]
      }
    ]


  }
];
