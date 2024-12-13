import { PersonsEmotesCollectionsIndexedDBTransactions } from "../layers/indexed-db/utils/transactions-store";
import { PersonsEmotesIndexedDBStore } from "../layers/emotes/utils/indexed-db-store";
import { withEmoteIntegrationsIndexedDB } from "../../indexed-db/utils/with";
import { PersonsEmoteCollectionsIndexedDBStore } from "../layers/indexed-db/utils/store";
import { PersonsEmoteCollectionsIndexedDBRepository } from "../layers/indexed-db/utils/repository";
import { PersonsEmotesCollectionsApi } from "./api";
import { PersonsEmotesCollectionsService } from "./service";

export const personsEmotesCollectionsService
  = new PersonsEmotesCollectionsService(
    new PersonsEmoteCollectionsIndexedDBRepository(
      new PersonsEmoteCollectionsIndexedDBStore(withEmoteIntegrationsIndexedDB),
      new PersonsEmotesIndexedDBStore(withEmoteIntegrationsIndexedDB),
      new PersonsEmotesCollectionsIndexedDBTransactions(
        withEmoteIntegrationsIndexedDB,
      ),
    ),
    new PersonsEmotesCollectionsApi(
      $fetch.create({ baseURL: "/api/v1/persons-emotes-collections" }),
    ),
  );
