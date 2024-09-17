import { mergeConfig } from "vitest/config";
import baseConfig from "./vitest.__base__.config";

export default mergeConfig(baseConfig, {
  test: {
    include: [
      "{server,layers,app}/**/*.nuxt.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    environment: "nuxt",
  },
});
