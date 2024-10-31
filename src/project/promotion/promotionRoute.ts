import authMiddleware from "@/router/middleware/authMiddleware";

export default [
    {
        path: "/promotion/portal",
        name: "promotionPortal",
        component: () => import("./view/PromotionPortalView.vue"),
        meta: {
            middleware: [authMiddleware],
        },
    },
    {
        path: "/promotion/index",
        name: "promotionIndex",
        component: () => import("./view/PromotionIndexView.vue"),
        meta: {
            middleware: [authMiddleware],
        },
    },

    {
        path: "/promotion/add",
        name: "promotionAdd",
        component: () => import("./view/PromotionView.vue"),
        meta: {
            middleware: [authMiddleware],
        },
    },
    {
        path: "/promotion/:id",
        name: "promotionUpdate",
        component: () => import("./view/PromotionView.vue"),
        meta: {
            middleware: [authMiddleware],
        },
    },
    //#region Bonus Job Title
       {
        path: "/promotionSetting",
        name: "promotionSettingView",
        component: () => import("./view/PromotionSettingView.vue"),
        meta: {
            middleware: [authMiddleware],
        },
    },
    {
        path: "/promotionChecker",
        name: "promotionCheckerView",
        component: () => import("./view/PromotionCheckerView.vue"),
        meta: {
            middleware: [authMiddleware],
        },
    },
    //#endregion
];
