import { $fetch, type FetchOptions, type FetchRequest } from "ofetch";

const { TWITCH_APP_CLIENT_ID } = process.env;
assert.ok(TWITCH_APP_CLIENT_ID);

let resolve: () => void;
const twitchApiHasTokenPromise = new Promise<void>((resolve_) => {
  resolve = resolve_;
});
let twitchFetch = createTwitchApiFetch();

export function createTwitchApiFetch(token?: TwitchToken) {
  const headers = new Headers({
    "Client-ID": TWITCH_APP_CLIENT_ID!,
  });
  if (token) {
    headers.append("Authorization", `Bearer ${token.access_token}`);
    resolve();
  }
  return $fetch.create({
    baseURL: "https://api.twitch.tv/helix",
    headers,
  });
}

export function recreateTwitchFetch(token: TwitchToken) {
  twitchFetch = createTwitchApiFetch(token);
}

export async function fetchTwitchApi<
  T,
  R extends "blob" | "text" | "arrayBuffer" | "stream" | "json" = "json",
>(request: FetchRequest, options?: FetchOptions<R>) {
  await twitchApiHasTokenPromise;
  return await twitchFetch<T, R>(request, options);
}
