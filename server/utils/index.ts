import { z } from "zod";
import { assert } from "~/utils/error";
import { sleep } from "~/utils/promise";

const { TWITCH_APP_CLIENT_ID: twitchClientId } = process.env;
assert.ok(twitchClientId, "TWITCH_APP_CLIENT_ID is not defined in .env");

const storage = useStorage();

const twitchTokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.literal("bearer"),
  fetchStartTime: z.number(),
});
export type TwitchToken = z.infer<typeof twitchTokenSchema>;

const twitchApiFetchOptions = {
  baseURL: "https://api.twitch.tv/helix",
  headers: {
    "Client-ID": twitchClientId,
  },
} as const satisfies Parameters<typeof $fetch.create>[0];

export const twitchApi = { fetch: $fetch.create(twitchApiFetchOptions) };

// NOTE: this IIFE to put the access token in the headers
// this is done to stop calling in each request access token from storage
// this is a bit hacky, idk how to do it better
// NOTE: first requests maybe not have access token while this function is running
// FIXME: token lives around 2 months, when it will expire requests to Twitch will fail, can be fixed with CRON job
(async function mutateFetchHeadersWithTwitchToken() {
  // FIXME: sleep is needed here to await while 'twitch-token' nitro plugin will fetch token
  await sleep(3_000);
  const twitchToken = await storage.getItem<TwitchToken>("twitchToken");
  const accessToken = twitchTokenSchema.parse(twitchToken);
  twitchApi.fetch = $fetch.create({
    ...twitchApiFetchOptions,
    headers: {
      ...twitchApiFetchOptions.headers,
      Authorization: `Bearer ${accessToken.access_token}`,
    },
  });
})();
