// TODO: move to plugins
export default defineEventHandler(async (_event) => {
  const config = useAppConfig();
  if (!("token" in config)) {
    return;
  }
  const { TWITCH_APP_CLIENT_ID: clientId } = process.env;
  if (
    typeof config.token !== "object" ||
    config.token === null ||
    !("access_token" in config.token)
  ) {
    throw new Error("Invalid Twitch token");
  }
  // LINK: https://dev.twitch.tv/docs/authentication/revoke-tokens/
  await $fetch("/oauth2/revoke", {
    baseURL: "https://id.twitch.tv",
    method: "POST",
    body: `client_id=${clientId}&token=${config.token.access_token}`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
});
