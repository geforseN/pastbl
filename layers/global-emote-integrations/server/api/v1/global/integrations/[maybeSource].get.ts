import { consola } from "consola";

const PATH = "/api/v1/collections/global/integrations";

consola.info("globalIntegrationsGetters", {
  PATH,
  meta: import.meta,
});

export default defineGlobalEmoteIntegrationsEventHandler(PATH, consola);
