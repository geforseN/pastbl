const source = "BetterTTV" as const;

export function defineBetterTTVSetMaker<E, T, ET extends TBetterTTV.EmoteType>(
  name: string,
  type: ET,
  transformEmote: (emote: E) => T & { type: ET; source: "BetterTTV" },
) {
  return function (emotes: E[]) {
    return {
      name,
      type,
      emotes: emotes.map(transformEmote),
      source,
    };
  };
}

export function makeBetterTTVEmote<
  E extends BetterTTVApi.Emote,
  T extends TBetterTTV.EmoteType,
  R extends { type: T } & Record<string, unknown>,
>(emote: E, additional: R) {
  return {
    id: emote.id,
    isAnimated: emote.animated,
    token: emote.code,
    source,
    url: `https://cdn.betterttv.net/emote/${emote.id}/1x.webp` as const,
    width: emote.width,
    height: emote.height,
    ...additional,
  };
}
