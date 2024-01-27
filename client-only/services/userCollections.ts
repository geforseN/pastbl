import type { IDBPObjectStore } from "idb";
import Set from "core-js-pure/actual/set";
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
  __collectionsIdb: null,
  async getAllLogins() {
    if (typeof window === "undefined") {
      return [];
    }
    const collectionsIdb = await idb.collections;
    return collectionsIdb.users.getAllLogins();
  },
  async getAll() {
    if (typeof window === "undefined") {
      return [];
    }
    const collectionsIdb = await idb.collections;
    return collectionsIdb.users.getAll();
  },
  async put(collection: IUserEmoteCollection) {
    const [collectionsIdb, emotesIdb] = await Promise.all([
      idb.collections,
      idb.emotes,
    ]);
    const preparedCollection = prepareUserCollectionToIdb(collection);
    const emotes = Object.values(collection.integrations)
      .filter(
        (integration): integration is IUserEmoteIntegration =>
          integration.status === "ready",
      )
      .flatMap((collection) =>
        (collection as IUserEmoteIntegration).sets.flatMap(
          (set): IEmote[] => set.emotes,
        ),
      );
    await Promise.all([
      collectionsIdb.users.put(preparedCollection),
      emotesIdb.put(emotes),
    ]);
  },
  // FIXME
  // NOTE: the problem of collection deletion is that emotes of collection to remove can be in another collections
  // TODO: need to getAll collections and iterate over each emoteId in each collection
  // if emoteId is unique (occurs once) that emote with such id can be removed
  async delete(login: Lowercase<string>) {
    const [collectionsIdb, emotesIdb] = await Promise.all([
      idb.collections,
      idb.emotes,
    ]);
    const [collection, collections] = await Promise.all([
      collectionsIdb.users.get(login),
      this.getAll(),
    ]);
    assert.ok(collection);
    const otherCollection = withRemoved(
      collections,
      (collection) => collection.user.twitch.login === login,
    );
    const collection2 = flatGroupBy(
      Object.values(collection.integrations),
      (integration) => integration.source,
      (integration) => new Set(integration.sets.flatMap((set) => set.emoteIds)),
    );
    console.log(new Set());
    // const emoteAppearances = collections.reduce(
    //   (accumulator, collection) => {
    //     for (const integration of Object.values(collection.integrations)) {
    //       const { appearedMany, appearedOnce } =
    //         accumulator[integration.source];
    //       const emoteIds = integration.sets.flatMap((set) => set.emoteIds);
    //       for (const emoteId of emoteIds) {
    //         if (appearedOnce.has(emoteId)) {
    //           appearedOnce.delete(emoteId);
    //           appearedMany.add(emoteId);
    //         } else {
    //           appearedOnce.add(emoteId);
    //         }
    //       }
    //     }
    //     return accumulator;
    //   },
    //   {} as Record<
    //     AvailableEmoteSource,
    //     {
    //       appearedOnce: Set<IEmote["id"]>;
    //       appearedMany: Set<IEmote["id"]>;
    //     }
    //   >,
    // );
    // const emoteEntriesToRemove = Object.entries(emoteAppearances).map(
    //   ([source, { appearedOnce }]): [AvailableEmoteSource, IEmote["id"][]] => [
    //     source as AvailableEmoteSource,
    //     [...appearedOnce.values()],
    //   ],
    // );
    await collectionsIdb.users.delete(login);
  },
  async get(login: Lowercase<string>) {
    if (typeof window === "undefined") {
      return null;
    }
    const [collectionsIdb, emotesIdb] = await Promise.all([
      idb.collections,
      idb.emotes,
    ]);
    const idbCollection = await collectionsIdb.users.get(login);
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
      integrations: flatGroupBy(
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
    Object.values(integrations)
      .filter(
        (integration): integration is IUserEmoteIntegration =>
          integration.status === "ready",
      )
      .map(async (idbIntegration) => {
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
