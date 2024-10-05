export class PersonsEmotesCollectionsApi {
  constructor(private readonly fetch: typeof $fetch) {}

  async get(login: TwitchUserLogin) {
    const fetchedAt = Date.now();
    const collection = await this.fetch<IPersonEmoteCollection>(`/${login}`);
    return {
      ...collection,
      fetchedAt,
      receivedAt: Date.now(),
    };
  }
}
