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

const animate = require("tailwindcss-animate");
import { setupInspiraUI } from "@inspira-ui/plugins";
import type { Config } from "tailwindcss";
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["selector", "class"],
  safelist: ["dark"],
  prefix: "",

  content: [
    "./pages/**/*.{ts,tsx,vue}",
    "./components/**/*.{ts,tsx,vue}",
    "./app/**/*.{ts,tsx,vue}",
    "./src/**/*.{ts,tsx,vue}",
  ],
  theme: {
  	fontFamily: {
  		Tajawal: [
  			'Tajawal',
  			'sans-serif'
  		],
  		Tajawal_bold: [
  			'Tajawal_bold',
  			'sans-serif'
  		]
  	},
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			xs: '350px',
  			sm: '640px',
  			md: '768px',
  			lg: '1024px',
  			xl: '1280px',
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			mainBG: '#F2F3F5',
  			sideNav: '#E3E5E8',
  			sideNavHover: '#252526',
  			nav: '#333333',
  			bgLeftNav1: '#252526',
  			sideNavSetting: '#111827',
  			sideNavActive: '#1f2937',
  			navIconColoDark: '#858585',
  			navIconColorHoverDark: '#FEFEFE',
  			hoverButton: '#111827',
  			title: '#111827',
  			designTable: '#111827',
  			reportCheck: '#111827',
  			designTableTr: '#111827',
  			popUp: '#111827',
  			tableHead: '#111827',
  			input1: '#1f2937',
  			designTableHead: '#1f2937',
  			designTableTitle: '#1f2937',
  			voucherFilter: '#1f2937',
  			voucherTitlesHover: '#1f2937',
  			text: '#1f2937',
  			tableBody: '#1f2937',
  			dropDown: '#1f2937',
  			select: '#1f2937',
  			textAria: '#1f2937',
  			bottomTool: '#141c2a',
  			toolBar: '#141c2a',
  			button: '#141c2a',
  			sortBy: '#141c2a',
  			card1: '#141c2a',
  			setting: '#374151',
  			tableBodyHover: '#374151',
  			dropDownHover: '#374151',
  			tripCount: '#374151',
  			th: '#374151',
  			content: '#1b2432',
  			icon: '#6b7280',
  			textGray: '#6b7280',
  			sideNavActiveBorder: '#3b82f6',
  			td: '#4b5563',
  			iconHover: '#e5e7eb',
  			searchFilterBorder: '#e5e7eb',
  			designTableTrHover: '#d1d5db',
  			customer: '#ededed',
  			namePage: '#dcdde3',
  			create: '#2ecc71',
  			createHover: '#139e4d',
  			delete: '#E92E33',
  			deleteHover: '#CF2727',
  			update: '#0099ff',
  			updateHover: '#0075c3',
  			back: '#205097',
  			backHover: '#163f7c',
  			print: '#27BEC4',
  			printHover: '#199a9e',
  			darkNav: '#2f3349',
  			bgLeftNav: '#1b2432',
  			lightInput: '#e5e7eb',
  			designTableLight: '#e5e7eb',
  			voucherFilterLight: '#e5e7eb',
  			textAriaLight: '#e5e7eb',
  			selectLight: '#e5e7eb',
  			sideNavLightHover: '#c9c9c9',
  			sideNavLightActive: '#ffff',
  			searchFilterLightHover: '#c9c9c9',
  			tripCountLight: '#c9c9c9',
  			LightTableHead: '#dcdde3',
  			lightDropDown: '#dcdde3',
  			designTableTitleLight: '#dcdde3',
  			popUpLight: '#dcdde3',
  			textLight: '#d1d5db',
  			lightDropDownHover: '#d1d5db',
  			lightBottomTool: '#cdd8f5',
  			lightNav: '#cdd8f5',
  			lightToolBar: '#DBE7EF',
  			sideNavLight: '#DBE7EF',
  			settingLight: '#d2d4dc',
  			settingLightHover: '#d2d4dc',
  			sortByLight: '#e2e8f0',
  			cardLight: '#F2F3F5',
  			voucherTitlesLightHover: '#9ca3af',
  			tdLight: '#9ca3af',
  			designTableTrLight: '#f3f4f6',
  			reportCheckLight: '#f3f4f6',
  			iconLight: '#374151',
  			searchFilterBorderLight: '#374151',
  			sideNavLightActiveBorder: '#f87171',
  			sideNavLeftLight: '#0099ff',
  			lightCard: '#90A3D5',
  			iconHoverLight: '#4b5563',
  			lightContent: '#ebf0ff',
  			thLight: '#6b7280',
  			bgLeftNavLight: '#fff',
  			tableNew: '#2f3349',
  			tableHeaderNew: '#505051',
  			'primary-50': 'rgb(var(--primary-50))',
  			'primary-100': 'rgb(var(--primary-100))',
  			'primary-200': 'rgb(var(--primary-200))',
  			'primary-300': 'rgb(var(--primary-300))',
  			'primary-400': 'rgb(var(--primary-400))',
  			'primary-500': 'rgb(var(--primary-500))',
  			'primary-600': 'rgb(var(--primary-600))',
  			'primary-700': 'rgb(var(--primary-700))',
  			'primary-800': 'rgb(var(--primary-800))',
  			'primary-900': 'rgb(var(--primary-900))',
  			'primary-950': 'rgb(var(--primary-950))',
  			'surface-0': 'rgb(var(--surface-0))',
  			'surface-50': 'rgb(var(--surface-50))',
  			'surface-100': 'rgb(var(--surface-100))',
  			'surface-200': 'rgb(var(--surface-200))',
  			'surface-300': 'rgb(var(--surface-300))',
  			'surface-400': 'rgb(var(--surface-400))',
  			'surface-500': 'rgb(var(--surface-500))',
  			'surface-600': 'rgb(var(--surface-600))',
  			'surface-700': 'rgb(var(--surface-700))',
  			'surface-800': 'rgb(var(--surface-800))',
  			'surface-900': 'rgb(var(--surface-900))',
  			'surface-950': 'rgb(var(--surface-950))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			xl: 'calc(var(--radius) + 4px)',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: 0
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: 0
  				}
  			},
  			'collapsible-down': {
  				from: {
  					height: 0
  				},
  				to: {
  					height: 'var(--radix-collapsible-content-height)'
  				}
  			},
  			'collapsible-up': {
  				from: {
  					height: 'var(--radix-collapsible-content-height)'
  				},
  				to: {
  					height: 0
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'collapsible-down': 'collapsible-down 0.2s ease-in-out',
  			'collapsible-up': 'collapsible-up 0.2s ease-in-out'
  		}
  	}
  },
  plugins: [animate, setupInspiraUI, require("tailwindcss-animate")],
};