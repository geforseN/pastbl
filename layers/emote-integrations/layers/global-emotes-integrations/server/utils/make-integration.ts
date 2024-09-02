import type { TEmoteIntegrations } from "$/emote-integrations";
import { EmotesIntegrationWithFailControl } from "$/emote-integrations/server/utils/fail-control";

export function defineGlobalIntegrationMaker<
  I extends TEmoteIntegrations.Global.Ready,
>(source: I["source"]) {
  return function (sets: I["sets"]) {
    return <I>{
      formedAt: Date.now(),
      sets,
      source,
      status: "ready" as const,
    };
  };
}

export class GlobalEmotesIntegrationWithFailControl extends EmotesIntegrationWithFailControl {
  constructor(readonly source: EmoteSource) {
    super();
  }

  override makeFailedIntegration<F extends FailedIntegration>(
    error: unknown,
  ): F {
    return <F>{
      status: "failed",
      source: this.source,
      code: "GLOBAL_EMOTES_INTEGRATION_FAILED",
      reason: findErrorMessage(
        error,
        `Failed to load ${this.source} Global Emotes Integration`,
      ),
    };
  }
}
