import { twitchApiFetch } from "..";
import { storage, type TwitchToken } from "~/server/plugins/twitch-token";

export default defineEventHandler(async () => {
  const twitchToken = await storage.getItem<TwitchToken>("twitchToken");
  return twitchApiFetch("/chat/emotes/global", {
    headers: {
      Authorization: `Bearer ${twitchToken?.access_token}`,
    },
  });
});
