import {
  defineGlobalIntegrationMaker,
  definePersonIntegrationMaker,
} from "../common";
import type { ChatEmotesResponse, GlobalEmote, TwitchApi } from "./api-types";
import { fetchTwitchChatEmotes, fetchTwitchGlobalEmotes } from "./api";
import { groupBy } from "~/utils/object";
import { assert } from "~/utils/error";

function getSetName(emote: {
  emote_type: "bitstier" | "follower" | "subscriptions";
  tier: string;
}) {
  switch (emote.emote_type) {
    case "bitstier": {
      return `Bits emotes`;
    }
    case "follower": {
      return `Follower emotes`;
    }
    case "subscriptions": {
      const tier = Number(emote.tier) / 1000;
      assert.ok(!Number.isNaN(tier));
      return `Subscriber emotes - tier ${tier}`;
    }
    default: {
      throw new Error(`Unknown emote type: ${emote.emote_type}`);
    }
  }
}

function makeEmote(
  emote: TwitchApi["getChatEmotes"]["responseItem"] | GlobalEmote,
  type: "global" | "channel",
) {
  const isAnimated = emote.format.includes("animated");
  let url = emote.images.url_1x;
  if (isAnimated) {
    url = url.replace("/static/", "/animated/");
  }
  return {
    id: emote.id,
    token: emote.name,
    url,
    source: "Twitch",
    type,
    isAnimated,
    isListed: true,
    isModifier: false,
    isWrapper: false,
    width: 28,
    height: 28,
  };
}

function makeOwner(twitch: PersonTwitch) {
  return {
    pageAddress: "https://twitch.tv/" + twitch.login,
    twitch: {
      user: twitch,
    },
  };
}

function makePersonSets(emotes: TwitchApi["getChatEmotes"]["responseItem"][]) {
  const groupedEmotesBySetName = groupBy(emotes, getSetName, (emote) =>
    makeEmote(emote, "channel"),
  );
  return Object.entries(groupedEmotesBySetName)
    .map(([name, emotes]) => ({
      source: "Twitch",
      name,
      emotes,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

const makePersonIntegration = definePersonIntegrationMaker("Twitch");

function getGlobalEmoteSet(response: ChatEmotesResponse) {
  return {
    name: "Global Emotes",
    source: "Twitch",
    emotes: response.data.map((emote) => makeEmote(emote, "global")),
  };
}

export function makeTwitchGlobalIntegration(response: ChatEmotesResponse) {
  const set = getGlobalEmoteSet(response);
  return makeGlobalIntegration([set]);
}

const makeGlobalIntegration = defineGlobalIntegrationMaker("Twitch");

export const Twitch = {
  async getPersonIntegration(twitch: PersonTwitch) {
    const { data } = await fetchTwitchChatEmotes(twitch.id);
    const sets = makePersonSets(data);
    const owner = makeOwner(twitch);
    return makePersonIntegration(sets, owner);
  },
  async getGlobalIntegration() {
    const response = await fetchTwitchGlobalEmotes();
    return makeTwitchGlobalIntegration(response);
  },
};
