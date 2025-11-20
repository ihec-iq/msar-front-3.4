import type { IconLink } from "@/components/fixed/FixedMenu";
import { EnumPermission } from "@/utilities/EnumSystem";

export const DashboardLinks: Array<IconLink> = [
  {
    routerName: "Dashboard",
    title: "لوحة القيادة",
    mdi: "mdi-chart-line",
    tab: "dashboard",
    description: "",
    permissions: [EnumPermission.Dashboard],
    isActive: true,
    children: [
    ],
  }
];
