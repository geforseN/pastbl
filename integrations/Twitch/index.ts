import {
  definePersonIntegrationMaker,
  defineGlobalIntegrationMaker,
} from "../common";
import type { API } from "./api-types";
import { fetchTwitchChatEmotes, fetchTwitchGlobalEmotes } from "./api";
import type {
  InternalGlobalIntegration,
  IEmote,
  IEmoteSet,
  InternalUserEmoteIntegration,
  IEmoteCollectionOwner,
} from "~/integrations";
import type { TwitchApi } from "~/server/utils/twitch/twitch-api.types";
import { groupBy, objectEntries } from "~/utils/object";
import { assert } from "~/utils/error";

export interface ITwitchEmote extends IEmote {
  source: "Twitch";
  type: "global" | "channel";
  width: number;
  height: number;
}

// const makePersonIntegration = definePersonIntegrationMaker("Twitch");
const makeGlobalIntegration = defineGlobalIntegrationMaker("Twitch");

export interface ITwitchEmoteSet extends IEmoteSet<"Twitch", ITwitchEmote> {}
export interface ITwitchGlobalIntegration
  extends InternalGlobalIntegration<"Twitch", ITwitchEmoteSet> {}

function getTwitchGlobalEmoteSet(
  response: API.ChatEmotesResponse,
): ITwitchEmoteSet {
  return {
    name: "Global Emotes",
    source: "Twitch",
    formedAt: Date.now(),
    emotes: response.data.map((emote) => {
      const isAnimated = emote.format.includes("animated");
      let url = emote.images.url_1x;
      if (isAnimated) {
        url = url.replace("/static/", "/animated/");
      }
      return {
        id: emote.id,
        isAnimated,
        token: emote.name,
        url,
        type: "global",
        source: "Twitch",
        height: 28,
        width: 28,
        isListed: true,
        isModifier: false,
        isWrapper: false,
      };
    }),
  };
}

export function createUserEmote(
  apiEmote: TwitchApi["getChatEmotes"]["responseItem"],
  url: string,
): ITwitchEmote {
  return {
    url,
    height: 28,
    width: 28,
    source: "Twitch",
    isModifier: false,
    isWrapper: false,
    isListed: true,
    type: "channel",
    id: apiEmote.id,
    token: apiEmote.name,
    isAnimated: apiEmote.format.includes("animated"),
  };
}

export function makeTwitchGlobalIntegration(response: API.ChatEmotesResponse) {
  const set = getTwitchGlobalEmoteSet(response);
  return makeGlobalIntegration([set]);
}

interface ITwitchCollectionOwner extends IEmoteCollectionOwner {}

export interface ITwitchUserIntegration
  extends InternalUserEmoteIntegration<
    "Twitch",
    ITwitchEmoteSet,
    ITwitchCollectionOwner
  > {}

export function createUserIntegration(
  twitchUser: TwitchUser,
  sets: ITwitchEmoteSet[],
): ITwitchUserIntegration {
  return {
    name: `${twitchUser.nickname} Emotes`,
    source: "Twitch",
    sets,
    owner: {
      pageAddress: "https://twitch.tv/" + twitchUser.login,
      twitch: {
        user: twitchUser,
      },
    },
    formedAt: Date.now(),
  };
}

const twitchTypeRecord = {
  bitstier: "Bits emotes",
  follower: "Follower emotes",
  subscriptions: "Subscriber emotes",
} as const;

function makeTwitchKey(
  emoteType: "bitstier" | "follower" | "subscriptions",
  emoteTier: string,
  emoteSetId: string,
) {
  const type = twitchTypeRecord[emoteType];
  if (type !== "Subscriber emotes") {
    return type + ":" + emoteSetId;
  }
  const tier = Number(emoteTier) / 1000;
  assert.ok(!Number.isNaN(tier));
  return `${type} - tier ${tier}` + ":" + emoteSetId;
}

export function makePersonIntegration(
  apiEmotes: TwitchApi["getChatEmotes"]["responseItem"][],
  user: TwitchUser,
) {
  const groupedEmotes = groupBy(
    apiEmotes,
    (emote) => makeTwitchKey(emote.emote_type, emote.tier, emote.emote_set_id),
    (emote): ITwitchEmote => {
      const url = emote.format.includes("animated")
        ? emote.images.url_1x.replace("/static/", "/animated/")
        : emote.images.url_1x;
      return createUserEmote(emote, url);
    },
  );
  const sets: ITwitchUserIntegration["sets"] = objectEntries(groupedEmotes).map(
    ([key, emotes]) => {
      assert.ok(typeof key === "string");
      const [name, id] = key.split(":");
      return {
        id,
        name,
        source: "Twitch",
        formedAt: Date.now(),
        emotes,
      };
    },
  );
  const sortedSets = sets.sort((a, b) => a.name.localeCompare(b.name));
  const reducedSetsRecord = sortedSets.reduce(
    (acc, set) => {
      if (!Object.hasOwn(acc, set.name)) {
        acc[set.name] = set;
        return acc;
      }
      const existing = acc[set.name];
      existing.formedAt = Math.max(existing.formedAt, set.formedAt);
      existing.emotes.push(...set.emotes);
      existing.id += `+${set.id}`;
      return acc;
    },
    {} as Record<string, ITwitchUserIntegration["sets"][number]>,
  );
  const reducedSets = Object.values(reducedSetsRecord);
  const integration = createUserIntegration(user, reducedSets);
  return integration;
}

export const Twitch = {
  async getPersonIntegration(twitch: TwitchUser) {
    const { data } = await fetchTwitchChatEmotes(twitch.id);
    return makePersonIntegration(data, twitch);
  },
  async getGlobalIntegration() {
    const response = await fetchTwitchGlobalEmotes();
    return makeTwitchGlobalIntegration(response);
  },
};
