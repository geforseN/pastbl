import { collectionsIdb } from "~/client-only/IndexedDB/emote-collections";
import { pastasIdb } from "~/client-only/IndexedDB/pastas";
import { emotesIdb } from "~/client-only/IndexedDB/emotes";
import { kvIdb } from "~/client-only/IndexedDB/keyValue";

export type { CollectionsSchema } from "./_schemas/emote-collections.schema";

export type { EmotesSchema } from "./_schemas/emotes.schema";

export type { PastasSchema } from "./_schemas/pastas.schema";

export type {
  IndexedDBKeyValueStoreSchema,
  KeyValueSchema,
} from "./_schemas/key-value.schema";

export const idb = {
  collections: collectionsIdb,
  emotes: emotesIdb,
  pastas: pastasIdb,
  kv: kvIdb,
};
