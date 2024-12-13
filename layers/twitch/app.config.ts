import { twitchConfig } from "./config.ts";
import { defineAppConfig } from "#app/nuxt";

export { twitchConfig } from "./config.ts";

export default defineAppConfig({ ...structuredClone(twitchConfig) });
