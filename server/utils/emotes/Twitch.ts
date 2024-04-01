import assert from "node:assert";
import { makeUserIntegrationGetter } from "./integrations";
import {
  createUserEmote,
  createUserIntegration,
  type ITwitchEmote,
  type ITwitchUserIntegration,
} from "~/integrations/Twitch";
import { groupBy, objectEntries } from "~/utils/object";
import { makeTwitchGlobalCollection } from "~/integrations/Twitch";

export async function getTwitchGlobalCollection() {
  const response = await fetchTwitchGlobalEmotes();
  return makeTwitchGlobalCollection(response);
}

export const getUserTwitchIntegration = makeUserIntegrationGetter(
  "Twitch",
  async (account: TwitchUser) => {
    return await _getUserTwitchIntegration(account);
  },
);

async function _getUserTwitchIntegration(user: TwitchUser) {
  const emotesResponse = await fetchTwitchChatEmotes(user.id);
  const { data: emotesData } = emotesResponse;
  const groupedEmotes = groupBy(
    emotesData,
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
        updatedAt: Date.now(),
        emotes,
      };
    },
  );
  const reducedSetsRecord = sets.reduce(
    (acc, set) => {
      if (!Object.hasOwn(acc, set.name)) {
        acc[set.name] = set;
        return acc;
      }
      const existing = acc[set.name];
      existing.updatedAt = Math.max(existing.updatedAt, set.updatedAt);
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
