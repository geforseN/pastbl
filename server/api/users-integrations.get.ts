import { z } from "zod";
import { TwitchUser } from "~/server/api/twitch/users/[login].get";
import { sum } from "~/utils/array";
import { flatGroupBy } from "~/utils/object";
import { toLowerCase } from "~/utils/string";
import {
  AvailableEmoteSource,
  BetterTTV,
  EmoteSource,
  IUserEmoteCollection,
  IUserEmoteIntegration,
  SevenTV,
  availableEmoteSources,
  createFFZPartialUserIntegration,
  createFFZUserIntegration,
  createFFZUserSets,
  emoteSources,
  isValidEmoteSource,
} from "~/integrations";
import { FrankerFaceZApi } from "~/integrations/api";
import { assert } from "~/utils/error";

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
    return SevenTV.giveUserIntegration(twitchUserId, twitchUserLogin);
    // TODO: use activeSet
  },
  // TODO: Twitch, add follow set & subscribe set
};

type StupidSource = AvailableEmoteSource;

const querySchema = z.object({
  sources: z
    .string()
    .max(sum(emoteSources, (source) => source.length, emoteSources.length))
    .optional()
    .transform((sources) => {
      if (!sources) {
        return availableEmoteSources;
      }
      const validSources = Object.freeze(
        [...new Set(sources.split("+"))].filter(
          (source): source is StupidSource =>
            source !== "Twitch" && isValidEmoteSource(source),
        ),
      );
      if (!validSources.length) {
        return availableEmoteSources;
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
  source: StupidSource,
  twitchUserId: number,
  twitchUserLogin: Lowercase<string>,
): Promise<IUserEmoteIntegration> {
  return userIntegrationsGetters[source](twitchUserId, twitchUserLogin);
}

const getCachedUserIntegration = defineCachedFunction(
  async (
    source: StupidSource,
    twitchUser: Pick<TwitchUser, "id" | "login" | "nickname">,
  ) => {
    try {
      const integration = await getUserCollectionIntegration(
        source,
        twitchUser.id,
        twitchUser.login,
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
      source: StupidSource,
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
