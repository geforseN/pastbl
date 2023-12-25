export type TwitchToken = {
  fetchStartTime: number;
  access_token: string;
  expires_in: number;
  token_type: "bearer";
};

const {
  TWITCH_APP_CLIENT_ID: clientId,
  TWITCH_APP_CLIENT_SECRET: clientSecret,
} = process.env;

const twitchTokenOptions = {
  method: "POST" as const,
  baseURL: "https://id.twitch.tv",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
};

async function fetchTwitchToken(): Promise<TwitchToken> {
  const fetchStartTime = Date.now();
  const twitchToken: Omit<TwitchToken, "fetchStartTime"> = await $fetch(
    "/oauth2/token",
    {
      ...twitchTokenOptions,
      body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    },
  );
  return { ...twitchToken, fetchStartTime };
}

export const storage = useStorage();

export default defineNitroPlugin(async (nitro) => {
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
      body: `client_id=${clientId}&token=${token.access_token}`,
    });
    console.log("Nitro close hooks ended");
  });
});
