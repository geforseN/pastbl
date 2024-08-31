export class PersonsEmotesCollectionsApi {
  integrations;

  constructor(private readonly fetch: typeof $fetch) {
    this.integrations = new PersonsEmoteIntegrationsApi(this.fetch);
  }

  async get(login: TwitchUserLogin) {
    const fetchedAt = Date.now();
    const collection = await this.fetch(`/${login}`);
    return {
      ...collection,
      fetchedAt,
      receivedAt: Date.now(),
    };
  }
}
