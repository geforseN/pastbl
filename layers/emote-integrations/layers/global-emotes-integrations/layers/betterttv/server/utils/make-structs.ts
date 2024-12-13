import { ReadyIntegration } from "../../../../../../shared/abstract/types";
import type * as TBetterTTV from "#t_betterttv";

function makeBetterTTVGlobalEmote(
  emote: TBetterTTV.Api.GlobalEmote,
): TBetterTTV.Global.Emote {
  return makeBetterTTVEmote(emote, {
    type: "global",
    isModifier: emote.modifier,
    isListed: true,
  });
}

export const makeBetterTTVGlobalSet = defineBetterTTVSetMaker(
  "Global emotes",
  "global",
  makeBetterTTVGlobalEmote,
);

export const makeBetterTTVGlobalIntegration
  = defineGlobalIntegrationMaker<TBetterTTV.Global.ReadyIntegration>("BetterTTV");
