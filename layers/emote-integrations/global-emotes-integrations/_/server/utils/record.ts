export const globalEmotesIntegrations = {
  BetterTTV: new BetterTTVGlobalEmotesIntegration(),
  FrankerFaceZ: new FrankerFaceZGlobalEmotesIntegration(),
  SevenTV: new SevenTVGlobalEmotesIntegration(),
  Twitch: new TwitchGlobalEmotesIntegration(),
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
