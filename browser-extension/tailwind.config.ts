import daisyuiThemes from "daisyui/src/theming/themes";
import daisyui from "daisyui";
import config from "../tailwind.config";
import type { Config } from "tailwindcss";

export default {
  ...config,
  content: ["assets/**", "entrypoints/**", "components/**"],
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
