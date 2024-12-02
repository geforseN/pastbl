import daisyui from "daisyui";
import type { Config } from "tailwindcss";
import config from "../../tailwind.config";

export default {
  ...config,
  content: [
    "./src/**/*.{vue,js,ts}",
    "./index.html",
    "./playground.vue",
  ],
  plugins: [
    daisyui,
  ],
} satisfies Config;
