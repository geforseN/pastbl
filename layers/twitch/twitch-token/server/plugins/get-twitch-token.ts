import consola from "consola";

export default defineNitroPlugin(async (nitro) => {
  await runTask("get-twitch-token");
  nitro.hooks.hookOnce("close", async () => {
    consola.withTag("twitch-token").log("Revoking...");
    const token = await getTwitchTokenFromStorage();
    if (!token) {
      return consola.withTag("twitch-token").warn("No token to revoke, fast return");
    }
    await revokeTwitchToken(token);
    await removeTwitchTokenFromStorage();
    consola.withTag("twitch-token").log(`Revoked!`);
  });
});
