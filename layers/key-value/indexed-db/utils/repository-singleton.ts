import { withIndexedDBDatabase } from "../../../indexed-db/utils/indexed-db";
import { openAppIndexedDBDatabase } from "../../../../app/utils/app-db-open";
import { KeyValueIndexedDBStore } from "./store";
import { KeyValueIndexedDBRepository } from "./repository";
import type { WithAppIndexedDB } from "./types";

const appIndexedDBPromise = openAppIndexedDBDatabase();

const withAppIndexedDB = withIndexedDBDatabase(
  appIndexedDBPromise,
) satisfies WithAppIndexedDB;

export const keyValueRepository = new KeyValueIndexedDBRepository(
  new KeyValueIndexedDBStore(withAppIndexedDB),
);
