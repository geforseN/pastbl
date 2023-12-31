import type { Config } from "tailwindcss";
import daisyuiThemes from "daisyui/src/theming/themes";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [],
  theme: {
    screens: {
      xs: "420px",
      sm: defaultTheme.screens.sm,
      md: defaultTheme.screens.md,
      "go-brr": "890px",
      lg: defaultTheme.screens.lg,
      xl: defaultTheme.screens.xl,
      "2xl": defaultTheme.screens["2xl"],
    },
    extend: {
      spacing: {
        "twitch-badge": "18px",
      },
      gridTemplateRows: {
        layout: "4rem 1fr 4rem auto",
      },
      colors: {
        twitch: "#a970ff",
        "seventv-logo": "#29d8f6",
        "bttv-logo": "#d50014",
        bttv: "#1a202c",
        ffz: "#375a7f",
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("@savvywombat/tailwindcss-grid-areas"),
    require("tailwindcss-debug-screens"),
    require("tailwind-heropatterns"),
    require("tailwind-scrollbar"),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...daisyuiThemes["light"],
        },
      },
      {
        dark: {
          ...daisyuiThemes["dark"],
          "base-content": "#ffffff",
        },
      },
    ],
  },
} satisfies Config;
