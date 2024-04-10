export default oauth.twitchEventHandler({
  async onSuccess(event, { user: twitchUser, tokens: _tokens }) {
    const user = parseUserTwitch(twitchUser);
    await setUserSession(event, { user });
    return sendRedirect(event, "/");
  },
  onError(event, error) {
    console.error("Twitch OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
