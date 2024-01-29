import { z } from "zod";
import { flatGroupBy } from "~/utils/object";
import type { TwitchUser } from "~/server/api/twitch/users/[login].get";
import {
  BetterTTV,
  EmoteSource,
  IUserEmoteIntegration,
  SevenTV,
  createFFZPartialUserIntegration,
  createFFZUserIntegration,
  createFFZUserSets,
} from "~/integrations";
import { FrankerFaceZApi } from "~/integrations/api";

const getCachedUserCollection = defineCachedFunction(
  async (nickname: string) => {
    const twitchUser = await $fetch(`/api/twitch/users/${nickname}`);
    const makeErrorHandler = handleError.bind(null, twitchUser);
    const [FrankerFaceZ, BetterTTV, SevenTV] = await Promise.all([
      getFFZUserIntegration(twitchUser)
        .then(addReadyStatus)
        .catch(makeErrorHandler("FrankerFaceZ")),
      getBTTVUserIntegration(twitchUser)
        .then(addReadyStatus)
        .catch(makeErrorHandler("BetterTTV")),
      get7TVUserIntegration(twitchUser)
        .then(addReadyStatus)
        .catch(makeErrorHandler("SevenTV")),
    ]);
    return {
      user: {
        twitch: twitchUser,
      },
      integrations: {
        FrankerFaceZ,
        BetterTTV,
        SevenTV,
      },
      updatedAt: Date.now(),
    };
  },
  {
    maxAge: 60 * 10 /* 10 minutes */,
    swr: false,
    name: "user-collection",
    getKey: (source: EmoteSource) => source,
  },
);

const querySchema = z.object({
  nicknames: z
    .string()
    .max(128)
    .transform((nicknamesStr) => {
      if (!nicknamesStr) {
        throw createError({
          statusCode: 400,
          message: "No nicknames provided in the query string",
        });
      }
      const nicknames = nicknamesStr
        .split("+")
        .map((nickname) => nickname.trim());
      return [...new Set(nicknames)];
    }),
});

export default defineEventHandler(async (event) => {
  const { nicknames } = querySchema.parse(getQuery(event));
  const collections = await Promise.all(
    nicknames.map((nickname) => getCachedUserCollection(nickname)),
  );
  const groupedByNicknames = flatGroupBy(
    collections,
    (collection) => collection.user.twitch.login,
  );
  return groupedByNicknames;
});

async function getFFZUserIntegration(twitchUser: TwitchUser) {
  const [user, room] = await Promise.all([
    FrankerFaceZApi.getUser(twitchUser.id, twitchUser.login),
    FrankerFaceZApi.getRoom(twitchUser.id),
  ]);
  const partialIntegration = createFFZPartialUserIntegration(user);
  const sets = createFFZUserSets(room.sets);
  return createFFZUserIntegration(partialIntegration, sets);
}

function getBTTVUserIntegration(twitchUser: TwitchUser) {
  return BetterTTV.giveUserIntegration(twitchUser.id, twitchUser.login);
}

function get7TVUserIntegration(twitchUser: TwitchUser) {
  return SevenTV.giveUserIntegration(twitchUser.id, twitchUser.login);
}

function handleError(user: TwitchUser, source: EmoteSource) {
  return function (error: unknown) {
    const reason =
      error instanceof Error
        ? error.message
        : `Failed to load ${source} integration of ${user.nickname}`;
    return {
      status: "fail" as const,
      source,
      reason,
    };
  };
}

function addReadyStatus<I extends IUserEmoteIntegration>(integration: I) {
  return {
    ...integration,
    status: "ready" as const,
  };
}
