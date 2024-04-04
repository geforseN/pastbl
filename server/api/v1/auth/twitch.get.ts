import { z } from "zod";

const userTwitchSchema = z
  .object({
    id: z.string(),
    login: z.string(),
    display_name: z.string(),
    profile_image_url: z.string(),
  })
  .transform((twitchUser) => ({
    twitch: {
      id: twitchUser.id,
      login: twitchUser.login,
      profileImageUrl: twitchUser.profile_image_url,
      nickname: twitchUser.display_name,
    },
  }));

export type UserTwitch = z.infer<typeof userTwitchSchema>;

export default oauth.twitchEventHandler({
  async onSuccess(event, { user: twitchUser, tokens: _tokens }) {
    const user = userTwitchSchema.parse(twitchUser);
    await setUserSession(event, { user });
    return sendRedirect(event, "/");
  },
  onError(event, error) {
    console.error("Twitch OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
