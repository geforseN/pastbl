import type { EmoteSource } from "../../emote-sources/utils/external";

export type SomeEmoteSource = EmoteSource | { source: EmoteSource };

export function getEmoteSource(source: SomeEmoteSource) {
  return typeof source === "string" ? source : source.source;
}
