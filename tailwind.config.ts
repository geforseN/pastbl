import type { Config } from "tailwindcss";
import daisyuiThemes from "daisyui/src/theming/themes";
import { screens } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./config/css.{js, ts}"],
  theme: {
    screens: {
      xs: "420px",
      sm: screens.sm,
      md: screens.md,
      "go-brr": "890px",
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
  plugins: [
    require("daisyui"),
    require("tailwindcss-debug-screens"),
    require("tailwind-scrollbar"),
  ],
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
