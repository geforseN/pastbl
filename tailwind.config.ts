import type { Config } from "tailwindcss";
import daisyuiThemes from "daisyui/src/theming/themes";
import daisyui from "daisyui";
// @ts-expect-error @types/tailwindcss-debug-screens does not exist
import debugScreens from "tailwindcss-debug-screens";
import scrollbar from "tailwind-scrollbar";
import theme from './tailwind.theme'

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "app/components/**/*.{js,vue,ts}",
    "app/layouts/*.vue",
    "app/pages/index.vue",
    "app/app.vue",
    "layers/**/*.vue",
    "layers/**/components/**/*.{js,vue,ts}",
    "layers/**/pages/**/*.vue",
  ],
  theme,
  plugins: [daisyui, debugScreens, scrollbar],
  daisyui: {
    themes: [
      {
        light: {
          ...daisyuiThemes.light,
        },
      },
      {
        dark: {
          ...daisyuiThemes.dark,
          "base-content": "#ffffff",
        },
      },
    ],
  },
} satisfies Config;
