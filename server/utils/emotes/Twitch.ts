import { makeUserIntegrationGetter } from "./integrations";
import {
  makeUserTwitchIntegration,
  makeTwitchGlobalCollection,
} from "~/integrations/Twitch";

export async function getTwitchGlobalCollection() {
  const response = await fetchTwitchGlobalEmotes();
  return makeTwitchGlobalCollection(response);
}

export const getUserTwitchIntegration = makeUserIntegrationGetter(
  "Twitch",
  async (account: TwitchUser) => {
    const { data } = await fetchTwitchChatEmotes(account.id);
    return makeUserTwitchIntegration(data, account);
  },
);
