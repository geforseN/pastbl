import { findErrorMessage } from "~/utils/error";

function handlePersonEmoteIntegrationError(
  fail: unknown,
  source: EmoteSource,
  twitch?: PersonTwitch,
) {
  const reason = findErrorMessage(
    fail,
    `Failed to load ${source} integration${twitch ? `for ${twitch.nickname}` : ""}`,
  );
  return {
    status: "failed" as const,
    source,
    reason,
  };
}

function withReadyStatus<I extends object>(integration: I) {
  return {
    ...integration,
    status: "ready" as const,
  };
}

export function makeIntegrationGetter<
  S extends EmoteSource,
  F extends (twitch: TwitchUser) => Promise<TEmoteIntegrations.Person.Ready>,
>(source: S, getIntegration: F) {
  return async (twitch: Parameters<F>[0]) => {
    try {
      const integration = await getIntegration(twitch);
      return withReadyStatus(integration);
    } catch (error) {
      return handlePersonEmoteIntegrationError(error, source, twitch);
    }
  };
}
