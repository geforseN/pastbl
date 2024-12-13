import { withIndexedDBDatabase } from "../../../../indexed-db/utils/indexed-db.with";
import type { WithIndexedDBDatabase } from "../../../../indexed-db/utils/indexed-db.with";
import { openEmoteIntegrationsIndexedDBDatabase } from "./open";
import type { EmoteIntegrationsIndexedDBSchema } from "./schema";

export type WithEmoteIntegrationsIndexedDB =
  WithIndexedDBDatabase<EmoteIntegrationsIndexedDBSchema>;

const emoteIntegrationsIndexedDBPromise
  = openEmoteIntegrationsIndexedDBDatabase();

export const withEmoteIntegrationsIndexedDB = withIndexedDBDatabase(
  emoteIntegrationsIndexedDBPromise,
);
