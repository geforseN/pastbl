export class EmotesService_____ {
  constructor(private readonly repository: any) {}

  async getEmote(source: EmoteSource, emoteId: string) {
    return this.repository.get(source, emoteId);
  }
}
