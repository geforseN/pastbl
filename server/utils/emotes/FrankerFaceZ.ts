import { makeUserIntegrationGetter } from "./integrations-handler-make";
import {
  createFFZPartialUserIntegration,
  createFFZUserIntegration,
  createFFZUserSets,
  createFFZGlobalCollection,
} from "~/integrations/FrankerFaceZ";
import {
  FrankerFaceZApi,
  getFFZGlobalEmoteSets,
} from "~/integrations/FrankerFaceZ/FrankerFaceZ.api";

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

export async function getFrankerFaceZGlobalCollection() {
  const globalEmotes = await getFFZGlobalEmoteSets();
  return createFFZGlobalCollection(globalEmotes);
}
