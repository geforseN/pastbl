import daisyui from "daisyui";
import type { Config } from "tailwindcss";
import config from "../../tailwind.config";

export default {
  ...config,
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  plugins: [
    daisyui,
  ],
} satisfies Config;
