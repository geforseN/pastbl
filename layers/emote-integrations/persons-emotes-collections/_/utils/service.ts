import type { PersonsEmotesCollectionsApi } from "./api";
import type { IPersonsEmoteCollectionsRepository } from "./abstract";
import type { TPersonEmoteCollection } from "./types";

// OPTIMIZATIONS: if will add code for optimizations then must not mutate this file? must use decorator pattern
// 1) when get is called then must return non raw collection. however, repository contains raw collection. so should transform raw to not raw and save in Map struct. then if collection is unselected and selected again then should take collection from Map, not from repository
// 2) add Map for emotes when populating raw collection with emotes
export class PersonsEmotesCollectionsService<
  C extends TPersonEmoteCollection.Minimal,
> {
  constructor(
    private readonly repository: IPersonsEmoteCollectionsRepository<C>,
    private readonly api: PersonsEmotesCollectionsApi,
  ) {}

  async get(login: TwitchUserLogin) {
    if (import.meta.server) {
      return /* await this.api.get(login) */;
    }
    const collection = await this.repository.get(login);
    return collection;
  }

  async getAllRaw() {
    if (import.meta.server) {
      return [];
    }
    return await this.repository.getAllRaw();
  }

  async getAllLogins() {
    if (import.meta.server) {
      return [];
    }
    return await this.repository.getAllLogins();
  }

  async put(collection: TPersonEmoteCollection.Default) {
    return await this.repository.put(collection);
  }

  async load(login: TwitchUserLogin) {
    const collection = await this.api.get(login);
    await this.put(collection);
    return collection;
  }

  async getOrLoad(login: TwitchUserLogin) {
    const collection = await this.get(login).catch(() => this.load(login));
    assert.ok(collection, `No collection found with login: ${login}`);
    return collection;
  }

  async delete(login: TwitchUserLogin) {
    return await this.repository.delete(login);
  }
}
