import { groupBy } from "~/utils/object";
import { assert } from "~/utils/error";
import {
  defineGlobalIntegrationMaker,
  definePersonIntegrationMaker,
} from "~/integrations/_internal";
import type { TTwitch } from "./types";

function getEmoteSetName(emote: {
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

function makeEmote<T extends TTwitch.EmoteType>(
  emote: ITwitch.API.ChatEmote | ITwitch.API.GlobalEmote,
  type: T,
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
    source: "Twitch" as const,
    type,
    isAnimated,
    isListed: true,
    isModifier: false,
    isWrapper: false,
    width: 28,
    height: 28,
  };
}

export function makeOwner(
  twitch: PersonTwitch,
): TTwitch.Person.IntegrationOwner {
  return {
    pageAddress: `https://twitch.tv/${twitch.login}`,
    twitch: {
      user: twitch,
    },
  };
}

export function makePersonSets(
  emotes: ITwitch.API.GetChatEmotesResponse["data"],
): TTwitch.Person.Set[] {
  const groupedEmotesBySetName = groupBy(
    emotes,
    getEmoteSetName,
    (emote): TTwitch.ChannelEmote => makeEmote(emote, "channel"),
  );
  return Object.entries(groupedEmotesBySetName)
    .map(([name, emotes]) => ({
      source: "Twitch" as const,
      name,
      emotes,
      type: "channel" as const,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const makePersonIntegration =
  definePersonIntegrationMaker<TTwitch.Person.ReadyIntegration>("Twitch");

export function getGlobalEmoteSet(response: ITwitch.API.ChatEmotesResponse) {
  return {
    name: "Global Emotes",
    source: "Twitch",
    emotes: response.data.map((emote) => makeEmote(emote, "global")),
  };
}

export const makeGlobalIntegration =
  defineGlobalIntegrationMaker<TTwitch.Global.ReadyIntegration>("Twitch");
