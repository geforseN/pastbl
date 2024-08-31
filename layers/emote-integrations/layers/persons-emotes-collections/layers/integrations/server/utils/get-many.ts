import { personEmoteIntegrations } from "./-record";

export async function getPersonEmoteIntegrations<S extends EmoteSource>(
  sources: S[],
  personTwitch: PersonTwitch,
) {
  const integrations = await Promise.all(
    sources.map((source) => personEmoteIntegrations.of(source).get(personTwitch)),
  );
  const grouped = flatGroupBySource(integrations);
  return grouped;
}
