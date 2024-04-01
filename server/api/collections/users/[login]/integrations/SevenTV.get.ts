import { SevenTV } from "~/integrations/SevenTV";

export const getUserSevenTVIntegration = makeUserIntegrationGetter(
  "SevenTV",
  async (account: TwitchUser) => {
    return await SevenTV.createUserIntegration(account.id, account.login);
  },
);

export default defineEventHandler(async (event) => {
  const login = getTwitchLoginRouteParam(event);
  const user = await getTwitchUser(login);
  const integration = await getUserSevenTVIntegration(user);
  return {
    SevenTV: integration,
  };
});
