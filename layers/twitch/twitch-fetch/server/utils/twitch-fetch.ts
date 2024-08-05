import { $fetch } from "ofetch";
import { environment } from "~~/server/utils/environment";

let twitchFetch = createTwitchApiFetch();

export function createTwitchApiFetch(token?: TwitchToken) {
  const headers = new Headers({
    "Client-ID": environment.TWITCH_APP_CLIENT_ID,
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
  T = any,
  R extends "blob" | "text" | "arrayBuffer" | "stream" | "json" = "json",
>(
  request: Parameters<typeof twitchFetch>[0],
  options?: Parameters<typeof twitchFetch>[1],
) {
  return twitchFetch<T, R>(request, options);
}
