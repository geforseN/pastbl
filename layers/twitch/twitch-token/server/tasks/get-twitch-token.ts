import { recreateTwitchFetch } from "~~/layers/twitch/twitch-fetch/server/utils/twitch-fetch";

export default defineTask({
  meta: {
    description: "Fetch Twitch token",
  },
  async run() {
    const oldToken = await getTwitchTokenFromStorage();
    if (oldToken) {
      await revokeTwitchToken(oldToken);
    }
    const token = await fetchTwitchTokenWithLogs();
    await setTwitchTokenToStorage(token);
    recreateTwitchFetch(token);
    return {
      result: "Twitch token fetched successfully",
    };
  },
});
