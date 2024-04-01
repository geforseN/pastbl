import { BetterTTV } from "~/integrations/BetterTTV";

export const getUserBetterTTVIntegration = makeUserIntegrationGetter(
  "BetterTTV",
  async (account: TwitchUser) => {
    return await BetterTTV.giveUserIntegration(account.id, account.login);
  },
);

export default defineEventHandler(async (event) => {
  const login = getTwitchLoginRouteParam(event);
  const user = await getTwitchUser(login);
  const integration = await getUserBetterTTVIntegration(user);
  return {
    BetterTTV: integration,
  };
});
