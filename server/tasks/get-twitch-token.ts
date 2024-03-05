import assert from "node:assert";

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
    twitchApi.fetch = createTwitchApiFetch(token);
    return {
      result: "Twitch token fetched successfully",
    };
  },
});
