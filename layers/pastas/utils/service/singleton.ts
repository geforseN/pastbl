import { PastasIndexedDBTransactions } from "../../layers/indexed-db/utils/pastas.indexed-db-transactions";
import { PastasListIndexedDBStore } from "../../layers/indexed-db/utils/pastas.indexed-db-store.list";
import { PastasIndexedDBRepository } from "../../layers/indexed-db/utils/pastas.indexed-db-repository";
import { withIndexedDBDatabase } from "../../../indexed-db/utils/indexed-db.with";
import { openPastasIndexedDB } from "../../layers/indexed-db/utils/pastas.indexed-db-open";
import { PastasService } from "./implementation";

const pastasIndexedDBPromise = openPastasIndexedDB();

const withPastasIndexedDB = withIndexedDBDatabase(pastasIndexedDBPromise);

export const pastasService = new PastasService(
  new PastasIndexedDBRepository(
    new PastasListIndexedDBStore(withPastasIndexedDB),
    new PastasIndexedDBTransactions(withPastasIndexedDB),
  ),
);
