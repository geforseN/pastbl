import { getUserBetterTTVIntegration } from "./BetterTTV.get";
import { getUserFrankerFaceZIntegration } from "./FrankerFaceZ.get";
import { getUserSevenTVIntegration } from "./SevenTV.get";
import { getUserTwitchIntegration } from "./Twitch.get";
import {
  getTwitchUser,
  TwitchUser,
} from "~/server/api/twitch/users/[login].get";

export async function getUserEmoteIntegrations(user: TwitchUser) {
  const [BetterTTV, FrankerFaceZ, SevenTV, Twitch] = await Promise.all([
    getUserBetterTTVIntegration(user),
    getUserFrankerFaceZIntegration(user),
    getUserSevenTVIntegration(user),
    getUserTwitchIntegration(user),
  ]);
  return {
    BetterTTV,
    FrankerFaceZ,
    SevenTV,
    Twitch,
  };
}

export default defineEventHandler(async (event) => {
  const login = getTwitchLoginRouteParam(event);
  const user = await getTwitchUser(login);
  return await getUserEmoteIntegrations(user);
});
