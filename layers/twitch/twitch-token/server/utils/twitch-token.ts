import assert from "node:assert";
import { z } from "zod";
import { $fetch } from "ofetch";
import { environment } from "~~/server/utils/environment.ts";

const twitchTokenBaseOptions = {
  method: "POST",
  baseURL: "https://id.twitch.tv",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
} as const satisfies Parameters<typeof $fetch.create>[0];

const twitchTokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.literal("bearer"),
  fetchStartTime: z.number(),
});

export type TwitchToken = z.infer<typeof twitchTokenSchema>;

// LINK: https://dev.twitch.tv/docs/authentication/revoke-tokens/
export function revokeTwitchToken(token: TwitchToken) {
  return $fetch("/oauth2/revoke", {
    ...twitchTokenBaseOptions,
    body: `client_id=${TWITCH_APP_CLIENT_ID}&token=${token.access_token}`,
  });
}

const storage = useStorage();

export function getTwitchTokenFromStorage() {
  return storage.getItem<TwitchToken>("twitchToken");
}

export function setTwitchTokenToStorage(token: TwitchToken) {
  return storage.setItem("twitchToken", token);
}

export function removeTwitchTokenFromStorage() {
  return storage.removeItem("twitchToken");
}

const { TWITCH_APP_CLIENT_ID, TWITCH_APP_CLIENT_SECRET } = process.env;

assert.ok(TWITCH_APP_CLIENT_ID && TWITCH_APP_CLIENT_SECRET);

const getTwitchTokenOptions = {
  ...twitchTokenBaseOptions,
  body: `client_id=${TWITCH_APP_CLIENT_ID}&client_secret=${TWITCH_APP_CLIENT_SECRET}&grant_type=client_credentials`,
};

const cool_fetch = $fetch.create(getTwitchTokenOptions);

export async function fetchTwitchToken() {
  const fetchStartTime = Date.now();
  const twitchToken = await cool_fetch("/oauth2/token");
  assert.ok(twitchToken !== null && typeof twitchToken === "object");
  return twitchTokenSchema.parse({ ...twitchToken, fetchStartTime });
}

export async function fetchTwitchTokenWithLogs() {
  /* eslint-disable no-console */
  console.log("Fetching twitch token");
  const token = await fetchTwitchToken();
  console.log("Fetched twitch token");
  return token;
  /* eslint-enable no-console */
}
