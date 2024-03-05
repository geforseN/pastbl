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
} from "~/integrations";

export const userCollectionsService = {
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
  async put(collection: IUserEmoteCollection) {
    const [IDB, emotesIdb] = await Promise.all([this._getIDB(), idb.emotes]);
    const preparedCollection = prepareUserCollectionToIdb(collection);
    const emotes = Object.values(collection.integrations)
      .filter(
        (integration): integration is IUserEmoteIntegration =>
          integration.status === "ready",
      )
      .flatMap((integration) =>
        (integration as IUserEmoteIntegration).sets.flatMap(
          (set): IEmote[] => set.emotes,
        ),
      );
    await Promise.all([IDB.put(preparedCollection), emotesIdb.put(emotes)]);
  },
  // FIXME
  // NOTE: the problem of collection deletion is that emotes of collection to remove can be in another collections
  // TODO: need to getAll collections and iterate over each emoteId in each collection
  // if emoteId is unique (occurs once) that emote with such id can be removed
  async delete(login: Lowercase<string>) {
    const [IDB] = await Promise.all([this._getIDB(), idb.emotes]);
    const [collection] = await Promise.all([IDB.get(login), this.getAll()]);
    assert.ok(collection);
    await IDB.delete(login);
  },
  async get(login: Lowercase<string>) {
    if (process.server) {
      return null;
    }
    const [IDB, emotesIdb] = await Promise.all([this._getIDB(), idb.emotes]);
    const idbCollection = await IDB.get(login);
    assert.ok(
      idbCollection,
      "Failed to find loaded user collection in your browser storage (IndexedDB)",
    );
    const populatedIntegrations = await getPopulatedUserCollectionIntegrations(
      idbCollection.integrations,
      emotesIdb.emotesTransaction.store,
    );
    const selectedUserCollection = {
      ...idbCollection,
      integrations: flatGroupBy(
        populatedIntegrations,
        (integration) => integration.source,
      ),
    } as IUserEmoteCollection;
    assert.ok(selectedUserCollection);
    return withLogSync(selectedUserCollection, "selectedUserCollection");
  },
};

function prepareUserCollectionToIdb(
  collection: IUserEmoteCollection,
): IndexedDBUserEmoteCollection {
  // FIXME: add some util type so filter filter fail and success in integrations
  // NOTE: for now user will not see failed integrations, need to group integrations by it's status
  const idbIntegrations = Object.values(collection.integrations)
    .filter(
      (integration): integration is IUserEmoteIntegration =>
        integration.status === "ready",
    )
    .map((integration) => ({
      ...(integration as IUserEmoteIntegration),
      sets: (integration as IUserEmoteIntegration).sets.map((set) => {
        const { emotes, ...idbSet } = set;
        return {
          ...idbSet,
          emoteIds: emotes.map((emote) => emote.id),
        };
      }),
    }));
  const integrationsRecord = flatGroupBy(
    idbIntegrations,
    (idbIntegration) => idbIntegration.source,
  ) as IndexedDBUserEmoteIntegrationRecord;
  return {
    ...collection,
    integrations: integrationsRecord,
  };
}

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
  const ready = Object.values(integrations).filter(
    (integration): integration is IUserEmoteIntegration =>
      integration.status === "ready",
  );
  const populatedAsPromises = ready.map(async (idbIntegration) => {
    const emotesCache = sourcesEmotesCache[idbIntegration.source];
    const sets = await Promise.all(
      idbIntegration.sets.map(
        populateUserCollectionEmotesSets(emotesCache, emotesIdbStore),
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
  emotesCache: Map<string, IEmote>,
  emotesIdbStore: IDBPObjectStore<
    EmotesSchema,
    ["emotes"],
    "emotes",
    "readonly"
  >,
) {
  return async function (
    idbSet: IndexedDBUserEmoteIntegration["sets"][number],
  ): Promise<IUserEmoteIntegration["sets"][number]> {
    const { emoteIds, ...set } = idbSet;
    const [emotes] = await tupleSettledPromises(
      emoteIds.map(async (emoteId: string) => {
        const cachedEmote = emotesCache.get(emoteId);
        if (cachedEmote) {
          return cachedEmote;
        }
        const emote = await emotesIdbStore.get([emoteId, set.source]);
        emotesCache.set(emoteId, emote);
        return emote;
      }),
    );
    return {
      ...set,
      emotes: emotes.filter(isNotNullish),
    };
  };
}
