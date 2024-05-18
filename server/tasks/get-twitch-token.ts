import { twitchApi as twitchApi2 } from "~/integrations/Twitch/api";

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
    const twitchApi_ = createTwitchApiFetch(token);
    twitchApi.fetch = twitchApi_;
    twitchApi2.fetch = twitchApi_;
    return {
      result: "Twitch token fetched successfully",
    };
  },
});
