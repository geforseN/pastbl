import { BetterTTV } from "~/integrations/BetterTTV";
import {
  getTwitchUser,
  TwitchUser,
} from "~/server/api/twitch/users/[login].get";

export const getUserBetterTTVIntegration = makeUserIntegrationGetter(
  "BetterTTV",
  async (account: TwitchUser) => {
    return await BetterTTV.giveUserIntegration(account.id, account.login);
  },
);

export default defineEventHandler(async (event) => {
  const login = getTwitchLoginRouteParam(event);
  const user = await getTwitchUser(login);
  const twitchIntegration = await getUserBetterTTVIntegration(user);
  return {
    BetterTTV: twitchIntegration,
  };
});
