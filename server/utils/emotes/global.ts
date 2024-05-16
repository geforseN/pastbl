import { EmoteSource } from "~/integrations";
import { BetterTTV } from "~/integrations/BetterTTV";
import { FrankerFaceZ } from "~/integrations/FrankerFaceZ";
import { SevenTV } from "~/integrations/SevenTV";
import { Twitch } from "~/integrations/Twitch";

import {
  SettledEmoteIntegration,
  ReadyIntegration,
} from "~/integrations/integrations";
import { flatGroupBySource } from "~/utils/emote-collection";
import { findErrorMessage } from "~/utils/error";

export function makeLoadedIntegration<SO extends EmoteSource>(
  source: SO,
  getIntegration: () => Promise<Omit<ReadyIntegration<SO>, "status">>,
): () => Promise<SettledEmoteIntegration> {
  return async function () {
    try {
      const integration = await getIntegration();
      return { ...integration, status: "ready" };
    } catch (reason) {
      return {
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

export const globalEmoteIntegrationsGetters = {
  BetterTTV: makeLoadedIntegration("BetterTTV", BetterTTV.getGlobalIntegration),
  FrankerFaceZ: makeLoadedIntegration(
    "FrankerFaceZ",
    FrankerFaceZ.getGlobalIntegration,
  ),
  SevenTV: makeLoadedIntegration("SevenTV", SevenTV.getGlobalIntegration),
  Twitch: makeLoadedIntegration("Twitch", Twitch.getGlobalIntegration),
};

export async function getAllGlobalEmoteIntegrations() {
  const [BetterTTV, FrankerFaceZ, SevenTV, Twitch] = await Promise.all([
    globalEmoteIntegrationsGetters.BetterTTV(),
    globalEmoteIntegrationsGetters.FrankerFaceZ(),
    globalEmoteIntegrationsGetters.SevenTV(),
    globalEmoteIntegrationsGetters.Twitch(),
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
    sources
      .toSorted()
      .map((source) => globalEmoteIntegrationsGetters[source]()),
  );
  return flatGroupBySource(integrations);
}

export function getGlobalEmoteIntegration(source: EmoteSource) {
  return globalEmoteIntegrationsGetters[source]();
}
