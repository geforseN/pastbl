import { getUserBetterTTVIntegration } from "./BetterTTV.get";
import { getUserFrankerFaceZIntegration } from "./FrankerFaceZ.get";
import { getUserSevenTVIntegration } from "./SevenTV.get";
import { getUserTwitchIntegration } from "./Twitch.get";

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
