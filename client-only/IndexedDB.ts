import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type {
  IEmote,
  IEmoteCollection,
  IEmoteSet,
  IUserEmoteCollection,
  IGlobalEmoteCollection,
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

export interface EmoteCollectionsDBSchema extends DBSchema {
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
        value: Lowercase<string>;
      }
    | {
        key: "activeGlobalCollections";
        value: ("BetterTTV" | "SevenTV" | "FrankerFaceZ" | "Twitch")[];
      };
}

export interface EmotesDBSchema {
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

export async function openDBs() {
  const [collectionsDB, emotesDB] = await Promise.all([
    openDB<EmoteCollectionsDBSchema>("emote-collections", 2, {
      upgrade(database) {
        database.createObjectStore("users", {
          keyPath: "twitch.username",
        });
        // TODO in version 3 REMOVE @@global and saved from emote-collections database
        // database.deleteObjectStore("@@global");
        // database.deleteObjectStore("saved");
        database.createObjectStore("global", {
          keyPath: "source",
        });
        database.createObjectStore("key-value");
      },
    }),
    openDB<EmotesDBSchema>("emotes", 1, {
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

export function putUserEmotesToDB(
  db: IDBPDatabase<EmotesDBSchema>,
  userEmoteCollection: IUserEmoteCollection,
) {
  const emotes = createUserEmotesForIDB(userEmoteCollection);
  const emoteStore = db.transaction("emotes", "readwrite").store;
  return Promise.all(
    emotes.map((emote) => emoteStore.put({ ...emote, updatedAt: Date.now() })),
  );
}

export function putUserToDB(
  db: IDBPDatabase<EmoteCollectionsDBSchema>,
  userEmoteCollection: IUserEmoteCollection,
) {
  const user = createUserEmoteCollectionForIDB(userEmoteCollection);
  const usersStore = db.transaction("users", "readwrite").store;
  return usersStore.put({ ...user, updatedAt: Date.now() });
}

export async function getProperUserCollectionFromIDB(
  db: IDBPDatabase<EmotesDBSchema>,
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

export function createUserEmotesForIDB(
  userEmoteCollection: IUserEmoteCollection,
) {
  return Object.values(userEmoteCollection.collections).flatMap((collection) =>
    collection.sets.flatMap((set) => set.emotes),
  );
}

export function createUserEmoteCollectionForIDB(
  userEmoteCollection: IUserEmoteCollection,
): IndexedDBUserCollection {
  const collectionsList = Object.values(userEmoteCollection.collections).map(
    (collection) => ({
      name: collection.name,
      source: collection.source,
      updatedAt: collection.updatedAt,
      owner: collection.owner,
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
