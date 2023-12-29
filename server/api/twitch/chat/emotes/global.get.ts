import {
  type ITwitchGlobalEmoteResponse,
  makeTwitchGlobalCollection,
} from "~/integrations/Twitch";

export default cachedEventHandler(
  async () => {
    const accessToken = await twitch.getAccessToken();
    const response = await fetchGlobalEmotes(accessToken);
    return makeTwitchGlobalCollection(response);
  },
  { maxAge: 60 * 60 /* 1 hour */ },
);

function fetchGlobalEmotes(accessToken: string) {
  return twitch.api.fetch<ITwitchGlobalEmoteResponse>("/chat/emotes/global", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
