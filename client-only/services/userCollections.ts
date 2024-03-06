import type { IDBPObjectStore } from "idb";
import { idb } from "~/client-only/IndexedDB";
import type {
  EmotesSchema,
  IndexedDBUserEmoteCollection,
  IndexedDBUserEmoteIntegration,
  IndexedDBUserEmoteIntegrationRecord,
} from "~/client-only/IndexedDB";
import {
  emoteSources,
  type EmoteOf,
  type IEmote,
  type IUserEmoteCollection,
  type IUserEmoteIntegration,
  type EmoteSource,
  isValidEmoteSource,
  isReadyUserIntegration,
  type EmoteT,
} from "~/integrations";
import { setIntersection } from "~/utils/set";

const IDB = {
  async _getIDB() {
    const collectionsIdb = await idb.collections;
    return collectionsIdb.users;
  },
  async getAllLogins() {
    if (process.server) {
      return [];
    }
    const IDB = await this._getIDB();
    return IDB.getAllLogins();
  },
  async getAll() {
    if (process.server) {
      return [];
    }
    const IDB = await this._getIDB();
    return IDB.getAll();
  },
};

const MAP = {
  FROM_IDB: {
    integration: {
      // FIXME: move from MAP
      getEmoteIds(integration: IndexedDBUserEmoteIntegration) {
        return integration.sets.flatMap((set) => set.emoteIds);
      },
    },
    collection: {
      async fullPrepare(
        collection: IndexedDBUserEmoteCollection,
        emotesStore: any,
      ) {
        const populatedIntegrations =
          await getPopulatedUserCollectionIntegrations(
            collection.integrations,
            emotesStore,
          );
        return {
          ...collection,
          integrations: flatGroupBy(
            populatedIntegrations,
            (integration) => integration.source,
          ),
        } as IUserEmoteCollection;
      },
      getEmoteIds(collection: IndexedDBUserEmoteCollection) {
        return flatGroupBy(
          Object.values(collection.integrations),
          (integration) => integration.source,
          (integration) =>
            new Set(MAP.FROM_IDB.integration.getEmoteIds(integration)),
        );
      },
    },
    collections: {
      getUniqueEmoteIds(collections: IndexedDBUserEmoteCollection[]) {
        return __emoteIds.getUnique(collections);
      },
    },
  },
  TO_IDB: {
    _integration: {
      // FIXME: move from MAP
      getEmotes(integration: IUserEmoteIntegration) {
        return integration.sets.flatMap((set): IEmote[] => set.emotes);
      },
      prepare(
        integration: IUserEmoteIntegration,
      ): IndexedDBUserEmoteIntegration {
        return {
          ...integration,
          sets: integration.sets.map((set) => {
            const { emotes, ...idbSet } = set;
            return {
              ...idbSet,
              emoteIds: emotes.map((emote) => emote.id),
            };
          }),
        };
      },
    },
    collection: {
      prepare(collection: IUserEmoteCollection): IndexedDBUserEmoteCollection {
        const idbIntegrations = Object.values(collection.integrations)
          .filter(isReadyUserIntegration)
          .map(MAP.TO_IDB._integration.prepare);
        return {
          ...collection,
          integrations: flatGroupBy(
            idbIntegrations,
            (idbIntegration) => idbIntegration.source,
          ) as IndexedDBUserEmoteIntegrationRecord,
        };
      },
      fullPrepare(collection: IUserEmoteCollection) {
        const readyIntegrations = Object.values(collection.integrations).filter(
          isReadyUserIntegration,
        );
        const idbIntegrations = readyIntegrations.map(
          MAP.TO_IDB._integration.prepare,
        );
        return {
          emotes: readyIntegrations.flatMap(MAP.TO_IDB._integration.getEmotes),
          collection: {
            ...collection,
            integrations: flatGroupBy(
              idbIntegrations,
              (idbIntegration) => idbIntegration.source,
            ) as IndexedDBUserEmoteIntegrationRecord,
          },
        };
      },
      getEmotes(collection: IUserEmoteCollection) {
        return Object.values(collection.integrations)
          .filter(isReadyUserIntegration)
          .flatMap(MAP.TO_IDB._integration.getEmotes);
      },
    },
  },
};

const __emoteIds = {
  getUnique(collections: IndexedDBUserEmoteCollection[]) {
    const setsOfEmoteIds = flatGroupBy(
      [...emoteSources],
      (source) => source,
      () => new Set<string>(),
    );
    const setsOfEmoteIdsToIgnore = flatGroupBy(
      [...emoteSources],
      (source) => source,
      () => new Set<string>(),
    );
    for (const collection of collections) {
      for (const integration of Object.values(collection.integrations)) {
        const source = integration.source;
        const emoteIds = setsOfEmoteIds[source];
        const emoteIdsToIgnore = setsOfEmoteIdsToIgnore[source];
        for (const set of integration.sets) {
          for (const emoteId of set.emoteIds) {
            if (emoteIdsToIgnore.has(emoteId)) {
              continue;
            }
            if (emoteIds.has(emoteId)) {
              emoteIdsToIgnore.add(emoteId);
              emoteIds.delete(emoteId);
            } else {
              emoteIds.add(emoteId);
            }
          }
        }
      }
    }
    return setsOfEmoteIds;
  },
};

export const userCollectionsService = {
  __emoteIds,
  _getIDB() {
    return IDB._getIDB();
  },
  getAllLogins() {
    return IDB.getAllLogins();
  },
  getAll() {
    return IDB.getAll();
  },
  async put(collection: IUserEmoteCollection) {
    const [IDB, emotesIdb] = await Promise.all([this._getIDB(), idb.emotes]);
    const { collection: preparedCollection, emotes } =
      MAP.TO_IDB.collection.fullPrepare(collection);
    // TODO: make it transactional (not a big deal)
    await Promise.all([IDB.put(preparedCollection), emotesIdb.put(emotes)]);
  },
  async delete(login: Lowercase<string>) {
    const [IDB, emotesIDB] = await Promise.all([this._getIDB(), idb.emotes]);
    const [collection, allCollections] = await Promise.all([
      IDB.get(login),
      await IDB.getAll(),
    ]);
    const collectionEmoteIdsRecord =
      MAP.FROM_IDB.collection.getEmoteIds(collection);
    const allEmoteIdsRecord =
      MAP.FROM_IDB.collections.getUniqueEmoteIds(allCollections);
    const deletePromises = Object.entries(allEmoteIdsRecord).map(
      // NOTE: MUST use async function OR assert will fail other promises
      // eslint-disable-next-line require-await
      async ([source, allEmoteIds]) => {
        assert.ok(isValidEmoteSource(source));
        const collectionEmoteIds = collectionEmoteIdsRecord[source];
        assert.ok(
          collectionEmoteIds,
          `User collection does not have ${source} source (not fatal)`,
        );
        const sameEmoteIds = setIntersection(collectionEmoteIds, allEmoteIds);
        const deleteEmotes = emotesIDB.deleteManyWithSource(source);
        return deleteEmotes([...sameEmoteIds]);
      },
    );
    // TODO: make it transactional (probably not a big deal)
    await Promise.all([
      tupleSettledPromises(deletePromises),
      IDB.delete(login),
    ]);
  },
  async get(login: Lowercase<string>) {
    if (process.server) {
      return null;
    }
    const [IDB, emotesIDB] = await Promise.all([this._getIDB(), idb.emotes]);
    const idbCollection = await IDB.get(login);
    const collection = MAP.FROM_IDB.collection.fullPrepare(
      idbCollection,
      emotesIDB.emotesTransaction.store,
    );
    return collection;
  },
};

const sourcesEmotesCache = flatGroupBy(
  [...emoteSources],
  (source) => source,
  () => new Map(),
) as {
  [S in EmoteSource]: Map<IEmote["id"], EmoteOf[S]>;
};
function getPopulatedUserCollectionIntegrations(
  integrations: Partial<IndexedDBUserEmoteIntegrationRecord>,
  emotesIdbStore: IDBPObjectStore<
    EmotesSchema,
    ["emotes"],
    "emotes",
    "readonly"
  >,
) {
  const ready = Object.values(integrations).filter(isReadyUserIntegration);
  const populatedAsPromises = ready.map(async (idbIntegration) => {
    const emotesCache = sourcesEmotesCache[idbIntegration.source];
    const sets = await Promise.all(
      idbIntegration.sets.map(
        populateUserCollectionEmotesSets(
          (emoteId) => emotesCache.get(emoteId),
          (emoteId) => emotesIdbStore.get([emoteId, idbIntegration.source]),
          (emote) => emotesCache.set(emote.id, emote),
        ),
      ),
    );
    return {
      ...idbIntegration,
      sets,
    } as IUserEmoteIntegration;
  });
  return Promise.all(populatedAsPromises);
}

function populateUserCollectionEmotesSets(
  getEmoteFromCache: (emoteId: string) => EmoteT | undefined,
  findEmote: (emoteId: string) => MaybePromise<EmoteT | undefined>,
  onEmoteFound: (emote: EmoteT) => void,
) {
  return async function (
    idbSet: IndexedDBUserEmoteIntegration["sets"][number],
  ): Promise<IUserEmoteIntegration["sets"][number]> {
    const { emoteIds, ...set } = idbSet;
    const [emotes] = await tupleSettledPromises(
      emoteIds.map(async (emoteId: string) => {
        const cachedEmote = getEmoteFromCache(emoteId);
        if (cachedEmote) {
          return cachedEmote;
        }
        const emote = await findEmote(emoteId);
        assert.ok(emote);
        onEmoteFound(emote);
        return emote;
      }),
    );
    return { ...set, emotes };
  };
}
