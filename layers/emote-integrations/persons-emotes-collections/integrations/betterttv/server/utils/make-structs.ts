import type { BetterTTVApi } from "~~/layers/emote-integrations/integrations/betterttv/server/utils/api-types";
import type { TBetterTTV } from "~~/layers/emote-integrations/integrations/betterttv/server/utils/types-namespace";

export const makePersonBetterTTVEmoteIntegration =
  definePersonEmoteIntegrationMaker<TBetterTTV.Person.ReadyIntegration>("BetterTTV");

export function makeBetterTTVEmoteIntegrationOwner(
  bttv: BetterTTVApi.User,
  twitch: PersonTwitch,
): TBetterTTV.Person.IntegrationOwner {
  return {
    avatarUrl: bttv.avatar,
    id: bttv.id,
    twitch,
    pageAddress: `https://betterttv.com/users/${bttv.id}`,
  };
}

function makeBetterTTVChannelEmote(
  emote: BetterTTVApi.ChannelEmote,
): TBetterTTV.Person.ChannelEmote {
  return makeBetterTTVEmote(emote, {
    type: "channel",
    isModifier: false,
    isListed: true,
    isWrapper: false,
  });
}

export const makeBetterTTVChannelSet = defineBetterTTVSetMaker(
  "Channel emotes",
  "channel",
  makeBetterTTVChannelEmote,
);

function makeBetterTTVSharedEmote(
  emote: BetterTTVApi.SharedEmote,
): TBetterTTV.Person.SharedEmote {
  return makeBetterTTVEmote(emote, {
    type: "shared",
    isModifier: false,
    isListed: true,
    isWrapper: false,
    codeOrigin: emote.codeOriginal,
    userId: emote.user.id,
  });
}

export const makeBetterTTVSharedSet = defineBetterTTVSetMaker(
  "Shared emotes",
  "shared",
  makeBetterTTVSharedEmote,
);