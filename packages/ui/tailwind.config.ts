import daisyui from "daisyui";
import config from "../../tailwind.config";
import type { Config } from "tailwindcss";

export default {
  ...config,
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  plugins: [
    daisyui,
  ],
} satisfies Config;
