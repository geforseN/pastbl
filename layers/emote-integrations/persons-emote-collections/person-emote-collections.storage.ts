import type { TPersonEmoteCollection } from "../emote-integrations/base/PersonEmoteCollection";
import type { IPersonsEmoteCollectionsStorage } from "./utils/person-emote-collection.abstract";

export class PersonsEmoteCollectionsStorage
  implements
    IPersonsEmoteCollectionsStorage<TPersonEmoteCollection.SettledIndexedDB> {}
