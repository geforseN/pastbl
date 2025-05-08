import { flatGroupBySource } from "../../../../../emote-sources/utils/flat-group-by-source";
import type { EmoteSource } from "../../../../../emote-sources/utils/external";
import { personEmoteIntegrations } from "./-record.ts";

export async function getPersonEmoteIntegrations<S extends EmoteSource>(
  sources: S[],
  personTwitch: PersonTwitch,
) {
  const integrations = await Promise.all(
    sources.map((source) =>
      personEmoteIntegrations.of(source).get(personTwitch),
    ),
  );
  const grouped = flatGroupBySource(integrations);
  return grouped;
}
