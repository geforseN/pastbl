import { createRouter, defineEventHandler, useBase } from "h3";
import { consola } from "consola";
import { globalEmoteIntegrationsGetters } from "~/server/utils/emotes/global";

const router = createRouter();

const PATH = "/api/v1/collections/global/integrations";

for (const [source, getIntegration] of Object.entries(
  globalEmoteIntegrationsGetters,
)) {
  router.get(
    "/" + source,
    defineEventHandler(async () => {
      const LOG_STR = "GET " + PATH + "/" + source;
      consola.debug(LOG_STR);
      const integration = await getIntegration();
      consola.debug(LOG_STR + ":" + integration.status);
      return integration;
    }),
  );
}

export default useBase(PATH, router.handler);
