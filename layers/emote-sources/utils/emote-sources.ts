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

class EmotesSources<T extends string> {
  set: Set<T> = new Set();

  constructor(public readonly values: T[]) {
    this.set = new Set(values);
  }

  has(value: string): value is T {
    return this.set.has(value as T);
  }
}

export const allEmotesSources = new EmotesSources(emoteSources);
