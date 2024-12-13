import { pastasConfig } from "./config.ts";
import { defineAppConfig } from "#app/nuxt";

export { pastasConfig } from "./config.ts";

export default defineAppConfig({ ...structuredClone(pastasConfig) });
