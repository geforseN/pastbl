import type { I7TVSet } from "./SevenTVSet";
import {
  SevenTVUserIntegration,
  type I7TVUserCollection,
} from "./SevenTVUserIntegration";

export function recreate7TVUserIntegration(
  collection: Readonly<I7TVUserCollection>,
  sets: [Readonly<I7TVSet>],
) {
  return new SevenTVUserIntegration(collection.owner, sets);
}
