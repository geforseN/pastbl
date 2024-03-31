import { SevenTV } from "~/integrations/SevenTV";
import {
  getTwitchUser,
  TwitchUser,
} from "~/server/api/twitch/users/[login].get";

export const getUserSevenTVIntegration = makeUserIntegrationGetter(
  "SevenTV",
  async (account: TwitchUser) => {
    return await SevenTV.createUserIntegration(account.id, account.login);
  },
);

export default defineEventHandler(async (event) => {
  const login = getTwitchLoginRouteParam(event);
  const user = await getTwitchUser(login);
  const twitchIntegration = await getUserSevenTVIntegration(user);
  return {
    SevenTV: twitchIntegration,
  };
});
