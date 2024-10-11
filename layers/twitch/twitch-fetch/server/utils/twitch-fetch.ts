import { $fetch, type FetchOptions, type FetchRequest } from "ofetch";

const { TWITCH_APP_CLIENT_ID } = process.env;
assert.ok(TWITCH_APP_CLIENT_ID);

let twitchFetch = createTwitchApiFetch();

export function createTwitchApiFetch(token?: TwitchToken) {
  const headers = new Headers({
    "Client-ID": TWITCH_APP_CLIENT_ID!,
  });
  if (token) {
    headers.append("Authorization", `Bearer ${token.access_token}`);
  }
  return $fetch.create({
    baseURL: "https://api.twitch.tv/helix",
    headers,
  });
}

export function recreateTwitchFetch(token: TwitchToken) {
  twitchFetch = createTwitchApiFetch(token);
}

export function fetchTwitchApi<
  T,
  R extends "blob" | "text" | "arrayBuffer" | "stream" | "json" = "json",
>(request: FetchRequest, options?: FetchOptions<R>) {
  return twitchFetch<T, R>(request, options);
}
