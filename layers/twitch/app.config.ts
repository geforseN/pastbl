import { twitchConfig } from "./config.ts";

export { twitchConfig } from "./config.ts";

export default defineAppConfig({ ...structuredClone(twitchConfig) });
