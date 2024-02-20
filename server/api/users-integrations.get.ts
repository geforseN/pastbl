import { z } from "zod";
import { TwitchUser } from "~/server/api/twitch/users/[login].get";
import { groupBy, sum } from "~/utils/array";
import { flatGroupBy, objectEntries } from "~/utils/object";
import { toLowerCase } from "~/utils/string";
import {
  BetterTTV,
  EmoteSource,
  ITwitchUserIntegration,
  IUserEmoteCollection,
  IUserEmoteIntegration,
  SevenTV,
  createFFZPartialUserIntegration,
  createFFZUserIntegration,
  createFFZUserSets,
  emoteSources,
  isValidEmoteSource,
} from "~/integrations";
import { FrankerFaceZApi } from "~/integrations/api";
import { assert } from "~/utils/error";
import { createUserEmote, createUserIntegration } from "~/integrations/Twitch";

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

const userIntegrationsGetters = {
  async FrankerFaceZ(twitchUserId: number, twitchUserLogin: Lowercase<string>) {
    const [user, room] = await Promise.all([
      FrankerFaceZApi.getUser(twitchUserId, twitchUserLogin),
      FrankerFaceZApi.getRoom(twitchUserId),
    ]);
    const partialIntegration = createFFZPartialUserIntegration(user);
    const sets = createFFZUserSets(room.sets);
    return createFFZUserIntegration(partialIntegration, sets);
  },
  BetterTTV(twitchUserId: number, twitchUserLogin: Lowercase<string>) {
    return BetterTTV.giveUserIntegration(twitchUserId, twitchUserLogin);
  },
  SevenTV(twitchUserId: number, twitchUserLogin: Lowercase<string>) {
    return SevenTV.createUserIntegration(twitchUserId, twitchUserLogin);
  },
  async Twitch(
    twitchUserId: number,
    twitchUserLogin: Lowercase<string>,
    twitchUserNickname: string,
  ) {
    const emotesResponse = await $fetch("/api/twitch/chat/emotes", {
      query: {
        broadcaster_id: twitchUserId,
      },
    });
    const { data: emotesData } = emotesResponse;
    const twitchUser = {
      id: twitchUserId,
      login: twitchUserLogin,
      nickname: twitchUserNickname,
    };

    const groupedEmotes = groupBy(
      emotesData,
      (emote) =>
        makeTwitchKey(emote.emote_type, emote.tier, emote.emote_set_id),
      (emote): ITwitchUserIntegration["sets"][number]["emotes"][number] => {
        const url = emote.format.includes("animated")
          ? emote.images.url_1x.replace("/static/", "/animated/")
          : emote.images.url_1x;
        return createUserEmote(emote, url);
      },
    );
    const sets: ITwitchUserIntegration["sets"] = objectEntries(
      groupedEmotes,
    ).map(([key, emotes]) => {
      assert.ok(typeof key === "string");
      const [name, id] = key.split(":");
      return {
        id,
        name,
        source: "Twitch",
        updatedAt: Date.now(),
        emotes,
      };
    });
    const integration = createUserIntegration(twitchUser, sets);
    return integration;
  },
} as const;

const querySchema = z.object({
  sources: z
    .string()
    .max(sum(emoteSources, (source) => source.length, emoteSources.length))
    .optional()
    .transform((sources) => {
      if (!sources) {
        return emoteSources;
      }
      const validSources = Object.freeze(
        [...new Set(sources.split("+"))].filter(isValidEmoteSource),
      );
      if (!validSources.length) {
        return emoteSources;
      }
      return validSources;
    }),
  twitchUserId: z.string().transform((numAsString) => {
    const number = Number(numAsString);
    assert.ok(
      Number.isInteger(number),
      createError({
        statusCode: 400,
        message: "Twitch user id must be a integer",
      }),
    );
    return number;
  }),
  twitchUserNickname: z.string(),
});

function makeFailHandler(twitchUserNickname: string, source: EmoteSource) {
  return function (fail: unknown) {
    const reason =
      fail instanceof Error
        ? fail.message
        : `Failed to load ${source} integration of ${twitchUserNickname}`;
    return {
      status: "fail" as const,
      source,
      reason,
    };
  };
}

function withReadyStatus<I extends IUserEmoteIntegration>(integration: I) {
  return {
    ...integration,
    status: "ready" as const,
  };
}

function getUserCollectionIntegration(
  source: EmoteSource,
  twitchUserId: number,
  twitchUserLogin: Lowercase<string>,
  twitchUserNickname?: string,
): Promise<IUserEmoteIntegration> {
  return userIntegrationsGetters[source](
    twitchUserId,
    twitchUserLogin,
    twitchUserNickname,
  );
}

const getCachedUserIntegration = defineCachedFunction(
  async (
    source: EmoteSource,
    twitchUser: Pick<TwitchUser, "id" | "login" | "nickname">,
  ) => {
    try {
      const integration = await getUserCollectionIntegration(
        source,
        twitchUser.id,
        twitchUser.login,
        twitchUser.nickname,
      );
      return withReadyStatus(integration);
    } catch (error) {
      const failHandler = makeFailHandler(twitchUser.nickname, source);
      return failHandler(error);
    }
  },
  {
    maxAge: 60 * 5,
    swr: false,
    name: "user-integrations",
    getKey: (
      source: EmoteSource,
      twitchUser: Pick<TwitchUser, "id" | "login" | "nickname">,
    ) => `${twitchUser.login}:${source}`,
  },
);

export default defineEventHandler(async (event) => {
  const { sources, ...query } = querySchema.parse(getQuery(event));
  const twitchUser = {
    id: query.twitchUserId,
    nickname: query.twitchUserNickname,
    login: toLowerCase(query.twitchUserNickname),
  };
  const integrations = await Promise.all(
    sources.map((source) => getCachedUserIntegration(source, twitchUser)),
  );
  const groupedBySource = flatGroupBy(
    integrations,
    (integration) => integration.source,
  );
  return groupedBySource as IUserEmoteCollection["integrations"];
});
