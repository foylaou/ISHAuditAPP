import type {Config} from "tailwindcss";
import daisyui from "daisyui";


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
    plugins: [daisyui], // 確保 DaisyUI 插件正確引入
    daisyui: {
        themes: [
            {
       ISHALight: {
        "primary": "#4062BB",
        "primary-content": "#F3F3F1",
        "secondary": "#28B5AD",
        "secondary-content": "#EBF2FA",
        "accent": "#EA5404",
        "accent-content": "#FFFFFF",
        "neutral": "#FFFFFF",
        "neutral-content": "#242C3A",
        "base-100": "#F3F6FA",
        "base-200": "#FCFCFC",
        "base-300": "#87b5fc",
        "base-content": "#292929",
        "info": "#C5E7E8",
        "info-content": "#234241",
        "success": "#7DB9DE",
        "success-content": "#00140e",
        "warning": "#FFC408",
        "warning-content": "#00140e",
        "error": "#952E27",
        "error-content": "#FFFFFF",
        },
        ISHADark: {
            "primary": "#4062BB",           // 更深沉的藍色
            "primary-content": "#F3F3F1",   // 保持亮色文字
            "secondary": "#1A7A75",         // 更深的青綠色
            "secondary-content": "#EBF2FA", // 保持亮色文字
            "accent": "#B34003",           // 更深的橘色
            "accent-content": "#FFFFFF",    // 保持白色文字
            "neutral": "#FFFFFF",          // 深灰近黑色
            "neutral-content": "#242C3A",   // 反轉為白色文字
            "base-100": "#22262A",         // 主要深色背景
            "base-200": "#2A2A2A",         // 稍微淺一點的深色
            "base-300": "#8a8a8a",         // 最淺的深色
            'base-400':'#242C3A',
            "base-content": "#ffffff",     // 主要文字顏色改為淺色
            "info": "#2B4748",             // 深色信息色
            "info-content": "#C5E7E8",     // 反轉原來的顏色
            "success": "#1B4D6B",          // 深色成功色
            "success-content": "#7DB9DE",   // 反轉原來的顏色
            "warning": "#8C6B00",          // 深色警告色
            "warning-content": "#FFC408",   // 反轉原來的顏色
            "error": "#6B2119",            // 深色錯誤色
            "error-content": "#FFFFFF",     // 保持白色文字
        },
      },

        ]
    }
} satisfies Config;


