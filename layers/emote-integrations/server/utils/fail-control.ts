import type { ReadyIntegration, FailedIntegration } from "../../shared/abstract/types";
import type { EmoteSource } from "../../layers/emote-sources/utils/external";

export abstract class EmotesIntegrationWithFailControl {
  abstract source: EmoteSource;

  abstract makeFailedIntegration<F extends FailedIntegration>(
    error: unknown,
  ): F;

  async handle<R extends ReadyIntegration, F extends FailedIntegration>(
    getter: () => Promise<R>,
  ) {
    try {
      const integration = await getter();
      if (!integration) {
        throw new Error(`${this.source} Global emotes integration not found`);
      }
      return integration;
    } catch (error) {
      return this.makeFailedIntegration<F>(error);
    }
  }
}
