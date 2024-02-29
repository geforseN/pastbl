import { z } from "zod";
import { flatGroupBy } from "~/utils/object";
import { emoteSources } from "~/integrations";
import { assert } from "~/utils/error";

const sourcesQuery = emoteSources.join("+");

const getCachedUserCollection = defineCachedFunction(
  async (nickname: string) => {
    const twitchUser = await $fetch(`/api/twitch/users/${nickname}`);
    const integrations = await $fetch(`/api/collections/users/integrations`, {
      query: {
        sources: sourcesQuery,
        twitchUserId: twitchUser.id,
        twitchUserNickname: twitchUser.login,
      },
    });
    return {
      user: {
        twitch: twitchUser,
      },
      integrations,
      updatedAt: Date.now(),
    };
  },
  {
    maxAge: 60 * 10,
    swr: false,
    name: "user-collection",
    getKey: (nickname: string) => nickname,
  },
);

const querySchema = z.object({
  nicknames: z
    .string()
    .max(128)
    .transform((nicknamesStr) => {
      assert.ok(
        nicknamesStr,
        createError({
          statusCode: 400,
          message: "No nicknames provided in the query string",
        }),
      );
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
