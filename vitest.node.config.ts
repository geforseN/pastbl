import { mergeConfig, type UserConfig } from "vitest/config";
import baseConfig from "./vitest.__base__.config";

export default mergeConfig(baseConfig, {
  test: {
    include: [
      "{server,layers,app}/**/*.node.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
  },
} satisfies UserConfig);
