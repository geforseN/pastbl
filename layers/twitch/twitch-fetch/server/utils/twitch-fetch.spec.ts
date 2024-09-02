// import { runTwitchTokenTask } from "~~/layers/twitch/twitch-token/server/tasks/get-twitch-token";

describe.todo("twitchFetch", () => {
  test.todo("oauth token in headers", async () => {
    await fetchTwitchGlobalEmotes(); // EXPECT 401;
    await runTwitchTokenTask();
    await fetchTwitchGlobalEmotes(); // EXPECT 200;
  });
});
