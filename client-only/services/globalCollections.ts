import { idb } from "../IndexedDB";
import { emoteSources, isValidEmoteSource } from "~/integrations";
import type {
  EmoteSource,
  IGlobalEmoteCollection,
  IGlobalEmoteCollectionRecord,
} from "~/integrations";

export const globalCollectionsService = {
  async tryLoadMissing(state: Partial<IGlobalEmoteCollectionRecord>) {
    const missingSources = emoteSources.filter((source) => !state[source]);
    if (!missingSources.length) {
      return;
    }
    const collections = await API.getMany(missingSources);
    const values = objectValues(collections);
    await IDB.putMany(values);
    return values;
  },
  async refresh<S extends EmoteSource>(
    source: S,
  ): Promise<IGlobalEmoteCollectionRecord[S]> {
    const collection = await API.get(source);
    await IDB.put(collection);
    return collection;
  },
  async refreshAll() {
    const all = await API.getAll();
    const values = Object.values(all);
    await IDB.putMany(values);
    return all;
  },
  async refreshMany(sources: EmoteSource[]) {
    const collections = await API.getMany(sources);
    const values = objectValues(collections);
    await IDB.putMany(values);
    return values;
  },
  async getAll() {
    if (process.server) {
      return {};
    }
    const collections = await IDB.getAll();
    return flatGroupBy(
      collections,
      (collection) => collection.source,
    ) as Partial<IGlobalEmoteCollectionRecord>;
  },
};

const IDB = {
  async getAll() {
    const collectionIdb = await idb.collections;
    return await collectionIdb.global.getAll();
  },
  async put(collection: IGlobalEmoteCollection) {
    const collectionIdb = await idb.collections;
    return await collectionIdb.global.put(collection);
  },
  async putMany(collections: IGlobalEmoteCollection[]) {
    const collectionsIdb = await idb.collections;
    return await Promise.all(
      collections.map((collection) => collectionsIdb.global.put(collection)),
    );
  },
};

const API = {
  get<S extends EmoteSource>(
    source: S,
  ): Promise<IGlobalEmoteCollectionRecord[S]> {
    assert.ok(isValidEmoteSource(source));
    return $fetch(`/api/collections/global/${source}`);
  },
  getMany(sources: EmoteSource[]) {
    assert.ok(sources.every(isValidEmoteSource));
    return $fetch("/api/collections/global", {
      query: { sources: sources.join("+") },
    });
  },
  getAll() {
    return $fetch("/api/collections/global/all");
  },
};
