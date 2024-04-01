import { makeUserIntegrationGetter } from "./integrations";
import { SevenTV, create7TVGlobalCollection } from "~/integrations/SevenTV";
import { get7TVGlobalEmotesSet } from "~/integrations/SevenTV/SevenTV.api";

export const getUserSevenTVIntegration = makeUserIntegrationGetter(
  "SevenTV",
  async (account: TwitchUser) => {
    return await SevenTV.createUserIntegration(account.id, account.login);
  },
);

export async function getSevenTVGlobalCollection() {
  const globalEmotes = await get7TVGlobalEmotesSet();
  return create7TVGlobalCollection(globalEmotes);
}
