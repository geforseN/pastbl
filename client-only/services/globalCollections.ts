import { idb } from "../IndexedDB";
import { getMissingSources } from "~/integrations";
import type {
  IGlobalEmoteCollection,
  IGlobalEmoteCollectionRecord,
} from "~/integrations";

export const globalCollectionsIdb = {
  async ___loadMissing(state: Partial<IGlobalEmoteCollectionRecord>) {
    const missingSources = getMissingSources(state);
    if (!missingSources.length) {
      return;
    }
    const record = await $fetch("/api/collections/global", {
      query: { sources: missingSources.join("+") },
    });
    const values: IGlobalEmoteCollection[] = Object.values(record);
    const collectionsIdb = await idb.collections;
    await Promise.all(
      values.map((collection) => collectionsIdb.global.add(collection)),
    );
    return values;
  },
  async ___refresh<C extends IGlobalEmoteCollection>(
    source: C["source"],
  ): Promise<IGlobalEmoteCollectionRecord[C["source"]]> {
    const newCollectionRecord = await $fetch("/api/collections/global", {
      query: { sources: source },
    });
    const newCollection = newCollectionRecord[source];
    const collectionIdb = await idb.collections;
    await collectionIdb.global.put(newCollection);
    return newCollection;
  },
  async putMany(collections: IGlobalEmoteCollection[]) {
    const collectionIdb = await idb.collections;
    return Promise.all(
      collections.map((collection) => collectionIdb.global.put(collection)),
    );
  },

  async getAll() {
    if (typeof window === "undefined") {
      return {};
    }
    const collectionIdb = await idb.collections;
    const collections = await collectionIdb.global.getAll();
    return flatGroupBy(
      collections,
      (collection) => collection.source,
    ) as Partial<IGlobalEmoteCollectionRecord>;
  },
};
