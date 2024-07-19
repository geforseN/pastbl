import { groupAsync } from "~/utils/promise";
import type { IPersonsEmoteCollectionsStorage } from "./person-emote-collection.abstract";
import type { TPersonEmoteCollection } from "~~/layers/emote-integrations/persons-emote-collections/PersonEmoteCollection";
import type { EmoteId } from "~/brands";

class IndexedDBPersonEmoteCollection {
  constructor(private readonly collection: TPersonEmoteCollection.Default) {}

  get integrations() {
    return new personEmoteCollection.Integrations(this.collection.integrations);
  }

  toIndexedDB() {
    const readyIntegrations = this.integrations.ready;
    const integrations = readyIntegrations.map(
      (integration) => new personEmoteCollection.Integration(integration),
    );
    return {
      emotes: new personEmoteCollection.IntegrationsEmotes(integrations)
        .asArray,
      collection: {
        formedAt: this.collection.formedAt,
        person: this.collection.person,
        integrations: flatGroupBySource(
          integrations.map((integration) => integration.toIndexedDB()),
        ) as TPersonEmoteCollection.SettledIndexedDB,
      },
    };
  }
}

const emotesIntegrationsDatabase = {
  async insertPersonCollection({ collection, emotes }) {
    await Promise.all([
      this.personsCollectionsStore.put(collection),
      this.emoteStore.put(emotes),
    ]);
  },
};

export class PersonsEmoteCollectionsService<
  C extends TPersonEmoteCollection.Minimal,
> {
  constructor(private readonly storage: IPersonsEmoteCollectionsStorage<C>) {}

  getAll() {
    return this.storage.getAll();
  }

  getAllLogins() {
    return this.storage.getAllLogins();
  }

  async put(collection: TPersonEmoteCollection.Default) {
    return await emotesIntegrationsDatabase.insertPersonCollection(
      new IndexedDBPersonEmoteCollection(collection).toIndexedDB(),
    );
  }

  async load(login: TwitchUserLogin) {
    const collection = await personsCollectionsAPI.get(login);
    await this.put(collection);
    return collection;
  }

  async delete(login: TwitchUserLogin) {}

  async get(login: TwitchUserLogin) {
    if (import.meta.server) {
      return null;
    }
    const idbCollection = await this.storage.get(login);
    const emoteTransaction = await emotesService.emotesTransaction;
    const collection = await MAP.FROM_IDB.collection.fullPrepare(
      idbCollection,
      (source) => (emoteId) => emoteTransaction.store.get([emoteId, source]),
    );
    return collection;
  }
}

const sourcesEmotesCache = allEmoteSources.flatGroupBy(
  (source) => source,
  () => new Map(),
) as {
  [S in EmoteSource]: Map<EmoteId, EmoteOf[S]>;
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
