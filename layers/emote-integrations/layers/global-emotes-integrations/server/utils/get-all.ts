import { assert } from "~/utils/assert";
import type {
  BetterTTVGlobalEmotesIntegration,
  FrankerFaceZGlobalEmotesIntegration,
  SevenTVGlobalEmotesIntegration,
  TwitchGlobalEmotesIntegration,
} from "#build/types/nitro-imports";

export type GlobalEmoteIntegrationRecord = {
  BetterTTV: BetterTTVGlobalEmotesIntegration;
  FrankerFaceZ: FrankerFaceZGlobalEmotesIntegration;
  SevenTV: SevenTVGlobalEmotesIntegration;
  Twitch: TwitchGlobalEmotesIntegration;
};

const getters = [
  () => globalEmotesIntegrations.of("BetterTTV").get(),
  () => globalEmotesIntegrations.of("FrankerFaceZ").get(),
  () => globalEmotesIntegrations.of("SevenTV").get(),
  () => globalEmotesIntegrations.of("Twitch").get(),
] as const;

export async function getAllGlobalEmotesIntegrations() {
  const [BetterTTV, FrankerFaceZ, SevenTV, Twitch] = await Promise.all(
    getters.map((getter) => getter()),
  );

  assert.ok(BetterTTV && FrankerFaceZ && SevenTV && Twitch);

  return {
    BetterTTV,
    FrankerFaceZ,
    SevenTV,
    Twitch,
  };
}
