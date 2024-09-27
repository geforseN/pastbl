import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
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
} as const satisfies NonNullable<Config["theme"]>;
