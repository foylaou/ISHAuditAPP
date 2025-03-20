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
                "footer-bg": "#242C3A",
                'light-primary-hover': '#5f80d1',
            },
        },
    },
    plugins: [
        daisyui,
        plugin(({ addBase, addUtilities }) => {
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
                },
                // 隐藏跳转链接文本 (c, u, z, l)
                'a[accessKey="c"], a[accessKey="u"], a[accessKey="z"], a[accessKey="l"]': {
                    'color': 'transparent',
                },
                // 选中或悬停时显示文本
                'a[accessKey="c"]:focus, a[accessKey="c"]:hover, a[accessKey="u"]:focus, a[accessKey="u"]:hover, a[accessKey="z"]:focus, a[accessKey="z"]:hover, a[accessKey="l"]:focus, a[accessKey="l"]:hover': {
                    'color': 'var(--base-content)',
                    'background-color': 'var(--base-100)',
                },
            });

            // 添加自定义工具类用于跳转链接
            addUtilities({
                '.skip-link-hidden': {
                    'color': 'transparent',
                    'transition': 'color 0.2s ease',
                },
                '.skip-link-hidden:focus, .skip-link-hidden:hover': {
                    'color': 'var(--base-content)',
                    'background-color': 'var(--base-100)',
                },
            });
        }),
    ],
    daisyui: {
        themes: [
            {
                ISHALight: {
                    "primary": "#4062BB",
                    "primary-hover": "#5f80d1",
                    "primary-content": "#F3F3F1",
                    "secondary": "#28B5AD",
                    "secondary-content": "#EBF2FA",
                    "accent": "#EA5404",
                    "accent-content": "#FFFFFF",
                    "neutral": "#2b2b2b",
                    "neutral-content": "#939393",
                    "base-100": "#F3F6FA",
                    "base-200": "#FCFCFC",
                    "base-300": "#c5d9fd",
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
                    "neutral": "#414e6c",
                    "neutral-content": "#cccccc",
                    "base-100": "#22262A",
                    "base-200": "#404040",
                    "base-300": "#8a8a8a",
                    "base-content": "#ffffff",
                    "info": "#2B4748",
                    "info-content": "#C5E7E8",
                    "success": "#1B4D6B",
                    "success-content": "#7DB9DE",
                    "warning": "#8C6B00",
                    "warning-content": "#FFC408",
                    "error": "#ff0000",
                    "error-content": "#FFFFFF",
                },
            },
        ]
    }
} satisfies Config;
