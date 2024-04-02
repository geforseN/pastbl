import assert from "node:assert";
import { z } from "zod";
import { $fetch } from "ofetch";

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
    body: `client_id=${env.TWITCH_APP_CLIENT_ID}&token=${token.access_token}`,
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

const getTwitchTokenOptions = {
  ...twitchTokenBaseOptions,
  body: `client_id=${env.TWITCH_APP_CLIENT_ID}&client_secret=${env.TWITCH_APP_CLIENT_SECRET}&grant_type=client_credentials`,
};

export async function fetchTwitchToken() {
  const fetchStartTime = Date.now();
  const twitchToken = await $fetch("/oauth2/token", getTwitchTokenOptions);
  assert.ok(twitchToken !== null && typeof twitchToken === "object");
  return twitchTokenSchema.parse({ ...twitchToken, fetchStartTime });
}