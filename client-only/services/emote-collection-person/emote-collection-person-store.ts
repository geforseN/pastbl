import {
  idb,
  type IndexedDBUserEmoteCollection,
} from "~/client-only/IndexedDB";
import type { UsersCollectionsStore } from "~/client-only/IndexedDB/emote-collections/UsersCollections";

class EmoteCollectionsPersonStore {
  constructor(
    private readonly idb: typeof import("~/client-only/IndexedDB").idb,
  ) {}

  #idb<T>(fn: (store: UsersCollectionsStore) => T) {
    return this.idb.collections.then((db) => fn(db.users));
  }

  async get(login: TwitchUserLogin) {
    return await this.#idb((store) => store.get(login));
  }

  async getAllLogins() {
    if (import.meta.server) {
      return [];
    }
    return await this.#idb((store) => store.getAllLogins());
  }

  async getAll() {
    if (import.meta.server) {
      return [];
    }
    return await this.#idb((store) => store.getAll());
  }

  async put(collection: IndexedDBUserEmoteCollection) {
    return await this.#idb((store) => store.put(collection));
  }

  async delete(login: TwitchUserLogin) {
    return await this.#idb((store) => store.delete(login));
  }
}

export const store = new EmoteCollectionsPersonStore(idb);
