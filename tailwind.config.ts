import type { Config } from "tailwindcss";
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
  plugins: [daisyui,typography], // 確保 DaisyUI 插件正確引入
   daisyui: {
    themes: ["fantasy", "dark", "retro"], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
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
