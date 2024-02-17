const generateColorClass = (variable) => {
  return ({ opacityValue }) =>
    opacityValue
      ? `rgba(var(--${variable}), ${opacityValue})`
      : `rgb(var(--${variable}))`;
};
const backgroundColor = {
  primary: generateColorClass("bg-primary"),
  secondary: generateColorClass("bg-secondary"),
  tertiary: generateColorClass("bg-tertiary"),
};

/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.html",
    "./src/**/*.vue",
    "./src/**/*.jsx",
  ],
  // /* gray 900 */
  // color: #111827 ;
  // /* gray 800 */
  // color: #1f2937;
  // /* gray 700 */
  // color: #374151;
  // /* gray 600 */
  // color: #4b5563;
  // /* gray 500 */
  // color: #6b7280;
  // /* gray 400 */
  // color: #9ca3af;
  // /* gray 300 */
  // color: #d1d5db;
  // /* gray 200 */
  // color: #e5e7eb;
  // /* gray 100 */
  // color: #f3f4f6;
  theme: {
    fontFamily: {
      Tajawal: ["Tajawal", "sans-serif"],
      Tajawal_bold: ["Tajawal_bold", "sans-serif"],
    },
    extend: {
      backgroundColor,
      screens: {
        xs: "350px",
      },
      colors: {
        mainBG: "#e8f6fd",
        // dark
        sideNav: "#333333",
        sideNavHover: "#252526",
        nav: "#333333",
        bgLeftNav1: "#252526",
        sideNavSetting: "#111827",
        sideNavActive: "#1f2937",
        navIconColoDark: "#858585",
        navIconColorHoverDark: "#FEFEFE",

        hoverButton: "#111827",
        title: "#111827",
        designTable: "#111827",
        reportCheck: "#111827",
        designTableTr: "#111827",
        popUp: "#111827",
        tableHead: "#111827",
        //
        input: "#1f2937",
        designTableHead: "#1f2937",
        designTableTitle: "#1f2937",
        voucherFilter: "#1f2937",
        voucherTitlesHover: "#1f2937",
        text: "#1f2937",
        tableBody: "#1f2937",
        dropDown: "#1f2937",
        select: "#1f2937",
        textAria: "#1f2937",
        //

        bottomTool: "#141c2a",
        toolBar: "#141c2a",
        button: "#141c2a",
        sortBy: "#141c2a",
        card: "#141c2a",
        //
        setting: "#374151",
        tableBodyHover: "#374151",
        dropDownHover: "#374151",
        tripCount: "#374151",
        th: "#374151",
        //
        content: "#1b2432",
        //
        icon: "#6b7280",
        textGray: "#6b7280",
        //
        sideNavActiveBorder: "#3b82f6",
        td: "#4b5563",
        iconHover: "#e5e7eb",
        searchFilterBorder: "#e5e7eb",
        designTableTrHover: "#d1d5db",
        customer: "#ededed",
        namePage: "#dcdde3",
        // buttons
        // create: "#36D399",
        create: "#2ecc71",
        createHover: "#139e4d",
        delete: "#E92E33",
        deleteHover: "#CF2727",
        update: "#0099ff",
        updateHover: "#0075c3",
        back: "#205097",
        backHover: "#163f7c",
        print: "#27BEC4",
        printHover: "#199a9e",
        darkNav: "#2f3349",
        bgLeftNav: "#1b2432",
        //#region "commits"
        //left nav bar and tool bar in top
        // for sitting
        // for tabel
        //the side bar in the nav
        //the side bar in the nav
        //the side bar in the nav
        //the side bar in the nav
        // the main pages //خلفية الصفحات المتغيرة
        // for buttons
        // hover on the button
        //for tables
        //table: "#1f2937",
        // for titles of the pages //عناوين الصفحات
        //create button
        //delete button
        //update button
        //create button
        // print button
        // card group
        // inputs
        //icons
        //filter search button
        //custom Group card
        //bg design table
        //vouchers
        //report
        //skeleton table load
        //vselect
        //textaria
        //textaria
        //customer?
        //#endregion
        //#region "light"
        // light
        lightInput: "#e5e7eb",
        designTableLight: "#e5e7eb",
        voucherFilterLight: "#e5e7eb",
        textAriaLight: "#e5e7eb",
        selectLight: "#e5e7eb",
        //
        sideNavLightHover: "#c9c9c9",
        sideNavLightActive: "#ffff",
        searchFilterLightHover: "#c9c9c9",
        tripCountLight: "#c9c9c9",
        //
        LightTableHead: "#dcdde3",
        lightDropDown: "#dcdde3",
        designTableTitleLight: "#dcdde3",
        popUpLight: "#dcdde3",
        //
        textLight: "#d1d5db",
        lightDropDownHover: "#d1d5db",
        //
        lightBottomTool: "#cdd8f5",
        lightNav: "#cdd8f5",
        //
        lightToolBar: "#DBE7EF",
        sideNavLight: "#DBE7EF",
        //
        settingLight: "#d2d4dc",
        settingLightHover: "#d2d4dc",
        //
        sortByLight: "#e2e8f0",
        cardLight: "#e2e8f0",
        //
        voucherTitlesLightHover: "#9ca3af",
        tdLight: "#9ca3af",
        //
        designTableTrLight: "#f3f4f6",
        reportCheckLight: "#f3f4f6",
        //
        iconLight: "#374151",
        searchFilterBorderLight: "#374151",
        //
        sideNavLightActiveBorder: "#f87171",
        sideNavLeftLight: "#0099ff",
        lightCard: "#90A3D5",
        iconHoverLight: "#4b5563",
        lightContent: "#ebf0ff",
        thLight: "#6b7280",
        bgLeftNavLight: "#fff",
        tableNew: "#2f3349",
        tableHeaderNew: "#505051",
        "primary-50": "rgb(var(--primary-50))",
        "primary-100": "rgb(var(--primary-100))",
        "primary-200": "rgb(var(--primary-200))",
        "primary-300": "rgb(var(--primary-300))",
        "primary-400": "rgb(var(--primary-400))",
        "primary-500": "rgb(var(--primary-500))",
        "primary-600": "rgb(var(--primary-600))",
        "primary-700": "rgb(var(--primary-700))",
        "primary-800": "rgb(var(--primary-800))",
        "primary-900": "rgb(var(--primary-900))",
        "primary-950": "rgb(var(--primary-950))",
        "surface-0": "rgb(var(--surface-0))",
        "surface-50": "rgb(var(--surface-50))",
        "surface-100": "rgb(var(--surface-100))",
        "surface-200": "rgb(var(--surface-200))",
        "surface-300": "rgb(var(--surface-300))",
        "surface-400": "rgb(var(--surface-400))",
        "surface-500": "rgb(var(--surface-500))",
        "surface-600": "rgb(var(--surface-600))",
        "surface-700": "rgb(var(--surface-700))",
        "surface-800": "rgb(var(--surface-800))",
        "surface-900": "rgb(var(--surface-900))",
        "surface-950": "rgb(var(--surface-950))",
        //#endregion
      },
      // dark: {
      //   primary: "#000",
      //   secondary: "#E92E33",
      //   accent: "#111827",
      //   neutral: "#2A1C31",
      //   base: "#F8F8FC",
      //   info: "#788CDE",
      //   success: "#15704B",
      //   warning: "#A98304",
      //   error: "#E4537F",
      //   sideNav: "#111827",
      //   sideNavHover: "#111827",
      //   hoverButton: "#111827",
      //   title: "#111827",
      //   designTable: "#111827",
      //   reportCheck: "#111827",
      //   designTableTr: "#111827",
      //   popUp: "#111827",
      //   sideNavSetting: "#111827",
      //   tableHead: "#111827",
      //   //
      //   input: "#1f2937",
      //   designTableHead: "#1f2937",
      //   designTableTitle: "#1f2937",
      //   voucherFilter: "#1f2937",
      //   voucherTitlesHover: "#1f2937",
      //   text: "#1f2937",
      //   sideNavActive: "#1f2937",
      //   tableBody: "#1f2937",
      //   dropDown: "#1f2937",
      //   select: "#1f2937",
      //   textAria: "#1f2937",
      //   //
      //   nav: "#141c2a",
      //   bottomTool: "#141c2a",
      //   toolBar: "#141c2a",
      //   button: "#141c2a",
      //   sortBy: "#141c2a",
      //   card: "#141c2a",
      //   //
      //   setting: "#374151",
      //   tableBodyHover: "#374151",
      //   dropDownHover: "#374151",
      //   tripCount: "#374151",
      //   th: "#374151",
      //   //
      //   bgLeftNav: "#1b2432",
      //   content: "#1b2432",
      //   //
      //   icon: "#6b7280",
      //   textGray: "#6b7280",
      //   //
      //   sideNavActiveBorder: "#3b82f6",
      //   td: "#4b5563",
      //   iconHover: "#e5e7eb",
      //   searchFilterBorder: "#e5e7eb",
      //   designTableTrHover: "#d1d5db",
      //   customer: "#ededed",
      //   namePage: "#dcdde3",
      //   // buttons
      //   create: "#2ecc71",
      //   createHover: "#139e4d",
      //   delete: "#E92E33",
      //   deleteHover: "#CF2727",
      //   update: "#0099ff",
      //   updateHover: "#0075c3",
      //   back: "#205097",
      //   backHover: "#163f7c",
      //   print: "#27BEC4",
      //   printHover: "#199a9e",
      // },
      // light: {
      //   create: "#2ecc71",
      //   createHover: "#139e4d",
      //   delete: "#E92E33",
      //   deleteHover: "#CF2727",
      //   update: "#0099ff",
      //   updateHover: "#0075c3",
      //   back: "#205097",
      //   backHover: "#163f7c",
      //   print: "#27BEC4",
      //   printHover: "#199a9e",
      //   lightInput: "#e5e7eb",
      //   designTableLight: "#e5e7eb",
      //   voucherFilterLight: "#e5e7eb",
      //   textAriaLight: "#e5e7eb",
      //   selectLight: "#e5e7eb",
      //   //
      //   sideNavLightHover: "#c9c9c9",
      //   sideNavLightActive: "#ffff",
      //   searchFilterLightHover: "#c9c9c9",
      //   tripCountLight: "#c9c9c9",
      //   //
      //   LightTableHead: "#dcdde3",
      //   lightDropDown: "#dcdde3",
      //   designTableTitleLight: "#dcdde3",
      //   popUpLight: "#dcdde3",
      //   //
      //   textLight: "#d1d5db",
      //   lightDropDownHover: "#d1d5db",
      //   //
      //   lightBottomTool: "#cdd8f5",
      //   lightNav: "#cdd8f5",
      //   //
      //   lightToolBar: "#DBE7EF",
      //   sideNavLight: "#DBE7EF",
      //   //
      //   settingLight: "#d2d4dc",
      //   settingLightHover: "#d2d4dc",
      //   //
      //   sortByLight: "#e2e8f0",
      //   cardLight: "#e2e8f0",
      //   //
      //   voucherTitlesLightHover: "#9ca3af",
      //   tdLight: "#9ca3af",
      //   //
      //   designTableTrLight: "#f3f4f6",
      //   reportCheckLight: "#f3f4f6",
      //   //
      //   iconLight: "#374151",
      //   searchFilterBorderLight: "#374151",
      //   //
      //   sideNavLightActiveBorder: "#f87171",
      //   sideNavLeftLight: "#0099ff",
      //   lightCard: "#90A3D5",
      //   iconHoverLight: "#4b5563",
      //   lightContent: "#ebf0ff",
      //   thLight: "#6b7280",
      //   bgLeftNavLight: "#fff",
      // },
      // theme2: {
      //   create: "#000",
      //   createHover: "#000",
      //   delete: "#000",
      //   deleteHover: "#000",
      //   update: "#000",
      //   updateHover: "#000",
      //   back: "#000",
      //   backHover: "#000",
      //   print: "#000",
      //   printHover: "#0000",
      // },
      // theme3: {
      //   create: "#fff",
      //   createHover: "#fff",
      //   delete: "#fff",
      //   deleteHover: "#fff",
      //   update: "#fff",
      //   updateHover: "#fff",
      //   back: "#fff",
      //   backHover: "#fff",
      //   print: "#fff",
      //   printHover: "#fff",
      // },
      // autumn: {
      //   primary: "#f00",
      //   secondary: "#9fd7f9",
      //   accent: "#378400",
      //   neutral: "#202531",
      //   base: "#F6F7F8",
      //   info: "#81CFF8",
      //   success: "#18B466",
      //   warning: "#D57C15",
      //   error: "#ED3B3E",
      // },
    },
  },
  plugins: [require("daisyui")],
  // plugins: [require("daisyui")],
};
