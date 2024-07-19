import { openEmoteIntegrationsIndexedDBDatabase } from "../emote-integrations.indexed-db-open";
import type { EmoteIntegrationsIndexedDBSchema } from "../emote-integrations.indexed-db-schema";

export type WithEmoteIntegrationsIndexedDB =
  WithIndexedDBDatabase<EmoteIntegrationsIndexedDBSchema>;

const emoteIntegrationsIndexedDBPromise =
  openEmoteIntegrationsIndexedDBDatabase();

export const withEmoteIntegrationsIndexedDB = withIndexedDBDatabase(
  emoteIntegrationsIndexedDBPromise,
);
