import type {Config} from "tailwindcss";
import daisyui from "daisyui";
import typography from "@tailwindcss/typography";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
        },
    },
    plugins: [daisyui, typography], // 確保 DaisyUI 插件正確引入
    daisyui: {
        themes: [
            "fantasy",
            "dark",
            "retro",
            {
                industrial_light: {
                    // Primary colors - 用於重要操作和主要介面元素
                    "primary": "#2563eb",        // 專業藍，表示可靠性
                    "primary-content": "#ffffff",

                    // Secondary colors - 用於次要操作和輔助資訊
                    "secondary": "#0f766e",      // 深青綠，代表環保和永續
                    "secondary-content": "#ffffff",

                    // Accent colors - 用於特殊強調
                    "accent": "#ea580c",         // 工安警示橙，代表注意事項
                    "accent-content": "#ffffff",

                    // Neutral colors - 用於介面框架
                    "neutral": "#334155",        // 專業灰，營造可靠感
                    "neutral-content": "#ffffff",

                    // Base colors - 基礎介面色彩
                    "base-100": "#ffffff",
                    "base-200": "#f3f4f6",
                    "base-300": "#e5e7eb",
                    "base-content": "#1e293b",

                    // State colors - 狀態提示色彩
                    "info": "#0284c7",          // 資訊藍，用於一般通知
                    "info-content": "#ffffff",
                    "success": "#059669",        // 安全綠，用於正常/安全狀態
                    "success-content": "#ffffff",
                    "warning": "#d97706",        // 警告橙，用於需注意狀態
                    "warning-content": "#ffffff",
                    "error": "#dc2626",          // 危險紅，用於緊急/危險狀態
                    "error-content": "#ffffff",

                    // 元件樣式
                    "--rounded-box": "0.5rem",   // 較小的圓角，顯得專業
                    "--rounded-btn": "0.375rem",
                    "--rounded-badge": "0.375rem",
                    "--animation-btn": "0.2s",
                    "--animation-input": "0.2s",
                    "--btn-focus-scale": "0.98",
                    "--border-btn": "1px",
                    "--tab-border": "1px",
                    "--tab-radius": "0.375rem",
                    "--tab-border-color": "rgba(0, 0, 0, 0.1)",
                    "--tab-padding": "1rem",
                    "--tab-bg": "#ffffff",
                    "--tab-corner-bg": "#ffffff",

                    // 特殊效果
                    "--glass-blur": "20px",
                    "--glass-opacity": "0.15",
                    "--glass-border-opacity": "0.05",
                    "--glass-reflex-degree": "90deg",
                    "--glass-reflex-opacity": "0.08",
                    "--glass-text-shadow-opacity": "0"
                },
                industrial_dark: {
                    // Primary colors
                    "primary": "#3b82f6",        // 調亮的專業藍
                    "primary-content": "#ffffff",

                    // Secondary colors
                    "secondary": "#14b8a6",      // 調亮的環保綠
                    "secondary-content": "#ffffff",

                    // Accent colors
                    "accent": "#f97316",         // 調亮的警示橙
                    "accent-content": "#ffffff",

                    // Neutral colors
                    "neutral": "#c8cacf",        // 調亮的專業灰
                    "neutral-content": "#ffffff",

                    // Base colors
                    "base-100": "#1e293b",       // 深色背景
                    "base-200": "#0f172a",
                    "base-300": "#020617",
                    "base-content": "#e2e8f0",

                    // State colors
                    "info": "#38bdf8",           // 調亮的資訊藍
                    "info-content": "#000000",
                    "success": "#10b981",        // 調亮的安全綠
                    "success-content": "#000000",
                    "warning": "#fb923c",        // 調亮的警告橙
                    "warning-content": "#000000",
                    "error": "#ef4444",          // 調亮的危險紅
                    "error-content": "#000000",

                    // 元件樣式
                    "--rounded-box": "0.5rem",
                    "--rounded-btn": "0.375rem",
                    "--rounded-badge": "0.375rem",
                    "--animation-btn": "0.2s",
                    "--animation-input": "0.2s",
                    "--btn-focus-scale": "0.98",
                    "--border-btn": "1px",
                    "--tab-border": "1px",
                    "--tab-radius": "0.375rem",
                    "--tab-border-color": "rgba(255, 255, 255, 0.1)",
                    "--tab-padding": "1rem",
                    "--tab-bg": "#1e293b",
                    "--tab-corner-bg": "#1e293b",

                    // 特殊效果
                    "--glass-blur": "20px",
                    "--glass-opacity": "0.1",
                    "--glass-border-opacity": "0.05",
                    "--glass-reflex-degree": "90deg",
                    "--glass-reflex-opacity": "0.04",
                    "--glass-text-shadow-opacity": "0"
                }
            },
        ],
        darkTheme: "dark", // 啟用的黑暗模式主題名稱
        styled: true,      // 啟用 DaisyUI 樣式設計
        utils: true,       // 啟用響應式和修飾符工具類
        logs: true,        // 控制台顯示 DaisyUI 配置
        themeRoot: ":root", // 應用主題顏色 CSS 變數的元素
    },
} satisfies Config;

//        mytheme: {
//           "primary": "#a991f7",
//           "secondary": "#f6d860",
//           "accent": "#37cdbe",
//           "neutral": "#3d4451",
//           "base-100": "#ffffff",
//
//           "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes
//           "--rounded-btn": "0.5rem", // border radius rounded-btn utility class, used in buttons and similar element
//           "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
//           "--animation-btn": "0.25s", // duration of animation when you click on button
//           "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
//           "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
//           "--border-btn": "1px", // border width of buttons
//           "--tab-border": "1px", // border width of tabs
//           "--tab-radius": "0.5rem", // border radius of tabs
//         },
//       },
