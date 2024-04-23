import { EmoteSource, IUserEmoteIntegration } from "~/integrations";
import { findErrorMessage } from "~/utils/error";

function handleEmoteIntegrationError(
  fail: unknown,
  source: EmoteSource,
  nickname: string,
) {
  const reason = findErrorMessage(
    fail,
    `Failed to load ${source} integration of ${nickname}`,
  );
  return {
    status: "fail" as const,
    source,
    reason,
  };
}

function withReadyStatus<I extends IUserEmoteIntegration>(integration: I) {
  return {
    ...integration,
    status: "ready" as const,
  };
}

export function makeUserIntegrationGetter<S extends EmoteSource>(
  source: S,
  getUserCollectionIntegration: (
    account: TwitchUser,
  ) => Promise<IUserEmoteIntegration>,
) {
  return async (account: TwitchUser) => {
    try {
      const integration = await getUserCollectionIntegration(account);
      return withReadyStatus(integration);
    } catch (error) {
      return handleEmoteIntegrationError(error, source, account.nickname);
    }
  };
}
