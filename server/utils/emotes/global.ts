import { EmoteSource } from "~/integrations";
import { flatGroupBySource } from "~/utils/emote-collection";
import { findErrorMessage } from "~/utils/error";

const globalEmoteCollectionsGetters = {
  BetterTTV: getBetterTTVGlobalCollection,
  FrankerFaceZ: getFrankerFaceZGlobalCollection,
  SevenTV: getSevenTVGlobalCollection,
  Twitch: getTwitchGlobalCollection,
};

export async function getAllGlobalEmoteCollections() {
  // TODO: add four catches here
  // TODO: add timeout
  // TODO: ? add streaming ?
  const [BetterTTV, FrankerFaceZ, SevenTV, Twitch] = await Promise.all([
    globalEmoteCollectionsGetters.BetterTTV(),
    globalEmoteCollectionsGetters.FrankerFaceZ(),
    globalEmoteCollectionsGetters.SevenTV(),
    globalEmoteCollectionsGetters.Twitch(),
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
    sources.map((source) =>
      globalEmoteCollectionsGetters[source]().catch((reason) => ({
        source,
        status: "failed",
        reason: findErrorMessage(
          reason,
          `Failed to load ${source} Global Emote Integration`,
        ),
      })),
    ),
  );
  return flatGroupBySource(integrations);
}
