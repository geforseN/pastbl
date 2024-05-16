export default oauth.twitchEventHandler({
  async onSuccess(event, { user: twitchApiUser, tokens: _tokens }) {
    const user = makeSessionUser(twitchApiUser);
    await setUserSession(event, { user });
    return sendRedirect(event, "/");
  },
  onError(event, _error) {
    return sendRedirect(event, "/");
  },
});
