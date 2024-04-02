import { makeUserIntegrationGetter } from "./integrations-handler-make";
import { BetterTTV } from "~/integrations/BetterTTV";
import { BetterTTVApi } from "~/integrations/BetterTTV/api";

export const getUserBetterTTVIntegration = makeUserIntegrationGetter(
  "BetterTTV",
  async (account: TwitchUser) => {
    return await BetterTTV.giveUserIntegration(account.id, account.login);
  },
);

export async function getBetterTTVGlobalCollection() {
  const globalEmotes = await BetterTTVApi.getGlobalEmotes();
  return BetterTTV.giveGlobalCollection(globalEmotes);
}
