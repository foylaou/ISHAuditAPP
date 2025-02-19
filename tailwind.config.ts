import { Config } from "tailwindcss";
import daisyui from "daisyui";
import plugin from 'tailwindcss/plugin';

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            ringColor: {
                'custom': '#e54646',
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                footerbg: "#242C3A",
            },
        },
    },
    plugins: [
        daisyui,
        plugin(({ addBase }) => {
            addBase({
                '@keyframes outlineGrow': {
                    '0%': {
                        'outline-width': '1px',
                        'outline-offset': '1px'
                    },
                    '100%': {
                        'outline-width': '4px',
                        'outline-offset': '4px'
                    }
                },
                // 移除滑鼠點擊時的 focus outline
                '*:focus:not(:focus-visible)': {
                    'outline': 'none'
                },
                // 鍵盤導航時的 focus-visible 效果
                ':focus-visible': {
                    'outline-style': 'dashed !important',
                    'outline-color': '#f4a261 !important',
                    'animation': 'outlineGrow 0.1s ease-out forwards !important',
                }
            });
        }),
    ],
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
                    "base-300": "#cad7f7",
                    "base-content": "#292929",
                    "info": "#76d5ff",
                    "info-content": "#234241",
                    "success": "#7DB9DE",
                    "success-content": "#00140e",
                    "warning": "#FFC408",
                    "warning-content": "#00140e",
                    "error": "#bc3c34",
                    "error-content": "#FFFFFF",
                },
                ISHADark: {
                    "primary": "#4062BB",
                    "primary-content": "#F3F3F1",
                    "secondary": "#1A7A75",
                    "secondary-content": "#EBF2FA",
                    "accent": "#B34003",
                    "accent-content": "#FFFFFF",
                    "neutral": "#242C3A",
                    "neutral-content": "#FFFFFF",
                    "base-100": "#22262A",
                    "base-200": "#2A2A2A",
                    "base-300": "#8a8a8a",
                    "base-content": "#ffffff",
                    "info": "#2B4748",
                    "info-content": "#C5E7E8",
                    "success": "#1B4D6B",
                    "success-content": "#7DB9DE",
                    "warning": "#8C6B00",
                    "warning-content": "#FFC408",
                    "error": "#6B2119",
                    "error-content": "#FFFFFF",
                },
            },
        ]
    }
} satisfies Config;
