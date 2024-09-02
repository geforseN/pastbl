import { personEmoteIntegrations } from "./-record";

export async function getPersonAllEmoteIntegrations(
  personTwitch: PersonTwitch,
) {
  const [BetterTTV, FrankerFaceZ, SevenTV, Twitch] = await Promise.all([
    personEmoteIntegrations.of("BetterTTV").get(personTwitch),
    personEmoteIntegrations.of("FrankerFaceZ").get(personTwitch),
    personEmoteIntegrations.of("SevenTV").get(personTwitch),
    personEmoteIntegrations.of("Twitch").get(personTwitch),
  ]);
  return {
    BetterTTV,
    FrankerFaceZ,
    SevenTV,
    Twitch,
  };
}
