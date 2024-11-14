export default defineOAuthTwitchEventHandler({
  config: {
    scope: [
      "user:write:chat",
      "user:bot",
    ],
  },
  async onSuccess(event, { user: twitchApiUser, tokens: _tokens }) {
    const user = parseSessionUser(twitchApiUser);
    await setUserSession(event, { user });
    return sendRedirect(event, "/");
  },
  onError(event, _error) {
    return sendRedirect(event, "/");
  },
});
