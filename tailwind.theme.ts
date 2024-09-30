import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  screens: {
    "xs": "420px",
    "sm": defaultTheme.screens.sm,
    "md": defaultTheme.screens.md,
    "go-brr": "890px",
    "lg": defaultTheme.screens.lg,
    "xl": defaultTheme.screens.xl,
    "2xl": defaultTheme.screens["2xl"],
  },
  extend: {
    spacing: {
      "twitch-badge": "18px",
    },
    colors: {
      "bttv-base": `#181D1F`,
      "bttv-accent": `#63B3ED`,
      "ffz-base": `#222222`,
      "ffz-accent": `#375A7F`,
      "7tv-base": `#181D1F`,
      "7tv-accent": `#2599CD`,
      "twitch-base": `#0E0E10`,
      "twitch-accent": `#A970FF`,
    },
  },
} as const satisfies NonNullable<Config["theme"]>;
