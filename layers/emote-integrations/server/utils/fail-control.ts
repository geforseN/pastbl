export abstract class EmotesIntegrationWithFailControl {
  abstract source: EmoteSource;

  abstract makeFailedIntegration<F extends FailedIntegration>(
    error: unknown,
  ): F;

  async handle<R extends ReadyIntegration, F extends FailedIntegration>(
    fn: () => Promise<R>,
  ): Promise<R | F> {
    try {
      return await fn();
    } catch (error) {
      return this.makeFailedIntegration<F>(error);
    }
  }
}
