export const emoteSources = [
  "BetterTTV" as const,
  "FrankerFaceZ" as const,
  "SevenTV" as const,
  "Twitch" as const,
];
export type EmoteSource = (typeof emoteSources)[number];

const emoteSourcesSet = new Set<EmoteSource>(emoteSources);

export function isEmoteSource(maybeSource: string): maybeSource is EmoteSource {
  return emoteSourcesSet.has(maybeSource as EmoteSource);
}
