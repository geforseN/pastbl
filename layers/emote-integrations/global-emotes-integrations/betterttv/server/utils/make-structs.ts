import type { BetterTTVApi } from "$/emote-integrations/integrations/betterttv/server/utils/api-types";
import type { TBetterTTV } from "$/emote-integrations/integrations/betterttv/server/utils/types-namespace";

function makeBetterTTVGlobalEmote(
  emote: BetterTTVApi.GlobalEmote,
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

export const makeBetterTTVGlobalIntegration =
  defineGlobalIntegrationMaker<TBetterTTV.Global.ReadyIntegration>("BetterTTV");
