import type { Config } from "tailwindcss";
import daisyuiThemes from "daisyui/src/theming/themes";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
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
      colors: {
        twitch: "#a970ff",
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("@savvywombat/tailwindcss-grid-areas"),
    require("tailwindcss-debug-screens"),
    require("tailwind-heropatterns"),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...daisyuiThemes["[data-theme=light]"],
        },
      },
      {
        dark: {
          ...daisyuiThemes["[data-theme=dark]"],
          "base-content": "#ffffff",
        },
      },
    ],
  },
} satisfies Config;
