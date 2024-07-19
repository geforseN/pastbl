import { openPastasIndexedDB } from "$/pastas/-indexed-db/pastas.indexed-db-open";
import { PastasListIndexedDBStore } from "~~/layers/pastas/-indexed-db/pastas.indexed-db-store.list";
import { PastasIndexedDBTransactions } from "$/pastas/-indexed-db/pastas.indexed-db-transactions";
import { PastasIndexedDBStorage } from "$/pastas/-indexed-db/pastas.indexed-db-storage";
import { PastasService } from "$/pastas/pastas.service";

const pastasIndexedDBPromise = openPastasIndexedDB();

const withPastasIndexedDB = withIndexedDBDatabase(pastasIndexedDBPromise);

export const pastasService = new PastasService(
  new PastasIndexedDBStorage(
    new PastasListIndexedDBStore(withPastasIndexedDB),
    new PastasIndexedDBTransactions(withPastasIndexedDB),
  ),
);
