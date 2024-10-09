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
