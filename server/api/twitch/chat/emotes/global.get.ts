import {
  type ITwitchGlobalEmoteResponse,
  makeTwitchGlobalCollection,
} from "~/integrations/Twitch";

export default cachedEventHandler(
  async () => {
    const response = await fetchGlobalEmotes();
    return makeTwitchGlobalCollection(response);
  },
  { maxAge: 60 * 60 /* 1 hour */ },
);

function fetchGlobalEmotes() {
  return twitch.api.fetch<ITwitchGlobalEmoteResponse>("/chat/emotes/global");
}
