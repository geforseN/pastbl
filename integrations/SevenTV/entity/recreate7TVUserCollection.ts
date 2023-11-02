import type { I7TVSet } from "./SevenTVSet";
import {
  SevenTVUserCollection,
  type I7TVUserCollection,
} from "./SevenTVUserCollection";

export function recreate7TVUserCollection(
  collection: Readonly<I7TVUserCollection>,
  sets: [Readonly<I7TVSet>],
) {
  return new SevenTVUserCollection(collection.owner, sets);
}
