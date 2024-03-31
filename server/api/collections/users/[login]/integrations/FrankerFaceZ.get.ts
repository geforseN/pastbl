import {
  createFFZPartialUserIntegration,
  createFFZUserIntegration,
  createFFZUserSets,
} from "~/integrations/FrankerFaceZ";
import { FrankerFaceZApi } from "~/integrations/FrankerFaceZ/FrankerFaceZ.api";
import {
  getTwitchUser,
  TwitchUser,
} from "~/server/api/twitch/users/[login].get";

export const getUserFrankerFaceZIntegration = makeUserIntegrationGetter(
  "FrankerFaceZ",
  async (account: TwitchUser) => {
    const [user, room] = await Promise.all([
      FrankerFaceZApi.getUser(account.id, account.login),
      FrankerFaceZApi.getRoom(account.id),
    ]);
    const partialIntegration = createFFZPartialUserIntegration(user);
    const sets = createFFZUserSets(room.sets);
    const userIntegration = createFFZUserIntegration(partialIntegration, sets);
    return userIntegration;
  },
);

export default defineEventHandler(async (event) => {
  const login = getTwitchLoginRouteParam(event);
  const user = await getTwitchUser(login);
  const twitchIntegration = await getUserFrankerFaceZIntegration(user);
  return {
    FrankerFaceZ: twitchIntegration,
  };
});
