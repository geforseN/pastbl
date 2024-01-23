import { z } from "zod";
import type { TwitchUser } from "~/server/api/twitch/users/[login].get";
import {
  BetterTTV,
  EmoteSource,
  SevenTV,
  createFFZPartialUserIntegration,
  createFFZUserIntegration,
  createFFZUserSets,
} from "~/integrations";
import { FrankerFaceZApi } from "~/integrations/api";
import { flatGroupBy } from "~/utils/object";

const querySchema = z.object({
  nicknames: z
    // TODO: add max length
    .string()
    .optional()
    .transform((nicknames) => {
      if (!nicknames) {
        return;
      }
      return nicknames.split(" ");
    }),
});

const getCachedUserCollection = defineCachedFunction(
  async (nickname: string) => {
    const twitchUser = await $fetch(`/api/twitch/users/${nickname}`);
    const makeErrorHandler = handleError.bind(null, twitchUser);
    const [FrankerFaceZ, BetterTTV, SevenTV] = await Promise.all([
      getFFZUserIntegration(twitchUser).catch(makeErrorHandler("FrankerFaceZ")),
      getBTTVUserIntegration(twitchUser).catch(makeErrorHandler("BetterTTV")),
      get7TVUserIntegration(twitchUser).catch(makeErrorHandler("SevenTV")),
    ]);
    return {
      Twitch: {
        ...twitchUser,
      },
      FrankerFaceZ,
      BetterTTV,
      SevenTV,
    };
  },
  {
    maxAge: 60 * 10 /* 10 minutes */,
    name: "user-collection",
    getKey: (source: EmoteSource) => source,
  },
);

export default defineEventHandler(async (event) => {
  const { nicknames } = querySchema.parse(getQuery(event));
  if (!nicknames) {
    return setResponseStatus(event, 204);
  }
  const collections = await Promise.all(nicknames.map(getCachedUserCollection));
  const groupedByNicknames = flatGroupBy(
    collections,
    (collection) => collection.Twitch.nickname,
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
    const failReason =
      error instanceof Error
        ? error.message
        : `Failed to load ${source} integration of ${user.nickname}`;
    return {
      failReason,
    };
  };
}
