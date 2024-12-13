import { PastasIndexedDBTransactions } from "../../layers/indexed-db/utils/pastas-db-transactions";
import { PastasListIndexedDBStore } from "../../layers/indexed-db/utils/pastas-db-store";
import { PastasIndexedDBRepository } from "../../layers/indexed-db/utils/pastas-db-repository";
import { withIndexedDBDatabase } from "../../../indexed-db/utils/indexed-db";
import { openPastasIndexedDB } from "../../layers/indexed-db/utils/pastas-db-open";
import { PastasService } from "./implementation";

const pastasIndexedDBPromise = openPastasIndexedDB();

const withPastasIndexedDB = withIndexedDBDatabase(pastasIndexedDBPromise);

export const pastasService = new PastasService(
  new PastasIndexedDBRepository(
    new PastasListIndexedDBStore(withPastasIndexedDB),
    new PastasIndexedDBTransactions(withPastasIndexedDB),
  ),
);
