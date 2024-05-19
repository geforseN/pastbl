import {
  defineGlobalIntegrationMaker,
  definePersonIntegrationMaker,
} from "../common";
import { api } from "./api";
import type { API } from "./api-types";

function defineSetMaker<E, T>(name: string, transformEmote: (emote: E) => T) {
  return function (emotes: E[]) {
    return {
      name,
      emotes: emotes.map(transformEmote),
      source: "BetterTTV" as const,
    };
  };
}

function makeEmote<E extends API.Emote>(
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

const makePersonIntegration = definePersonIntegrationMaker("BetterTTV");

function makeOwner(bttv: API.User, twitch: TwitchUser) {
  return {
    avatarUrl: bttv.avatar,
    id: bttv.id,
    twitch,
    pageAddress: "https://betterttv.com/users/" + bttv.id,
  };
}

const makeChannelEmote = (emote: API.ChannelEmote) =>
  makeEmote(emote, {
    type: "channel",
    isModifier: false,
  });

const makeChannelSet = defineSetMaker("Channel emotes", makeChannelEmote);

const makeSharedEmote = (emote: API.SharedEmote) =>
  makeEmote(emote, {
    type: "shared",
    isModifier: false,
    codeOrigin: emote.codeOriginal,
    userId: emote.user.id,
  });

const makeSharedSet = defineSetMaker("Shared emotes", makeSharedEmote);

const makeGlobalIntegration = defineGlobalIntegrationMaker("BetterTTV");

const makeGlobalEmote = (emote: API.GlobalEmote) =>
  makeEmote(emote, {
    type: "global",
    isModifier: emote.modifier,
  });

const makeGlobalSet = defineSetMaker("Global emotes", makeGlobalEmote);

export const BetterTTV = {
  async getPersonIntegration(twitch: TwitchUser) {
    const bttv = await api.getUserByTwitchId(twitch.id, twitch.login);
    const sets = [
      makeChannelSet(bttv.channelEmotes),
      makeSharedSet(bttv.sharedEmotes),
    ];
    const owner = makeOwner(bttv, twitch);
    return makePersonIntegration(sets, owner);
  },
  async getGlobalIntegration() {
    const apiEmotes = await api.getGlobalEmotes();
    const set = makeGlobalSet(apiEmotes);
    return makeGlobalIntegration([set]);
  },
};
