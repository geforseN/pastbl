export class FrankerFaceZGlobalEmotesIntegration {
  source = "FrankerFaceZ" as const;

  async get() {
    const response = await getFrankerFaceZGlobalEmotes();
    const sets = transformFrankerFaceZGlobalSets(response);
    return makeFrankerFaceZGlobalIntegration(sets);
  }
}
