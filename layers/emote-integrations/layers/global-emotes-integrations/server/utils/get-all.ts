const getters = [
  globalEmotesIntegrations.of("BetterTTV").get,
  globalEmotesIntegrations.of("FrankerFaceZ").get,
  globalEmotesIntegrations.of("SevenTV").get,
  globalEmotesIntegrations.of("Twitch").get,
];

export async function getAllGlobalEmotesIntegrations() {
  const [BetterTTV, FrankerFaceZ, SevenTV, Twitch] = await Promise.all(getters);

  return {
    BetterTTV,
    FrankerFaceZ,
    SevenTV,
    Twitch,
  };
}
