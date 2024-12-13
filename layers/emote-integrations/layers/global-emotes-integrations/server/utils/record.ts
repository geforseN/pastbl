import { raise } from "../../../../../../app/utils/raise";
import type { EmoteSource } from "../../../emote-sources/utils/external";

export const globalEmotesIntegrations = {
  BetterTTV: new BetterTTVGlobalEmotesIntegration(
    new GlobalEmotesIntegrationWithFailControl("BetterTTV"),
  ),
  FrankerFaceZ: new FrankerFaceZGlobalEmotesIntegration(
    new GlobalEmotesIntegrationWithFailControl("FrankerFaceZ"),
  ),
  SevenTV: new SevenTVGlobalEmotesIntegration(
    new GlobalEmotesIntegrationWithFailControl("SevenTV"),
  ),
  Twitch: new TwitchGlobalEmotesIntegration(
    new GlobalEmotesIntegrationWithFailControl("Twitch"),
  ),
  of<T extends EmoteSource>(source: T) {
    return this[source] || raise();
  },
  *[Symbol.iterator]() {
    yield this.BetterTTV;
    yield this.FrankerFaceZ;
    yield this.SevenTV;
    yield this.Twitch;
  },
} as const;
