const {
  TWITCH_APP_CLIENT_SECRET: twitchClientSecret,
  TWITCH_APP_CLIENT_ID: twitchClientId,
} = process.env;

if (!twitchClientId) {
  throw new Error("TWITCH_APP_CLIENT_ID is not defined in .env");
}
if (!twitchClientSecret) {
  throw new Error("TWITCH_APP_CLIENT_SECRET is not defined in .env");
}

const twitchTokenOptions = {
  method: "POST" as const,
  baseURL: "https://id.twitch.tv",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
};

const storage = useStorage();

async function fetchTwitchToken(): Promise<TwitchToken> {
  const fetchStartTime = Date.now();
  const twitchToken: Omit<TwitchToken, "fetchStartTime"> = await $fetch(
    "/oauth2/token",
    {
      ...twitchTokenOptions,
      body: `client_id=${twitchClientId}&client_secret=${twitchClientSecret}&grant_type=client_credentials`,
    },
  );
  return { ...twitchToken, fetchStartTime };
}

export default defineNitroPlugin(async (nitro) => {
  /* eslint-disable no-console */
  console.log("Fetching twitch token");
  const token = await fetchTwitchToken();
  await storage.setItem("twitchToken", token);
  console.log("Fethed twitch token");
  nitro.hooks.hookOnce("close", async () => {
    console.log("Nitro close hooks started");
    const token = await storage.getItem<TwitchToken>("twitchToken");
    if (!token) {
      return;
    }
    // LINK: https://dev.twitch.tv/docs/authentication/revoke-tokens/
    await $fetch("/oauth2/revoke", {
      ...twitchTokenOptions,
      body: `client_id=${twitchClientId}&token=${token.access_token}`,
    });
    console.log("Nitro close hooks ended");
  });
  /* eslint-enable no-console */
});
