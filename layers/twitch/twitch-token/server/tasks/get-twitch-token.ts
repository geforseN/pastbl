import { recreateTwitchFetch } from "$/twitch/twitch-fetch/server/utils/twitch-fetch";
import { defineTask } from "nitropack/runtime/task";

export async function runTwitchTokenTask() {
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
}
export default defineTask({
  meta: {
    description: "Fetch Twitch token",
  },
  async run() {
    return await runTwitchTokenTask();
  },
});
