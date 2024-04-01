import { getUserEmoteIntegrations } from "~/server/api/collections/users/[login]/integrations/all.get";

export async function getUserEmoteCollection(login: Lowercase<string>) {
  const account = await getTwitchUser(login);
  const integrations = await getUserEmoteIntegrations(account);
  return {
    user: {
      twitch: account,
      twitchAccount: account,
    },
    twitchAccount: account,
    integrations,
    updatedAt: Date.now(),
  };
}

export default defineEventHandler(async (event) => {
  const login = getTwitchLoginRouteParam(event);
  return await getUserEmoteCollection(login);
});
