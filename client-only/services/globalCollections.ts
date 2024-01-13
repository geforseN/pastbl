import { idb } from "../IndexedDB";
import { getGlobalCollection, getMissingSources } from "~/integrations";
import type {
  IGlobalEmoteCollection,
  IGlobalEmoteCollectionRecord,
} from "~/integrations";

export const globalCollectionsService = {
  async loadMissing(state: Partial<IGlobalEmoteCollectionRecord>) {
    const missingSources = getMissingSources(state);
    const [collections] = await tupleSettledPromises<IGlobalEmoteCollection>(
      missingSources.map(getGlobalCollection),
    );
    const collectionsIdb = await idb.collections;
    await Promise.all(
      collections.map((collection) => collectionsIdb.global.add(collection)),
    );
    return collections;
  },
  async refresh(source: IGlobalEmoteCollection["source"]) {
    const newCollection = await getGlobalCollection(source);
    const collectionIdb = await idb.collections;
    await collectionIdb.global.put(newCollection);
    return newCollection;
  },
  async getAll() {
    if (typeof window === "undefined") {
      return {};
    }
    const collectionIdb = await idb.collections;
    const collections = await collectionIdb.global.getAll();
    return groupBy(
      collections,
      (collection) => collection.source,
    ) as Partial<IGlobalEmoteCollectionRecord>;
  },
};
