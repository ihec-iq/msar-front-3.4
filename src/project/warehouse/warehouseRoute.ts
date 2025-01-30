import authMiddleware from "@/router/middleware/authMiddleware";
import inputVoucherRoute from "./inputVoucher/inputVoucherRoute";
import outputVoucherRoute from "./outputVoucher/outputVoucherRoute";
import retrievalVoucherRoute from "./retrievalVoucher/retrievalVoucherRoute";
import directVoucherRoute from "./directVoucher/directVoucherRoute";
export default [
  ...inputVoucherRoute,
  ...outputVoucherRoute,
  ...retrievalVoucherRoute,
  ...directVoucherRoute,
  {
    path: "/warehousePortal",
    name: "warehousePortal",
    component: () => import("./view/WarehousePortalView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/storeIndex",
    name: "storeIndex",
    component: () => import("./view/StoreIndexView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/ItemHistory/:id",
    name: "ItemHistory",
    component: () => import("./view/StoreItemHistoryView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
  {
    path: "/WarehouseSettingPortalView",
    name: "WarehouseSettingPortalView",
    component: () => import("./view/WarehouseSettingPortalView.vue"),
    meta: {
      middleware: [authMiddleware],
    },
  },
];
