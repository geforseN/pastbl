import consola from "consola";
import type { GlobalEmoteIntegrationRecord } from "./get-all";

const consola_ = consola.withTag("global-emotes-integrations");

export function defineGlobalEmotesIntegrationEventHandler<
  S extends EmoteSource,
>(source: S) {
  const _integration = globalEmotesIntegrations.of(
    source,
  ) as GlobalEmoteIntegrationRecord[S];
  return async function (event: H3Event) {
    const url = getRequestURL(event);
    consola_.debug("GET", { url });
    const integration = (await _integration.get()) as Awaited<
      ReturnType<GlobalEmoteIntegrationRecord[S]["get"]>
    >;
    consola_.debug("GET", {
      url,
      status: integration.status,
      source: integration.source,
    });
    return {
      integration,
    };
  };
}
