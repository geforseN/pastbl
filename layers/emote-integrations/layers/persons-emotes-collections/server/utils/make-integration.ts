import type { TEmoteIntegrations } from "$/emote-integrations";
import { EmotesIntegrationWithFailControl } from "$/emote-integrations/server/utils/fail-control";

export function definePersonEmoteIntegrationMaker<
  I extends TEmoteIntegrations.Person.Ready,
>(source: I["source"]) {
  return function (sets: I["sets"], owner: I["owner"]) {
    return <I>{
      formedAt: Date.now(),
      sets,
      source,
      status: "ready" as const,
      owner,
    };
  };
}

export class PersonEmotesIntegrationWithFailControl extends EmotesIntegrationWithFailControl {
  constructor(readonly source: EmoteSource) {
    super();
  }

  override makeFailedIntegration<F extends FailedIntegration>(
    error: unknown,
  ): F {
    return <F>{
      status: "failed",
      source: this.source,
      code: "PERSON_EMOTES_INTEGRATION_FAILED",
      reason: findErrorMessage(
        error,
        `Failed to load ${this.source} Person Emotes Integration`,
      ),
    };
  }
}
