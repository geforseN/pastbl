import daisyui from "daisyui";
import type { Config } from "tailwindcss";
import config from "../tailwind.config";

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
