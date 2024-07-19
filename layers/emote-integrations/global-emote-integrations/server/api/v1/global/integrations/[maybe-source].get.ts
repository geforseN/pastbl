import { consola } from "consola";
import url from "node:url";

const filename = url.fileURLToPath(import.meta.url);

consola.info("global-emote-integrations-getters", {
  url,
  meta: import.meta,
});

export default defineGlobalEmoteIntegrationsEventHandlers(filename);
