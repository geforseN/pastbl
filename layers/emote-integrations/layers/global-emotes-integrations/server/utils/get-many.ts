import { flatGroupBySource } from "../../../emote-sources/utils/flat-group-by-source";
import type { EmoteSource } from "../../../emote-sources/utils/external";

export async function getGlobalEmotesIntegrations(sources: EmoteSource[]) {
  const values = await Promise.all(
    sources
      .toSorted()
      .map((source) => globalEmotesIntegrations.of(source).get()),
  );
  return flatGroupBySource(values);
}
