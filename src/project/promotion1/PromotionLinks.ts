import type { IconLink } from "@/components/fixed/FixedMenu";
import { EnumPermission } from "@/utilities/EnumSystem";
import { t } from "@/utilities/I18nPlugin";

export const PromotionLinks: Array<IconLink> = [
  {
    routerName: "promotionCheckerView",
    title: "تنبيه استحقاق الترويج",
    icon: '<svg ...>...</svg>', // Replace with actual SVG
    iconX: '<svg ...>...</svg>', // Replace with actual SVG
    tab: "Company",
    description: "تنبيهات الترويج المستحقة للموظفين",
    permissions: [EnumPermission.ShowArchives],
    isActive: true,
  },
  {
    routerName: "promotionIndex",
    title: "الترويج",
    icon: '<svg ...>...</svg>', // Replace with actual SVG
    iconX: '<svg ...>...</svg>', // Replace with actual SVG
    tab: "Company",
    description: "اضافة الترويج للموظفين",
    permissions: [EnumPermission.ShowArchives],
    isActive: true,
  },
  {
    routerName: "promotionJobTitleIndex",
    title: t('Promotion.JobTitle'),
    icon: '<svg ...>...</svg>', // Replace with actual SVG
    iconX: '<svg ...>...</svg>', // Replace with actual SVG
    tab: "Company",
    description: "اضافة الترويج للموظفين",
    permissions: [EnumPermission.ShowArchives],
    isActive: true,
  },
  {
    routerName: "promotionSettingView",
    title: t('Setting.Name'),
    mdi: "mdi-cog",
    tab: "Company",
    description: "اعدادات الترويج",
    permissions: [EnumPermission.ShowArchives],
    isActive: true,
  },
];
