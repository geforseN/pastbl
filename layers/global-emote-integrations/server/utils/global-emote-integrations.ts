import { emoteIntegrations, type EmoteSource } from "~/integrations";
import { flatGroupBySource } from "~~/layers/emotes/utils/emote-collection";
import { findErrorMessage } from "~/utils/error";
import type { TEmoteIntegrations } from "~/integrations/abstract";

function makeSettledGlobalIntegration<
  F extends TEmoteIntegrations.Global.Failed,
  R extends TEmoteIntegrations.Global.Ready,
  S extends EmoteSource,
>(integration: { name: S; getGlobalIntegration: () => Promise<R> }) {
  const source = integration.name;
  const getGlobalIntegration =
    integration.getGlobalIntegration.bind(integration);
  return async function () {
    try {
      const integration = await getGlobalIntegration();
      return <R>integration;
    } catch (reason) {
      return <F>{
        source,
        status: "failed",
        reason: findErrorMessage(
          reason,
          `Failed to load ${source} Global Emote Integration`,
        ),
      };
    }
  };
}

// FIXME: failed integration inference is broken
export const getters = {
  BetterTTV: makeSettledGlobalIntegration(emoteIntegrations.BetterTTV),
  FrankerFaceZ: makeSettledGlobalIntegration(emoteIntegrations.FrankerFaceZ),
  SevenTV: makeSettledGlobalIntegration(emoteIntegrations.SevenTV),
  Twitch: makeSettledGlobalIntegration(emoteIntegrations.Twitch),
};

export function defineGlobalEmoteIntegrationsEventHandler(PATH, consola) {
  const router = createRouter();
  for (const [source, getIntegration] of Object.entries(getters)) {
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
  return useBase(PATH, router.handler);
}

export async function getAllGlobalEmoteIntegrations() {
  const [BetterTTV, FrankerFaceZ, SevenTV, Twitch] = await Promise.all([
    getters.BetterTTV(),
    getters.FrankerFaceZ(),
    getters.SevenTV(),
    getters.Twitch(),
  ]);

  return {
    BetterTTV,
    FrankerFaceZ,
    SevenTV,
    Twitch,
  };
}

export async function getGlobalEmoteIntegrations(sources: EmoteSource[]) {
  const integrations = await Promise.all(
    sources.toSorted().map((source) => getters[source]()),
  );
  return flatGroupBySource(integrations);
}

export function getGlobalEmoteIntegration(source: EmoteSource) {
  return getters[source]();
}
