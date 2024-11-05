import daisyui from "daisyui";
import config from "../tailwind.config";
import type { Config } from "tailwindcss";

export default {
  ...config,
  content: ["app/assets/**", "app/entrypoints/**", "app/components/**"],
  theme: {
    ...config.theme,
    extend: {
      ...config.theme.extend,
    },
  },
  plugins: [
    daisyui,
  ],
} satisfies Config;
