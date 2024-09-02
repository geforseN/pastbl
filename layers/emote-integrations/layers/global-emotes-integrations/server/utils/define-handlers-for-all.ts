import { consola } from "consola";

export function defineGlobalEmotesIntegrationsEventHandlers(path: string) {
  const router = createRouter();
  for (const globalEmotesIntegration of globalEmotesIntegrations) {
    router.get(
      "/" + globalEmotesIntegration.source,
      defineEventHandler(async () => {
        const LOG_STR = "GET " + path + "/" + globalEmotesIntegration.source;
        consola.debug(LOG_STR);
        let integration: Awaited<
          ReturnType<typeof globalEmotesIntegration.get>
        >;
        try {
          integration = await globalEmotesIntegration.get();
          assert.ok(integration);
        } catch (reason) {
          const source = globalEmotesIntegration.source;
          return {
            source,
            status: "failed",
            reason: findErrorMessage(
              reason,
              `Failed to load ${source} Global Emote Integration`,
            ),
          };
        }
        consola.debug(LOG_STR + ":" + integration.status);
        return {
          integration,
        };
      }),
    );
  }
  return useBase(path, router.handler);
}
