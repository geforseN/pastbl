import type { IDBPObjectStore } from "idb";
import { idb } from "~/client-only/IndexedDB";
import type {
  EmotesSchema,
  IndexedDBUserEmoteCollection,
  IndexedDBUserEmoteIntegration,
  IndexedDBUserEmoteIntegrationRecord,
} from "~/client-only/IndexedDB";
import type {
  EmoteOf,
  IEmote,
  IUserEmoteCollection,
  IUserEmoteIntegration,
} from "~/integrations";

export const userCollectionsService = {
  async getAllUsernames() {
    if (typeof window === "undefined") {
      return [];
    }
    const collectionsIdb = await idb.collections;
    return collectionsIdb.users.getAllUsernames();
  },
  async refresh(collection: IUserEmoteCollection) {
    const [collectionsIdb, emotesIdb] = await Promise.all([
      idb.collections,
      idb.emotes,
    ]);
    const preparedCollection = prepareUserCollectionToIdb(collection);
    const emotes = Object.values(collection.integrations).flatMap(
      (collection) => collection.sets.flatMap((set): IEmote[] => set.emotes),
    );
    await Promise.all([
      collectionsIdb.users.put(preparedCollection),
      emotesIdb.put(emotes),
    ]);
  },
  async get(username: Lowercase<string>) {
    if (typeof window === "undefined") {
      return null;
    }
    const [collectionsIdb, emotesIdb] = await Promise.all([
      idb.collections,
      idb.emotes,
    ]);
    const idbCollection = await collectionsIdb.users.get(username);
    assert.ok(
      idbCollection,
      "Failed to find loaded user collection in your browser storage (IndexedDB)",
    );
    const emotesIdbStore = emotesIdb.emotesTransaction.store;
    const populatedIntegrations = await getPopulatedUserCollectionIntegrations(
      idbCollection.integrations,
      emotesIdbStore,
    );
    const selectedUserCollection = {
      ...idbCollection,
      integrations: groupBy(
        populatedIntegrations,
        (integration) => integration.source,
      ),
    } as IUserEmoteCollection;
    return withLogSync(selectedUserCollection, "selectedUserCollection");
  },
};

function prepareUserCollectionToIdb(
  collection: IUserEmoteCollection,
): IndexedDBUserEmoteCollection {
  const idbIntegrations = Object.values(collection.integrations).map(
    (integration) => ({
      ...integration,
      sets: integration.sets.map((set) => {
        const { emotes, ...idbSet } = set;
        return {
          ...idbSet,
          emoteIds: emotes.map((emote) => emote.id),
        };
      }),
    }),
  );
  const integrationsRecord = groupBy(
    idbIntegrations,
    (idbIntegration) => idbIntegration.source,
  ) as IndexedDBUserEmoteIntegrationRecord;
  return {
    ...collection,
    integrations: integrationsRecord,
  };
}

const sourcesEmotesCache = {
  FrankerFaceZ: new Map<IEmote["id"], EmoteOf["FrankerFaceZ"]>(),
  BetterTTV: new Map<IEmote["id"], EmoteOf["BetterTTV"]>(),
  SevenTV: new Map<IEmote["id"], EmoteOf["SevenTV"]>(),
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
  return Promise.all(
    Object.values(integrations).map(async (idbIntegration) => {
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
    }),
  );
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
