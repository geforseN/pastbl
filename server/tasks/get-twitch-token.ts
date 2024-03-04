import assert from "node:assert";
import { $fetch } from "ofetch";

const getTwitchTokenOptions = {
  ...twitchTokenBaseOptions,
  body: `client_id=${env.twitchClientId}&client_secret=${env.twitchClientSecret}&grant_type=client_credentials`,
};

async function fetchTwitchToken() {
  const fetchStartTime = Date.now();
  const twitchToken = await $fetch("/oauth2/token", getTwitchTokenOptions);
  assert.ok(twitchToken !== null && typeof twitchToken === "object");
  return twitchTokenSchema.parse({ ...twitchToken, fetchStartTime });
}

function createTwitchApiFetch(accessToken: TwitchToken["access_token"]) {
  return $fetch.create({
    baseURL: "https://api.twitch.tv/helix",
    headers: {
      "Client-ID": env.twitchClientId,
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export default defineTask({
  meta: {
    description: "Fetch Twitch token",
  },
  async run() {
    /* eslint-disable no-console */
    const oldToken = await getTwitchTokenFromStorage();
    if (oldToken) {
      await revokeTwitchToken(oldToken);
    }
    console.log("Fetching twitch token");
    const token = await fetchTwitchToken();
    console.log("Fetched twitch token");
    /* eslint-enable no-console */
    await setTwitchTokenToStorage(token);
    twitchApi.fetch = createTwitchApiFetch(token.access_token);
    return {
      result: "Twitch token fetched successfully",
    };
  },
});
