import type { EmoteSource } from "~/integrations";
import type { IEmote } from "~/integrations/abstract/Emote";
import type { IEmoteIntegration } from "~/integrations/abstract/EmoteIntegration";
import type { IEmoteSet } from "~/integrations/abstract/EmoteSet";
import { findErrorMessage } from "~/utils/error";

function handleEmoteIntegrationError(
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
  F extends (
    ...args: any[]
  ) => Promise<any | IEmoteIntegration<IEmoteSet<IEmote>>>,
>(source: S, getIntegration: F) {
  return async (...args: Parameters<F>) => {
    try {
      const integration = await getIntegration(...args);
      return withReadyStatus(integration);
    } catch (error) {
      return handleEmoteIntegrationError(error, source, ...args);
    }
  };
}
