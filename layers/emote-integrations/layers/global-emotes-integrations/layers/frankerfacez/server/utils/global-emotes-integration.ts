export class FrankerFaceZGlobalEmotesIntegration {
  constructor(
    private readonly withFailControl: GlobalEmotesIntegrationWithFailControl,
  ) {}

  get source() {
    return "FrankerFaceZ" as const;
  }

  async get() {
    return await this.withFailControl.handle<
      TFrankerFaceZ.Global.ReadyIntegration,
      TFrankerFaceZ.Global.FailedIntegration
    >(async () => {
      const response = await getFrankerFaceZGlobalEmotes();
      const sets = transformFrankerFaceZGlobalSets(response);
      return makeFrankerFaceZGlobalIntegration(sets);
    });
  }
}
