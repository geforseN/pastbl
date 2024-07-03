import { twitchApi } from "~/integrations/Twitch/api";

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
    twitchApi.recreateFetch(token);
    return {
      result: "Twitch token fetched successfully",
    };
  },
});
