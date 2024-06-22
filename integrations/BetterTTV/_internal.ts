import {
  defineGlobalIntegrationMaker,
  definePersonIntegrationMaker,
} from "../common";
import type { IBetterTTV } from "./api-types";

function defineSetMaker<E, T>(name: string, transformEmote: (emote: E) => T) {
  return function (emotes: E[]) {
    return {
      name,
      emotes: emotes.map(transformEmote),
      source: "BetterTTV" as const,
    };
  };
}

function makeEmote<E extends IBetterTTV.API.Emote>(
  emote: E,
  additional: { type: string } & Record<string, unknown>,
) {
  return {
    id: emote.id,
    isAnimated: emote.animated,
    token: emote.code,
    source: "BetterTTV",
    url: `https://cdn.betterttv.net/emote/${emote.id}/1x.webp` as const,
    width: emote.width,
    height: emote.height,
    ...additional,
  };
}

export const makePersonIntegration = definePersonIntegrationMaker("BetterTTV");

export function makeOwner(bttv: IBetterTTV.API.User, twitch: PersonTwitch) {
  return {
    avatarUrl: bttv.avatar,
    id: bttv.id,
    twitch,
    pageAddress: "https://betterttv.com/users/" + bttv.id,
  };
}

const makeChannelEmote = (emote: IBetterTTV.API.ChannelEmote) =>
  makeEmote(emote, {
    type: "channel",
    isModifier: false,
  });

export const makeChannelSet = defineSetMaker(
  "Channel emotes",
  makeChannelEmote,
);

const makeSharedEmote = (emote: IBetterTTV.API.SharedEmote) =>
  makeEmote(emote, {
    type: "shared",
    isModifier: false,
    codeOrigin: emote.codeOriginal,
    userId: emote.user.id,
  });

export const makeSharedSet = defineSetMaker("Shared emotes", makeSharedEmote);

export const makeGlobalIntegration = defineGlobalIntegrationMaker("BetterTTV");

const makeGlobalEmote = (emote: IBetterTTV.API.GlobalEmote) =>
  makeEmote(emote, {
    type: "global",
    isModifier: emote.modifier,
  });

export const makeGlobalSet = defineSetMaker("Global emotes", makeGlobalEmote);
