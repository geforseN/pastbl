export default defineNitroPlugin(async (nitro) => {
  await runTask("get-twitch-token");
  nitro.hooks.hookOnce("close", async () => {
    /* eslint-disable no-console */
    console.log("Twitch token revoke started");
    const token = await getTwitchTokenFromStorage();
    if (!token) {
      return console.log("No twitch token to revoke, fast exit");
    }
    await revokeTwitchToken(token);
    await removeTwitchTokenFromStorage();
    console.log(`Twitch token revoked`);
    /* eslint-enable no-console */
  });
});
