import { PersonsEmoteCollectionsIndexedDBStore } from "../person-emote-collections.indexed-db-store";
import { PersonsEmoteCollectionsStorage } from "../person-emote-collections.storage";
import { PersonsEmoteCollectionsService } from "./person-emote-collections.service";

export const personsEmoteCollectionsService = new PersonsEmoteCollectionsService(
  new PersonsEmoteCollectionsIndexedDBStore(),
);
