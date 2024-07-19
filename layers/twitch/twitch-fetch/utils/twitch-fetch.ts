import { $fetch } from "ofetch";
import { environment } from "~~/server/utils/environment";

export const twitchApi = {
  fetch: createTwitchApiFetch(),
  recreateFetch(token: TwitchToken) {
    this.fetch = createTwitchApiFetch(token);
  },
};

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

export const recreateTwitchFetch = twitchApi.recreateFetch.bind(twitchApi);

export const fetchTwitchApi = twitchApi.fetch.bind(twitchApi);
