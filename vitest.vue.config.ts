import baseConfig from "./vitest.__base__.config";
import { mergeConfig } from "vitest/config";

export default mergeConfig(baseConfig, {
  test: {
    include: [
      "**/*.vue.spec.ts",
    ],
    // exclude: [
    //   "**/*.spec.ts",
    // ]
  },
} satisfies import("vitest/config").UserConfig);
