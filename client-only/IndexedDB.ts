import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type {
  IEmote,
  IEmoteCollection,
  IEmoteSet,
  IUserEmoteCollection,
  IGlobalEmoteCollection,
  EmoteCollectionsRecord,
} from "~/integrations";
import { UserEmoteCollection } from "~/integrations/UserEmoteCollection";

export type IndexedDBEmoteSet = Omit<IEmoteSet, "emotes"> & {
  emoteIds: IEmote["id"][];
};

export type IndexedDBEmoteCollection = Omit<IEmoteCollection, "sets"> & {
  sets: IndexedDBEmoteSet[];
};

export interface IndexedDBUserCollection {
  twitch: {
    nickname: string;
    id: number;
    username: Lowercase<IndexedDBUserCollection["twitch"]["nickname"]>;
  };
  updatedAt: number;
  collections: Record<
    "BetterTTV" /* | "Twitch" */ | "SevenTV" | "FrankerFaceZ",
    // FIXME: uncomment above when twitch api calls will be implemented
    IndexedDBEmoteCollection
  >;
  failedCollectionsReasons:
    | Record<"BetterTTV" | "SevenTV" | "FrankerFaceZ", string>
    | Record<string, never>;
}

export interface EmoteCollectionsSchema extends DBSchema {
  users: {
    key: IndexedDBUserCollection["twitch"]["username"];
    value: IndexedDBUserCollection;
  };
  global: {
    key: IGlobalEmoteCollection["source"];
    value: IGlobalEmoteCollection;
  };
  "key-value":
    | {
        key: "activeUserCollection";
        value: IUserEmoteCollection;
      }
    | {
        key: "activeGlobalCollections";
        value: ("BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch")[];
      };
}

export interface EmotesSchema {
  emotes: {
    key: [IEmote["id"], IEmote["source"]];
    value: IEmote & { updatedAt: number };
    indexes: {
      byId: IEmote["id"];
      bySource: "BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch";
      byToken: IEmote["token"];
      byTags: string[];
    };
  };
}

export const openEmoteCollections = openDB<EmoteCollectionsSchema>(
  "emote-collections",
  3,
  {
    upgrade(database) {
      database.createObjectStore("users", {
        keyPath: "twitch.username",
      });
      database.createObjectStore("global", {
        keyPath: "source",
      });
      database.createObjectStore("key-value");
    },
  },
);

export async function openDBs() {
  const [collectionsDB, emotesDB] = await Promise.all([
    openEmoteCollections,
    openDB<EmotesSchema>("emotes", 1, {
      upgrade(database) {
        const emotesStore = database.createObjectStore("emotes", {
          keyPath: ["id", "source"],
        });
        emotesStore.createIndex("bySource", "source", { unique: false });
        emotesStore.createIndex("byId", "id", { unique: false });
        emotesStore.createIndex("byToken", "token", { unique: false });
        // NOTE: tags only exist in 7TV emotes (as i know)
        emotesStore.createIndex("byTags", "tags", {
          unique: false,
          multiEntry: true,
        });
      },
    }),
  ]);

  return { collectionsDB, emotesDB };
}

export async function getKeyValueStore() {
  const db = await openDB<EmoteCollectionsSchema>("emote-collections");
  return db.transaction("key-value", "readwrite").store;
}

export function putUserToDB(
  db: IDBPDatabase<EmoteCollectionsSchema>,
  userEmoteCollection: IUserEmoteCollection,
) {
  const user = prepareUserEmoteCollectionForIDB(userEmoteCollection);
  const usersStore = db.transaction("users", "readwrite").store;
  return usersStore.put({ ...user, updatedAt: Date.now() });
}

export function prepareUserEmoteCollectionForIDB(
  userEmoteCollection: IUserEmoteCollection,
): IndexedDBUserCollection {
  const collectionsList = Object.values(userEmoteCollection.collections).map(
    (collection) => ({
      ...collection,
      sets: collection.sets.map((setToInclude) => {
        const { emotes, ...set } = setToInclude;
        return {
          ...set,
          emoteIds: emotes.map((emote) => emote.id),
        };
      }),
    }),
  );

  return {
    ...userEmoteCollection,
    collections: arrayToRecordByValueOfKey(collectionsList, "source"),
  };
}

export function putUserEmotesToDB(
  db: IDBPDatabase<EmotesSchema>,
  userEmoteCollection: IUserEmoteCollection,
) {
  const emotes = prepareUserEmotesForIDB(userEmoteCollection);
  const emoteStore = db.transaction("emotes", "readwrite").store;
  return Promise.all(
    emotes.map((emote) => emoteStore.put({ ...emote, updatedAt: Date.now() })),
  );
}

export function prepareUserEmotesForIDB(
  userEmoteCollection: IUserEmoteCollection,
) {
  return Object.values(userEmoteCollection.collections).flatMap((collection) =>
    collection.sets.flatMap((set) => set.emotes),
  );
}

export async function getProperUserCollectionFromIDB(
  db: IDBPDatabase<EmotesSchema>,
  userFromStore: IndexedDBUserCollection,
): Promise<IUserEmoteCollection> {
  const emoteStore = db.transaction("emotes").store;
  return {
    ...userFromStore,
    collections: await Promise.all(
      Object.values(userFromStore.collections).map((idbCollection) =>
        UserEmoteCollection.fromIDBCollection(idbCollection, (emoteId) =>
          emoteStore.get([emoteId, idbCollection.source]),
        ),
      ),
    ).then(
      (collections) =>
        arrayToRecordByValueOfKey(
          collections,
          "source",
        ) as EmoteCollectionsRecord,
    ),
  };
}
