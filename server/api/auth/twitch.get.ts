import { z } from "zod";
import { upsertTwitchUser } from "~/db";

const twitchUserSchema = z
  .object({
    id: z.string(),
    login: z.string(),
    display_name: z.string(),
    profile_image_url: z.string(),
    description: z.string().optional(),
  })
  .transform((twitchUser) => ({
    twitch: {
      id: twitchUser.id,
      login: twitchUser.login,
      profileImageUrl: twitchUser.profile_image_url,
      nickname: twitchUser.display_name,
      description: twitchUser.description,
    },
  }));

export default oauth.twitchEventHandler({
  async onSuccess(event, { user: twitchUser, tokens: _tokens }) {
    const user = twitchUserSchema.parse(twitchUser);
    await upsertTwitchUser(user.twitch);
    await setUserSession(event, {
      user,
    });
    return sendRedirect(event, "/");
  },
  onError(event, error) {
    console.error("Twitch OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
