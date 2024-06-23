import type { EmoteSource } from "~/integrations";

export type SomeEmoteSource = EmoteSource | { source: EmoteSource };

export function getEmoteSource(source: SomeEmoteSource) {
  return typeof source === "string" ? source : source.source;
}
