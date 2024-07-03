import {
  defineGlobalIntegrationMaker,
  definePersonIntegrationMaker,
} from "~/integrations/_internal";
import type { TBetterTTV } from "./types";

function defineSetMaker<E, T, ET extends TBetterTTV.EmoteType>(
  name: string,
  type: ET,
  transformEmote: (emote: E) => T & { type: ET; source: "BetterTTV" },
) {
  return function (emotes: E[]) {
    return {
      name,
      type,
      emotes: emotes.map(transformEmote),
      source: "BetterTTV" as const,
    };
  };
}

function makeEmote<
  E extends IBetterTTV.API.Emote,
  T extends TBetterTTV.EmoteType,
  R extends { type: T } & Record<string, unknown>,
>(emote: E, additional: R) {
  return {
    id: emote.id,
    isAnimated: emote.animated,
    token: emote.code,
    source: "BetterTTV" as const,
    url: `https://cdn.betterttv.net/emote/${emote.id}/1x.webp` as const,
    width: emote.width,
    height: emote.height,
    ...additional,
  };
}

export const makePersonIntegration =
  definePersonIntegrationMaker<TBetterTTV.Person.ReadyIntegration>("BetterTTV");

export function makeOwner(
  bttv: IBetterTTV.API.User,
  twitch: PersonTwitch,
): TBetterTTV.Person.IntegrationOwner {
  return {
    avatarUrl: bttv.avatar,
    id: bttv.id,
    twitch,
    pageAddress: `https://betterttv.com/users/${bttv.id}`,
  };
}

function makeChannelEmote(
  emote: IBetterTTV.API.ChannelEmote,
): TBetterTTV.Person.ChannelEmote {
  return makeEmote(emote, {
    type: "channel",
    isModifier: false,
    isListed: true,
    isWrapper: false,
  });
}

export const makeChannelSet = defineSetMaker(
  "Channel emotes",
  "channel",
  makeChannelEmote,
);

function makeSharedEmote(
  emote: IBetterTTV.API.SharedEmote,
): TBetterTTV.Person.SharedEmote {
  return makeEmote(emote, {
    type: "shared",
    isModifier: false,
    isListed: true,
    isWrapper: false,
    codeOrigin: emote.codeOriginal,
    userId: emote.user.id,
  });
}

export const makeSharedSet = defineSetMaker(
  "Shared emotes",
  "shared",
  makeSharedEmote,
);

function makeGlobalEmote(
  emote: IBetterTTV.API.GlobalEmote,
): TBetterTTV.Global.Emote {
  return makeEmote(emote, {
    type: "global",
    isModifier: emote.modifier,
    isListed: true,
    isWrapper: false,
  });
}

export const makeGlobalSet = defineSetMaker(
  "Global emotes",
  "global",
  makeGlobalEmote,
);

export const makeGlobalIntegration =
  defineGlobalIntegrationMaker<TBetterTTV.Global.ReadyIntegration>("BetterTTV");
