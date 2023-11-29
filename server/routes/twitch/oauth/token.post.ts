const {
  TWITCH_APP_CLIENT_ID: clientId,
  TWITCH_APP_CLIENT_SECRET: clientSecret,
} = process.env;

// TODO: move to plugins
export default defineEventHandler(async (_event) => {
  const fetchStartTime = Date.now();
  // LINK: https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#client-credentials-grant-flow
  const token: {
    access_token: string;
    expires_in: number;
    token_type: "bearer";
  } = await $fetch("/oauth2/token", {
    method: "POST",
    baseURL: "https://id.twitch.tv",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
  });
  updateAppConfig({
    token: {
      ...token,
      fetchStartTime,
    },
  });
});
