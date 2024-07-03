import { emotesIDB } from "./emotes";
import type { IndexedDBUserEmoteIntegration } from "~/client-only/IndexedDB";
import { API } from "~~/layers/person-emote-collections/server/utils/person-emote-collection.api";
import { type IEmote, isReadyUserIntegration } from "~/integrations";
import {
  emoteSources,
  isEmoteSource,
  type EmoteSource,
} from "~/integrations/emote-source";
import { groupAsync } from "~/utils/promise";
import { setIntersection } from "~/utils/set";
import { store } from "~/client-only/services/emote-collection-person/emote-collection-person-store";
import type {
  IPersonEmoteCollection,
  TEmoteIntegrations,
} from "~/integrations/abstract";

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
        makeFindEmoteFn: (
          source: EmoteSource,
        ) => (emoteId: string) => MaybePromise<EmoteT | undefined>,
      ) {
        const populatedIntegrations = await getPopulatedIntegrations(
          collection.integrations,
          makeFindEmoteFn,
        );
        return {
          ...collection,
          integrations: flatGroupBySource(populatedIntegrations),
        } as IPersonEmoteCollection;
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
        return emoteIds.getUnique(collections);
      },
    },
  },
  FOR_IDB: {
    _integration: {
      // FIXME: move from MAP
      getEmotes(integration: IPersonEmoteCollection) {
        return integration.sets.flatMap((set): IEmote[] => set.emotes);
      },
      prepare(integration: IPersonEmoteCollection) {
        return {
          ...integration,
          sets: integration.sets.map((set) => {
            const { emotes, ...idbSet } = set;
            return {
              ...idbSet,
              emoteIds: (emotes ?? []).map((emote) => emote.id),
            };
          }),
        } as IndexedDBUserEmoteIntegration;
      },
    },
    collection: {
      fullPrepare(collection: IPersonEmoteCollection) {
        const integrations = new personEmoteCollection.Integrations(
          collection.integrations,
        );
        const readyIntegrations = integrations.ready;
        const idbIntegrations = readyIntegrations.map(
          MAP.FOR_IDB._integration.prepare,
        );
        return {
          emotes: readyIntegrations.flatMap(MAP.FOR_IDB._integration.getEmotes),
          collection: {
            ...collection,
            integrations: flatGroupBySource(
              idbIntegrations,
            ) as TEmoteIntegrations.Person.IndexedDBRecord,
          },
        };
      },
    },
  },
};

const emoteIds = {
  getUnique(collections: IndexedDBUserEmoteCollection[]) {
    const setsOfEmoteIds = mapFlatGroupBy(
      emoteSources,
      (source) => source,
      () => new Set<string>(),
    );
    const setsOfEmoteIdsToIgnore = mapFlatGroupBy(
      emoteSources,
      (source) => source,
      () => new Set<string>(),
    );
    for (const collection of collections) {
      const integrations = Object.values(collection.integrations);
      for (const integration of integrations) {
        const { source } = integration;
        const emoteIds = setsOfEmoteIds.get(source)!;
        const emoteIdsToIgnore = setsOfEmoteIdsToIgnore.get(source)!;
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
  getAllLogins: store.getAllLogins.bind(store),
  getAll: store.getAll.bind(store),
  async put(collection: IPersonEmoteCollection) {
    const { collection: preparedCollection, emotes } =
      MAP.FOR_IDB.collection.fullPrepare(collection);
    // TODO: make it transactional (not a big deal)
    await Promise.all([store.put(preparedCollection), emotesIDB.put(emotes)]);
  },
  async load(login: TwitchUserLogin) {
    const collection = await API.get(login);
    await this.put(collection);
    return collection;
  },
  async delete(login: TwitchUserLogin) {
    const [collection, allCollections] = await Promise.all([
      store.get(login),
      store.getAll(),
    ]);
    const collectionEmoteIdsRecord =
      MAP.FROM_IDB.collection.getEmoteIds(collection);
    const allEmoteIdsRecord =
      MAP.FROM_IDB.collections.getUniqueEmoteIds(allCollections);
    const deletePromises = Object.entries(allEmoteIdsRecord).map(
      // NOTE: MUST use async function OR assert will fail other promises
      async ([source, allEmoteIds]) => {
        assert.ok(isEmoteSource(source));
        const collectionEmoteIds = collectionEmoteIdsRecord[source];
        assert.ok(
          collectionEmoteIds,
          `User collection does not have ${source} source (not fatal)`,
        );
        const sameEmoteIds = setIntersection(collectionEmoteIds, allEmoteIds);
        const deleteEmotes = await emotesIDB.makeDeleteEmotesFn(source);
        return deleteEmotes([...sameEmoteIds]);
      },
    );
    // TODO: make it transactional (probably not a big deal)
    await Promise.all([groupAsync(deletePromises), store.delete(login)]);
  },
  async get(login: TwitchUserLogin) {
    if (import.meta.server) {
      return null;
    }
    const idbCollection = await store.get(login);
    const emoteTransaction = await emotesIDB.emotesTransaction;
    const collection = await MAP.FROM_IDB.collection.fullPrepare(
      idbCollection,
      (source) => (emoteId) => emoteTransaction.store.get([emoteId, source]),
    );
    return collection;
  },
};

const sourcesEmotesCache = flatGroupBy(
  emoteSources,
  (source) => source,
  () => new Map(),
) as {
  [S in EmoteSource]: Map<IEmote["id"], EmoteOf[S]>;
};

function getPopulatedIntegrations(
  integrations: Partial<TEmoteIntegrations.Person.IndexedDBRecord>,
  makeFindEmoteFn: (
    source: EmoteSource,
  ) => (emoteId: string) => MaybePromise<EmoteT | undefined>,
) {
  const readyIntegrations = Object.values(integrations).filter(
    isReadyUserIntegration,
  );
  const populatedAsPromises = readyIntegrations.map(async (idbIntegration) => {
    const { source } = idbIntegration;
    const emotesCache = sourcesEmotesCache[source];
    const getEmoteFromCache = emotesCache.get.bind(emotesCache);
    const findEmote = makeFindEmoteFn(source);
    const setEmoteToCache = (emote: EmoteT) => emotesCache.set(emote.id, emote);
    const populateSet = makeSetPopulateFn(
      getEmoteFromCache,
      findEmote,
      setEmoteToCache,
    );
    const populatedSetsPromises = idbIntegration.sets.map(populateSet);
    const sets = await Promise.all(populatedSetsPromises);
    return {
      ...idbIntegration,
      sets,
    } as IPersonEmoteCollection;
  });
  return Promise.all(populatedAsPromises);
}

function makeSetPopulateFn(
  getEmoteFromCache: (emoteId: string) => EmoteT | undefined,
  findEmote: (emoteId: string) => MaybePromise<EmoteT | undefined>,
  onEmoteFound: (emote: EmoteT) => void,
) {
  return async function (idbSet: IndexedDBUserEmoteSet) {
    const { emoteIds, ...set } = idbSet;
    const { fulfilled: emotes = [] } = await groupAsync(
      (emoteIds ?? []).map(async (emoteId: string) => {
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
    return { ...set, emotes } as IEmoteSetT;
  };
}
