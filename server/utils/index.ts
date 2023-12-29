import { z } from "zod";
import { raise } from "~/utils/error";

const { TWITCH_APP_CLIENT_ID: twitchClientId } = process.env;

const storage = useStorage();

const twitchTokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.literal("bearer"),
  fetchStartTime: z.number(),
});
export type TwitchToken = z.infer<typeof twitchTokenSchema>;

export const twitch = {
  async getAccessToken() {
    const twitchToken = await storage.getItem<TwitchToken>("twitchToken");
    return twitchTokenSchema.parse(twitchToken).access_token;
  },
  api: {
    fetch: $fetch.create({
      baseURL: "https://api.twitch.tv/helix",
      headers: {
        "Client-ID":
          twitchClientId ||
          raise("TWITCH_APP_CLIENT_ID is not defined in .env"),
      },
    }),
  },
};
