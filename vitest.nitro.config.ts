import { mergeConfig, type UserConfig } from "vitest/config";
import baseConfig from "./vitest.config";

export default mergeConfig(baseConfig, {
  test: {
    include: [
      "{server,layers}/**/*nitro.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
  },
  nitro: {
    global: {
      rootDir: "server",
    },
  },
} satisfies UserConfig);
