import type { Config } from "tailwindcss";
import daisyuiThemes from "daisyui/src/theming/themes";
import { screens } from "tailwindcss/defaultTheme";
import daisyui from "daisyui";
// @ts-expect-error @types/tailwindcss-debug-screens does not exist
import debugScreens from "tailwindcss-debug-screens";
import scrollbar from "tailwind-scrollbar";

export const goBrrScreenSize = "890px" as const;

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
  theme: {
    screens: {
      xs: "420px",
      sm: screens.sm,
      md: screens.md,
      "go-brr": goBrrScreenSize,
      lg: screens.lg,
      xl: screens.xl,
      "2xl": screens["2xl"],
    },
    extend: {
      spacing: {
        "twitch-badge": "18px",
      },
      colors: {
        "bttv-base": `#181d1f`,
        "bttv-accent": `#63b3ed`,
        "ffz-base": `#222222`,
        "ffz-accent": `#375a7f`,
        "7tv-base": `#181d1f`,
        "7tv-accent": `#2599cd`,
        "twitch-base": `#0E0E10`,
        "twitch-accent": `#a970ff`,
      },
    },
  },
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
