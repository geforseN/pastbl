function makeBetterTTVGlobalEmote(
  emote: TBetterTTV.Api.GlobalEmote,
): TBetterTTV.Global.Emote {
  return makeBetterTTVEmote(emote, {
    type: "global",
    isModifier: emote.modifier,
    isListed: true,
    isWrapper: false,
  });
}

export const makeBetterTTVGlobalSet = defineBetterTTVSetMaker(
  "Global emotes",
  "global",
  makeBetterTTVGlobalEmote,
);

export const makeBetterTTVGlobalIntegration
  = defineGlobalIntegrationMaker<TBetterTTV.Global.ReadyIntegration>("BetterTTV");
